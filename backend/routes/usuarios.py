"""
Rotas da API para gerenciamento de usuários
Endpoints CRUD completos
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
from datetime import datetime
import hashlib

from database import get_db
from models import Usuario, StatusUsuario, TipoUsuario
from schemas import (
    UsuarioCreate, 
    UsuarioUpdate, 
    UsuarioResponse, 
    UsuarioFiltros,
    UsuarioStats
)

# IMPORTANTE: redirect_slashes=False evita 307 redirects
router = APIRouter(prefix="/api/usuarios", tags=["Usuários"], redirect_slashes=False)

def hash_senha(senha: str) -> str:
    """Hash simples para senha (em produção usar bcrypt)"""
    return hashlib.sha256(senha.encode()).hexdigest()

@router.get("/", response_model=List[UsuarioResponse])
def listar_usuarios(
    busca: Optional[str] = Query(None, description="Buscar por nome ou email"),
    tipo: Optional[str] = Query(None, description="Filtrar por tipo: admin, gestor, vendedor"),
    status: Optional[str] = Query(None, description="Filtrar por status: ativo, inativo, bloqueado"),
    departamento: Optional[str] = Query(None, description="Filtrar por departamento"),
    limite: int = Query(100, ge=1, le=1000, description="Máximo de resultados"),
    offset: int = Query(0, ge=0, description="Pular N resultados (paginação)"),
    db: Session = Depends(get_db)
):
    """
    Lista todos os usuários com filtros opcionais
    
    **Filtros disponíveis:**
    - `busca`: Busca por nome ou email (case insensitive)
    - `tipo`: admin, gestor ou vendedor
    - `status`: ativo, inativo ou bloqueado
    - `departamento`: Nome do departamento
    - `limite`: Quantidade máxima de resultados (padrão: 100)
    - `offset`: Pular N resultados para paginação (padrão: 0)
    
    **Exemplo:**
    ```
    GET /api/usuarios?busca=silva&tipo=vendedor&status=ativo&limite=10
    ```
    """
    query = db.query(Usuario)
    
    # Filtro de busca (nome ou email)
    if busca:
        query = query.filter(
            or_(
                Usuario.nome.ilike(f"%{busca}%"),
                Usuario.email.ilike(f"%{busca}%")
            )
        )
    
    # Filtro por tipo
    if tipo:
        try:
            tipo_enum = TipoUsuario(tipo)
            query = query.filter(Usuario.tipo == tipo_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tipo inválido: {tipo}. Use: admin, gestor ou vendedor"
            )
    
    # Filtro por status
    if status:
        try:
            status_enum = StatusUsuario(status)
            query = query.filter(Usuario.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Status inválido: {status}. Use: ativo, inativo ou bloqueado"
            )
    
    # Filtro por departamento
    if departamento:
        query = query.filter(Usuario.departamento.ilike(f"%{departamento}%"))
    
    # Paginação e ordenação
    usuarios = query.order_by(Usuario.criado_em.desc()).offset(offset).limit(limite).all()
    
    return usuarios

@router.get("/stats", response_model=UsuarioStats)
def obter_estatisticas(db: Session = Depends(get_db)):
    """
    Retorna estatísticas agregadas sobre usuários
    
    **Retorna:**
    - Total de usuários
    - Quantidade por status (ativo, inativo, bloqueado)
    - Quantidade por tipo (admin, gestor, vendedor)
    - Quantidade por departamento
    
    **Exemplo de resposta:**
    ```json
    {
      "total": 25,
      "ativos": 20,
      "inativos": 3,
      "bloqueados": 2,
      "por_tipo": {"admin": 2, "gestor": 5, "vendedor": 18},
      "por_departamento": {"Vendas": 15, "TI": 4, "Marketing": 6}
    }
    ```
    """
    total = db.query(Usuario).count()
    ativos = db.query(Usuario).filter(Usuario.status == StatusUsuario.ATIVO).count()
    inativos = db.query(Usuario).filter(Usuario.status == StatusUsuario.INATIVO).count()
    bloqueados = db.query(Usuario).filter(Usuario.status == StatusUsuario.BLOQUEADO).count()
    
    # Contagem por tipo
    por_tipo = {}
    tipos = db.query(Usuario.tipo, func.count(Usuario.id)).group_by(Usuario.tipo).all()
    for tipo, count in tipos:
        por_tipo[tipo.value if tipo else 'sem_tipo'] = count
    
    # Contagem por departamento
    por_departamento = {}
    deptos = db.query(Usuario.departamento, func.count(Usuario.id)).group_by(Usuario.departamento).all()
    for depto, count in deptos:
        por_departamento[depto if depto else 'sem_departamento'] = count
    
    return {
        "total": total,
        "ativos": ativos,
        "inativos": inativos,
        "bloqueados": bloqueados,
        "por_tipo": por_tipo,
        "por_departamento": por_departamento
    }

@router.get("/{usuario_id}", response_model=UsuarioResponse)
def obter_usuario(
    usuario_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtém um usuário específico por ID
    
    **Parâmetros:**
    - `usuario_id`: ID do usuário (inteiro)
    
    **Retorna:**
    - Objeto usuário com todos os campos
    
    **Erros:**
    - 404: Usuário não encontrado
    """
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuário com ID {usuario_id} não encontrado"
        )
    
    return usuario

