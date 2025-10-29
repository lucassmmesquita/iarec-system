"""
Routes de Fontes de Dados - IARECOMEND
API REST completa com FastAPI
CRIAR ARQUIVO: backend/routes/fontes.py
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
from datetime import datetime, timedelta
import time
import secrets

from database import get_db
from models import FonteDados, TipoFonte, StatusFonte
from schemas import (
    FonteDadosCreate,
    FonteDadosUpdate,
    FonteDadosResponse,
    TesteConexaoRequest,
    TesteConexaoResponse,
    SincronizacaoRequest,
    SincronizacaoResponse,
    FonteDadosStats,
    FonteDadosFiltros
)

# IMPORTANTE: redirect_slashes=False evita 307 redirects
router = APIRouter(prefix="/api/fontes", tags=["Fontes de Dados"], redirect_slashes=False)

# ============================================
# FUNÇÕES AUXILIARES
# ============================================

def criptografar_senha(senha: str) -> str:
    """
    Criptografia simples para demonstração
    EM PRODUÇÃO: usar Fernet ou similar
    """
    if not senha:
        return None
    # Apenas para demonstração - em produção usar criptografia real
    import base64
    return base64.b64encode(senha.encode()).decode()

def descriptografar_senha(senha_cripto: str) -> str:
    """Descriptografa senha"""
    if not senha_cripto:
        return None
    import base64
    return base64.b64decode(senha_cripto.encode()).decode()

def simular_teste_conexao(fonte_config: dict) -> dict:
    """
    Simula teste de conexão com a fonte de dados
    EM PRODUÇÃO: implementar conexões reais
    """
    import random
    time.sleep(random.uniform(0.5, 1.5))  # Simula latência
    
    tipo = fonte_config.get('tipo')
    
    # Simula falha aleatória (10% de chance)
    if random.random() < 0.1:
        return {
            'sucesso': False,
            'mensagem': f'Erro ao conectar: Timeout na conexão com {tipo}',
            'tempo_resposta_ms': random.uniform(3000, 5000),
            'detalhes': {'erro': 'Connection timeout'}
        }
    
    # Sucesso
    detalhes_por_tipo = {
        'mysql': {'versao_servidor': 'MySQL 8.0.35', 'charset': 'utf8mb4', 'tabelas_encontradas': random.randint(20, 100)},
        'postgresql': {'versao_servidor': 'PostgreSQL 15.3', 'encoding': 'UTF8', 'schemas': random.randint(2, 10)},
        'sqlserver': {'versao_servidor': 'SQL Server 2022', 'collation': 'Latin1_General_CI_AS'},
        'oracle': {'versao_servidor': 'Oracle 19c', 'sid': fonte_config.get('database', 'ORCL')},
        'mongodb': {'versao_servidor': 'MongoDB 7.0', 'collections': random.randint(10, 50)},
        'api': {'endpoint': fonte_config.get('url_api'), 'status_code': 200, 'formato': 'JSON'},
        'csv': {'linhas_encontradas': random.randint(100, 10000), 'colunas': random.randint(5, 30)},
        'excel': {'planilhas': random.randint(1, 5), 'linhas_total': random.randint(500, 20000)}
    }
    
    return {
        'sucesso': True,
        'mensagem': f'Conexão estabelecida com sucesso em {tipo.upper()}!',
        'tempo_resposta_ms': random.uniform(50, 300),
        'detalhes': detalhes_por_tipo.get(tipo, {})
    }

def executar_sincronizacao(fonte: FonteDados, force: bool = False) -> dict:
    """
    Executa sincronização de dados da fonte
    EM PRODUÇÃO: implementar lógica real de importação
    """
    import random
    
    # Verifica se já foi sincronizado recentemente
    if not force and fonte.ultima_sincronizacao:
        tempo_desde_sync = (datetime.utcnow() - fonte.ultima_sincronizacao).total_seconds() / 3600
        if tempo_desde_sync < 1:  # Menos de 1 hora
            return {
                'sucesso': False,
                'mensagem': f'Fonte sincronizada há {tempo_desde_sync:.1f}h. Use force=true para forçar.',
                'registros_importados': 0,
                'registros_atualizados': 0,
                'registros_com_erro': 0,
                'tempo_total_segundos': 0,
                'data_sincronizacao': fonte.ultima_sincronizacao
            }
    
    # Simula sincronização
    inicio = time.time()
    time.sleep(random.uniform(1, 3))  # Simula processamento
    
    registros_importados = random.randint(100, 5000)
    registros_atualizados = random.randint(10, 500)
    registros_com_erro = random.randint(0, 10)
    
    tempo_total = time.time() - inicio
    
    # Atualiza estatísticas da fonte
    fonte.ultima_sincronizacao = datetime.utcnow()
    fonte.proxima_sincronizacao = datetime.utcnow() + timedelta(hours=fonte.frequencia_sync_horas)
    fonte.total_registros_importados += registros_importados
    fonte.total_erros += registros_com_erro
    fonte.tempo_ultima_sync_segundos = tempo_total
    
    if registros_com_erro > 0:
        fonte.mensagem_ultimo_erro = f'{registros_com_erro} registros com erro de validação'
    else:
        fonte.mensagem_ultimo_erro = None
        fonte.status = StatusFonte.ATIVA
    
    return {
        'sucesso': True,
        'mensagem': 'Sincronização concluída com sucesso',
        'registros_importados': registros_importados,
        'registros_atualizados': registros_atualizados,
        'registros_com_erro': registros_com_erro,
        'tempo_total_segundos': round(tempo_total, 2),
        'data_sincronizacao': fonte.ultima_sincronizacao
    }

# ============================================
# ENDPOINTS CRUD
# ============================================

@router.get("/", response_model=List[FonteDadosResponse])
def listar_fontes(
    busca: Optional[str] = Query(None, description="Buscar por nome"),
    tipo: Optional[str] = Query(None, description="Filtrar por tipo"),
    status: Optional[str] = Query(None, description="Filtrar por status"),
    limite: int = Query(100, ge=1, le=1000, description="Máximo de resultados"),
    offset: int = Query(0, ge=0, description="Pular N resultados"),
    db: Session = Depends(get_db)
):
    """
    Lista todas as fontes de dados com filtros opcionais
    
    **Filtros:**
    - `busca`: Busca por nome (case insensitive)
    - `tipo`: mysql, postgresql, sqlserver, oracle, mongodb, api, csv, excel
    - `status`: active, inactive, error, pending, syncing
    - `limite`: Quantidade máxima (padrão: 100)
    - `offset`: Pular N resultados (paginação)
    
    **Exemplo:**
    ```
    GET /api/fontes?tipo=mysql&status=active&limite=10
    ```
    """
    query = db.query(FonteDados)
    
    # Filtro de busca
    if busca:
        query = query.filter(FonteDados.nome.ilike(f"%{busca}%"))
    
    # Filtro por tipo
    if tipo:
        try:
            tipo_enum = TipoFonte(tipo)
            query = query.filter(FonteDados.tipo == tipo_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tipo inválido: {tipo}"
            )
    
    # Filtro por status
    if status:
        try:
            status_enum = StatusFonte(status)
            query = query.filter(FonteDados.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Status inválido: {status}"
            )
    
    # Ordenação e paginação
    fontes = query.order_by(FonteDados.criado_em.desc()).limit(limite).offset(offset).all()
    
    return fontes

@router.get("/stats", response_model=FonteDadosStats)
def obter_estatisticas(db: Session = Depends(get_db)):
    """
    Retorna estatísticas gerais das fontes de dados
    
    **Retorna:**
    - Total de fontes
    - Quantidade por status
    - Quantidade por tipo
    - Total de registros importados
    - Data da última sincronização
    """
    total = db.query(func.count(FonteDados.id)).scalar()
    
    # Por status
    ativas = db.query(func.count(FonteDados.id)).filter(FonteDados.status == StatusFonte.ATIVA).scalar()
    inativas = db.query(func.count(FonteDados.id)).filter(FonteDados.status == StatusFonte.INATIVA).scalar()
    com_erro = db.query(func.count(FonteDados.id)).filter(FonteDados.status == StatusFonte.ERRO).scalar()
    pendentes = db.query(func.count(FonteDados.id)).filter(FonteDados.status == StatusFonte.PENDENTE).scalar()
    sincronizando = db.query(func.count(FonteDados.id)).filter(FonteDados.status == StatusFonte.SINCRONIZANDO).scalar()
    
    # Por tipo
    tipos = db.query(FonteDados.tipo, func.count(FonteDados.id)).group_by(FonteDados.tipo).all()
    por_tipo = {tipo.value: count for tipo, count in tipos}
    
    # Total de registros
    total_registros = db.query(func.sum(FonteDados.total_registros_importados)).scalar() or 0
    
    # Última sincronização
    ultima_sync = db.query(func.max(FonteDados.ultima_sincronizacao)).scalar()
    
    return FonteDadosStats(
        total=total,
        ativas=ativas,
        inativas=inativas,
        com_erro=com_erro,
        pendentes=pendentes,
        sincronizando=sincronizando,
        por_tipo=por_tipo,
        total_registros_todos=total_registros,
        ultima_sincronizacao_geral=ultima_sync
    )

@router.get("/{fonte_id}", response_model=FonteDadosResponse)
def obter_fonte(fonte_id: int, db: Session = Depends(get_db)):
    """
    Obtém detalhes de uma fonte específica pelo ID
    """
    fonte = db.query(FonteDados).filter(FonteDados.id == fonte_id).first()
    
    if not fonte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fonte de dados com ID {fonte_id} não encontrada"
        )
    
    return fonte

@router.post("/", response_model=FonteDadosResponse, status_code=status.HTTP_201_CREATED)
def criar_fonte(fonte_data: FonteDadosCreate, db: Session = Depends(get_db)):
    """
    Cria uma nova fonte de dados
    
    **Validações:**
    - Nome deve ser único
    - Campos obrigatórios variam por tipo
    - Senha é automaticamente criptografada
    
    **Exemplo MySQL:**
    ```json
    {
        "nome": "MySQL Vendas",
        "tipo": "mysql",
        "host": "db.empresa.com",
        "port": 3306,
        "database": "vendas_db",
        "username": "user",
        "senha": "senha123",
        "frequencia_sync_horas": 12
    }
    ```
    """
    # Verifica se nome já existe
    existe = db.query(FonteDados).filter(FonteDados.nome == fonte_data.nome).first()
    if existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Já existe uma fonte com o nome '{fonte_data.nome}'"
        )
    
    # Criptografa senha se fornecida
    senha_cripto = criptografar_senha(fonte_data.senha) if fonte_data.senha else None
    
    # Cria nova fonte
    nova_fonte = FonteDados(
        nome=fonte_data.nome,
        tipo=TipoFonte(fonte_data.tipo),
        status=StatusFonte.PENDENTE,
        host=fonte_data.host,
        port=fonte_data.port,
        database=fonte_data.database,
        username=fonte_data.username,
        senha_criptografada=senha_cripto,
        url_api=fonte_data.url_api,
        api_key=fonte_data.api_key,
        headers_json=fonte_data.headers_json,
        caminho_arquivo=fonte_data.caminho_arquivo,
        encoding=fonte_data.encoding,
        delimiter=fonte_data.delimiter,
        parametros_adicionais=fonte_data.parametros_adicionais,
        frequencia_sync_horas=fonte_data.frequencia_sync_horas
    )
    
    db.add(nova_fonte)
    db.commit()
    db.refresh(nova_fonte)
    
    return nova_fonte

@router.put("/{fonte_id}", response_model=FonteDadosResponse)
def atualizar_fonte(fonte_id: int, fonte_data: FonteDadosUpdate, db: Session = Depends(get_db)):
    """
    Atualiza uma fonte de dados existente
    
    **Campos atualizáveis:**
    - Todos os campos de configuração
    - Status pode ser alterado manualmente
    - Senha é re-criptografada se fornecida
    """
    fonte = db.query(FonteDados).filter(FonteDados.id == fonte_id).first()
    
    if not fonte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fonte com ID {fonte_id} não encontrada"
        )
    
    # Atualiza campos fornecidos
    update_data = fonte_data.dict(exclude_unset=True)
    
    # Se nova senha fornecida, criptografa
    if 'senha' in update_data and update_data['senha']:
        update_data['senha_criptografada'] = criptografar_senha(update_data.pop('senha'))
    
    # Verifica nome único (se alterado)
    if 'nome' in update_data and update_data['nome'] != fonte.nome:
        existe = db.query(FonteDados).filter(
            FonteDados.nome == update_data['nome'],
            FonteDados.id != fonte_id
        ).first()
        if existe:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Já existe outra fonte com o nome '{update_data['nome']}'"
            )
    
    # Converte status se fornecido
    if 'status' in update_data:
        update_data['status'] = StatusFonte(update_data['status'])
    
    # Aplica atualizações
    for campo, valor in update_data.items():
        setattr(fonte, campo, valor)
    
    fonte.atualizado_em = datetime.utcnow()
    
    db.commit()
    db.refresh(fonte)
    
    return fonte

@router.delete("/{fonte_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_fonte(fonte_id: int, db: Session = Depends(get_db)):
    """
    Exclui uma fonte de dados
    
    **ATENÇÃO:** Esta ação não pode ser desfeita!
    """
    fonte = db.query(FonteDados).filter(FonteDados.id == fonte_id).first()
    
    if not fonte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fonte com ID {fonte_id} não encontrada"
        )
    
    db.delete(fonte)
    db.commit()
    
    return None

# ============================================
# ENDPOINTS ESPECIAIS
# ============================================

@router.post("/testar-conexao", response_model=TesteConexaoResponse)
def testar_conexao(config: TesteConexaoRequest):
    """
    Testa conexão com uma fonte de dados ANTES de criar/salvar
    
    **Útil para:**
    - Validar credenciais antes de salvar
    - Verificar acessibilidade do servidor
    - Diagnosticar problemas de conexão
    
    **Exemplo:**
    ```json
    {
        "tipo": "mysql",
        "host": "db.empresa.com",
        "port": 3306,
        "database": "vendas",
        "username": "test_user",
        "senha": "test_pass"
    }
    ```
    """
    resultado = simular_teste_conexao(config.dict())
    
    return TesteConexaoResponse(
        sucesso=resultado['sucesso'],
        mensagem=resultado['mensagem'],
        tempo_resposta_ms=resultado.get('tempo_resposta_ms'),
        detalhes=resultado.get('detalhes')
    )

@router.post("/{fonte_id}/sincronizar", response_model=SincronizacaoResponse)
def sincronizar_fonte(
    fonte_id: int,
    sync_request: SincronizacaoRequest,
    db: Session = Depends(get_db)
):
    """
    Inicia sincronização manual de uma fonte de dados
    
    **Parâmetros:**
    - `force`: Se true, força sincronização mesmo que já tenha sido feita recentemente
    
    **Retorna:**
    - Estatísticas da sincronização
    - Quantidade de registros importados/atualizados
    - Tempo total de processamento
    """
    fonte = db.query(FonteDados).filter(FonteDados.id == fonte_id).first()
    
    if not fonte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fonte com ID {fonte_id} não encontrada"
        )
    
    if fonte.status == StatusFonte.SINCRONIZANDO:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Fonte já está sincronizando. Aguarde a conclusão."
        )
    
    # Marca como sincronizando
    fonte.status = StatusFonte.SINCRONIZANDO
    db.commit()
    
    try:
        # Executa sincronização
        resultado = executar_sincronizacao(fonte, force=sync_request.force)
        
        # Atualiza fonte no banco
        db.commit()
        db.refresh(fonte)
        
        return SincronizacaoResponse(**resultado)
    
    except Exception as e:
        fonte.status = StatusFonte.ERRO
        fonte.mensagem_ultimo_erro = str(e)
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro durante sincronização: {str(e)}"
        )

@router.post("/{fonte_id}/ativar")
def ativar_fonte(fonte_id: int, db: Session = Depends(get_db)):
    """Ativa uma fonte de dados"""
    fonte = db.query(FonteDados).filter(FonteDados.id == fonte_id).first()
    
    if not fonte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fonte com ID {fonte_id} não encontrada"
        )
    
    fonte.status = StatusFonte.ATIVA
    fonte.atualizado_em = datetime.utcnow()
    
    db.commit()
    
    return {"message": f"Fonte '{fonte.nome}' ativada com sucesso", "status": "active"}

@router.post("/{fonte_id}/desativar")
def desativar_fonte(fonte_id: int, db: Session = Depends(get_db)):
    """Desativa uma fonte de dados"""
    fonte = db.query(FonteDados).filter(FonteDados.id == fonte_id).first()
    
    if not fonte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Fonte com ID {fonte_id} não encontrada"
        )
    
    fonte.status = StatusFonte.INATIVA
    fonte.atualizado_em = datetime.utcnow()
    
    db.commit()
    
    return {"message": f"Fonte '{fonte.nome}' desativada", "status": "inactive"}