@router.post("/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def criar_usuario(
    usuario_data: UsuarioCreate,
    db: Session = Depends(get_db)
):
    """
    Cria um novo usuário
    
    **Body (JSON):**
    ```json
    {
      "nome": "João Silva",
      "email": "joao@empresa.com",
      "senha": "senha123",
      "tipo": "vendedor",
      "status": "ativo",
      "departamento": "Vendas",
      "telefone": "(85) 99999-9999"
    }
    ```
    
    **Validações:**
    - Nome: mínimo 3 caracteres
    - Email: formato válido e único
    - Senha: mínimo 6 caracteres
    - Tipo: admin, gestor ou vendedor
    - Status: ativo, inativo ou bloqueado
    
    **Retorna:**
    - 201: Usuário criado com sucesso
    - 400: Email já existe ou dados inválidos
    """
    # Verifica se email já existe
    existe = db.query(Usuario).filter(Usuario.email == usuario_data.email).first()
    if existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email {usuario_data.email} já está em uso"
        )
    
    # Cria novo usuário
    novo_usuario = Usuario(
        nome=usuario_data.nome,
        email=usuario_data.email,
        senha_hash=hash_senha(usuario_data.senha),
        tipo=TipoUsuario(usuario_data.tipo),
        status=StatusUsuario(usuario_data.status),
        departamento=usuario_data.departamento,
        telefone=usuario_data.telefone
    )
    
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    
    return novo_usuario

@router.put("/{usuario_id}", response_model=UsuarioResponse)
def atualizar_usuario(
    usuario_id: int,
    usuario_data: UsuarioUpdate,
    db: Session = Depends(get_db)
):
    """
    Atualiza um usuário existente
    
    **Parâmetros:**
    - `usuario_id`: ID do usuário a atualizar
    
    **Body (JSON):** Todos os campos são opcionais
    ```json
    {
      "nome": "João Silva Santos",
      "email": "joao.novo@empresa.com",
      "senha": "novaSenha123",
      "tipo": "gestor",
      "status": "ativo",
      "departamento": "TI",
      "telefone": "(85) 98888-8888"
    }
    ```
    
    **Notas:**
    - Apenas os campos fornecidos serão atualizados
    - Se não fornecer a senha, ela permanece inalterada
    - Email deve continuar único
    
    **Retorna:**
    - 200: Usuário atualizado com sucesso
    - 404: Usuário não encontrado
    - 400: Email já está em uso
    """
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuário com ID {usuario_id} não encontrado"
        )
    
    # Verifica email duplicado (se estiver sendo alterado)
    if usuario_data.email and usuario_data.email != usuario.email:
        existe = db.query(Usuario).filter(Usuario.email == usuario_data.email).first()
        if existe:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email {usuario_data.email} já está em uso"
            )
    
    # Atualiza campos fornecidos
    update_data = usuario_data.model_dump(exclude_unset=True)
    
    # Hash da senha se foi fornecida
    if 'senha' in update_data:
        update_data['senha_hash'] = hash_senha(update_data.pop('senha'))
    
    # Converte enums
    if 'tipo' in update_data:
        update_data['tipo'] = TipoUsuario(update_data['tipo'])
    
    if 'status' in update_data:
        update_data['status'] = StatusUsuario(update_data['status'])
    
    # Aplica alterações
    for campo, valor in update_data.items():
        setattr(usuario, campo, valor)
    
    usuario.atualizado_em = datetime.utcnow()
    
    db.commit()
    db.refresh(usuario)
    
    return usuario

@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_usuario(
    usuario_id: int,
    db: Session = Depends(get_db)
):
    """
    Deleta um usuário
    
    **Parâmetros:**
    - `usuario_id`: ID do usuário a deletar
    
    **Retorna:**
    - 204: Usuário deletado com sucesso (sem corpo de resposta)
    - 404: Usuário não encontrado
    
    **Atenção:** Esta operação é irreversível!
    """
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuário com ID {usuario_id} não encontrado"
        )
    
    db.delete(usuario)
    db.commit()
    
    return None

@router.patch("/{usuario_id}/status", response_model=UsuarioResponse)
def alterar_status_usuario(
    usuario_id: int,
    novo_status: str = Query(..., description="Novo status: ativo, inativo ou bloqueado"),
    db: Session = Depends(get_db)
):
    """
    Altera apenas o status do usuário
    
    **Parâmetros:**
    - `usuario_id`: ID do usuário
    - `novo_status`: Novo status (query parameter)
    
    **Exemplo:**
    ```
    PATCH /api/usuarios/1/status?novo_status=inativo
    ```
    
    **Valores válidos para status:**
    - `ativo`: Usuário ativo e pode fazer login
    - `inativo`: Usuário inativo temporariamente
    - `bloqueado`: Usuário bloqueado permanentemente
    
    **Retorna:**
    - 200: Status alterado com sucesso
    - 404: Usuário não encontrado
    - 400: Status inválido
    """
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuário com ID {usuario_id} não encontrado"
        )
    
    # Valida e converte status
    try:
        usuario.status = StatusUsuario(novo_status)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Status inválido: {novo_status}. Use: ativo, inativo ou bloqueado"
        )
    
    usuario.atualizado_em = datetime.utcnow()
    db.commit()
    db.refresh(usuario)
    
    return usuario