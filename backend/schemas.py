"""
Schemas Pydantic para validação de dados
Request/Response models
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum

class TipoUsuarioEnum(str, Enum):
    """Tipos de usuário disponíveis"""
    ADMIN = "admin"
    GESTOR = "gestor"
    VENDEDOR = "vendedor"

class StatusUsuarioEnum(str, Enum):
    """Status de usuário disponíveis"""
    ATIVO = "ativo"
    INATIVO = "inativo"
    BLOQUEADO = "bloqueado"

class TipoFonteEnum(str, Enum):
    """Tipos de fontes de dados"""
    MYSQL = "mysql"
    POSTGRESQL = "postgresql"
    SQLSERVER = "sqlserver"
    ORACLE = "oracle"
    MONGODB = "mongodb"
    API = "api"
    CSV = "csv"
    EXCEL = "excel"

class StatusFonteEnum(str, Enum):
    """Status da fonte de dados"""
    ATIVA = "active"
    INATIVA = "inactive"
    ERRO = "error"
    PENDENTE = "pending"
    SINCRONIZANDO = "syncing"

# ============================================
# SCHEMAS DE USUÁRIO
# ============================================

class UsuarioCreate(BaseModel):
    """Schema para criação de usuário"""
    nome: str = Field(..., min_length=3, max_length=200, description="Nome completo do usuário")
    email: EmailStr = Field(..., description="Email único do usuário")
    senha: str = Field(..., min_length=6, description="Senha (mínimo 6 caracteres)")
    tipo: TipoUsuarioEnum = Field(default=TipoUsuarioEnum.VENDEDOR, description="Tipo de usuário")
    status: StatusUsuarioEnum = Field(default=StatusUsuarioEnum.ATIVO, description="Status do usuário")
    departamento: Optional[str] = Field(None, max_length=100, description="Departamento do usuário")
    telefone: Optional[str] = Field(None, max_length=20, description="Telefone de contato")
    
    @validator('telefone')
    def validar_telefone(cls, v):
        """Valida se telefone contém apenas números e caracteres especiais permitidos"""
        if v:
            # Remove caracteres de formatação
            apenas_numeros = v.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
            if not apenas_numeros.isdigit():
                raise ValueError('Telefone deve conter apenas números')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "nome": "João Silva",
                "email": "joao@empresa.com",
                "senha": "senha123",
                "tipo": "vendedor",
                "status": "ativo",
                "departamento": "Vendas",
                "telefone": "(85) 99999-9999"
            }
        }

class UsuarioUpdate(BaseModel):
    """Schema para atualização de usuário - todos os campos opcionais"""
    nome: Optional[str] = Field(None, min_length=3, max_length=200)
    email: Optional[EmailStr] = None
    senha: Optional[str] = Field(None, min_length=6)
    tipo: Optional[TipoUsuarioEnum] = None
    status: Optional[StatusUsuarioEnum] = None
    departamento: Optional[str] = Field(None, max_length=100)
    telefone: Optional[str] = Field(None, max_length=20)
    
    @validator('telefone')
    def validar_telefone(cls, v):
        """Valida se telefone contém apenas números e caracteres especiais permitidos"""
        if v:
            apenas_numeros = v.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
            if not apenas_numeros.isdigit():
                raise ValueError('Telefone deve conter apenas números')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "nome": "João Silva Santos",
                "departamento": "Marketing",
                "telefone": "(85) 98888-8888"
            }
        }

class UsuarioResponse(BaseModel):
    """Schema de resposta - retornado pela API"""
    id: int
    nome: str
    email: str
    tipo: str
    status: str
    departamento: Optional[str]
    telefone: Optional[str]
    ultimo_acesso: Optional[datetime]
    criado_em: datetime
    atualizado_em: Optional[datetime]
    
    class Config:
        from_attributes = True  # Permite conversão de objetos SQLAlchemy
        json_schema_extra = {
            "example": {
                "id": 1,
                "nome": "João Silva",
                "email": "joao@empresa.com",
                "tipo": "vendedor",
                "status": "ativo",
                "departamento": "Vendas",
                "telefone": "(85) 99999-9999",
                "ultimo_acesso": "2025-10-21T10:30:00",
                "criado_em": "2025-10-15T08:00:00",
                "atualizado_em": "2025-10-21T10:30:00"
            }
        }

class UsuarioFiltros(BaseModel):
    """Schema para filtros de listagem"""
    busca: Optional[str] = Field(None, description="Buscar por nome ou email")
    tipo: Optional[TipoUsuarioEnum] = Field(None, description="Filtrar por tipo")
    status: Optional[StatusUsuarioEnum] = Field(None, description="Filtrar por status")
    departamento: Optional[str] = Field(None, description="Filtrar por departamento")
    limite: int = Field(default=100, ge=1, le=1000, description="Máximo de resultados")
    offset: int = Field(default=0, ge=0, description="Pular N resultados")
    
    class Config:
        json_schema_extra = {
            "example": {
                "busca": "silva",
                "tipo": "vendedor",
                "status": "ativo",
                "limite": 10,
                "offset": 0
            }
        }

class UsuarioStats(BaseModel):
    """Schema para estatísticas de usuários"""
    total: int = Field(..., description="Total de usuários")
    ativos: int = Field(..., description="Usuários ativos")
    inativos: int = Field(..., description="Usuários inativos")
    bloqueados: int = Field(..., description="Usuários bloqueados")
    por_tipo: dict = Field(..., description="Quantidade por tipo")
    por_departamento: dict = Field(..., description="Quantidade por departamento")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total": 25,
                "ativos": 20,
                "inativos": 3,
                "bloqueados": 2,
                "por_tipo": {
                    "admin": 2,
                    "gestor": 5,
                    "vendedor": 18
                },
                "por_departamento": {
                    "Vendas": 15,
                    "TI": 4,
                    "Marketing": 6
                }
            }
        }
class FonteDadosCreate(BaseModel):
    """Schema para criação de fonte de dados"""
    nome: str = Field(..., min_length=3, max_length=200, description="Nome único da fonte")
    tipo: TipoFonteEnum = Field(..., description="Tipo da fonte de dados")
    
    # Configurações de banco de dados
    host: Optional[str] = Field(None, max_length=255, description="Host do servidor")
    port: Optional[int] = Field(None, ge=1, le=65535, description="Porta de conexão")
    database: Optional[str] = Field(None, max_length=200, description="Nome do banco de dados")
    username: Optional[str] = Field(None, max_length=200, description="Usuário de conexão")
    senha: Optional[str] = Field(None, description="Senha (será criptografada)")
    
    # Para APIs REST
    url_api: Optional[str] = Field(None, max_length=500, description="URL da API")
    api_key: Optional[str] = Field(None, max_length=500, description="Chave de API")
    headers_json: Optional[dict] = Field(None, description="Headers HTTP customizados")
    
    # Para arquivos
    caminho_arquivo: Optional[str] = Field(None, max_length=500, description="Caminho do arquivo")
    encoding: str = Field(default="utf-8", description="Encoding do arquivo")
    delimiter: str = Field(default=",", max_length=10, description="Delimitador CSV")
    
    # Configurações gerais
    parametros_adicionais: Optional[dict] = Field(None, description="Parâmetros extras em JSON")
    frequencia_sync_horas: int = Field(default=24, ge=1, le=168, description="Frequência de sincronização (horas)")
    
    @validator('nome')
    def validar_nome(cls, v):
        """Remove espaços extras e valida caracteres"""
        v = v.strip()
        if not v:
            raise ValueError("Nome não pode ser vazio")
        return v
    
    @validator('tipo')
    def validar_tipo_configs(cls, v, values):
        """Valida se as configurações necessárias foram fornecidas"""
        tipo = v
        
        # Validações por tipo
        if tipo in [TipoFonteEnum.MYSQL, TipoFonteEnum.POSTGRESQL, TipoFonteEnum.SQLSERVER, TipoFonteEnum.ORACLE]:
            if not all([values.get('host'), values.get('database'), values.get('username')]):
                raise ValueError(f"Para {tipo}, é necessário fornecer: host, database, username")
        
        elif tipo == TipoFonteEnum.API:
            if not values.get('url_api'):
                raise ValueError("Para API, é necessário fornecer url_api")
        
        elif tipo in [TipoFonteEnum.CSV, TipoFonteEnum.EXCEL]:
            if not values.get('caminho_arquivo'):
                raise ValueError(f"Para {tipo}, é necessário fornecer caminho_arquivo")
        
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "nome": "MySQL Vendas Principal",
                "tipo": "mysql",
                "host": "db.empresa.com",
                "port": 3306,
                "database": "vendas_db",
                "username": "iarecomend_user",
                "senha": "senha_segura_123",
                "frequencia_sync_horas": 12
            }
        }

class FonteDadosUpdate(BaseModel):
    """Schema para atualização de fonte de dados"""
    nome: Optional[str] = Field(None, min_length=3, max_length=200)
    status: Optional[StatusFonteEnum] = None
    
    host: Optional[str] = Field(None, max_length=255)
    port: Optional[int] = Field(None, ge=1, le=65535)
    database: Optional[str] = Field(None, max_length=200)
    username: Optional[str] = Field(None, max_length=200)
    senha: Optional[str] = None
    
    url_api: Optional[str] = Field(None, max_length=500)
    api_key: Optional[str] = None
    headers_json: Optional[dict] = None
    
    caminho_arquivo: Optional[str] = Field(None, max_length=500)
    encoding: Optional[str] = None
    delimiter: Optional[str] = None
    
    parametros_adicionais: Optional[dict] = None
    frequencia_sync_horas: Optional[int] = Field(None, ge=1, le=168)
    
    class Config:
        json_schema_extra = {
            "example": {
                "nome": "MySQL Vendas - Atualizado",
                "status": "active",
                "frequencia_sync_horas": 6
            }
        }

class FonteDadosResponse(BaseModel):
    """Schema de resposta - retornado pela API"""
    id: int
    nome: str
    tipo: str
    status: str
    
    host: Optional[str]
    port: Optional[int]
    database: Optional[str]
    username: Optional[str]
    # Nota: senha NÃO é retornada por segurança
    
    url_api: Optional[str]
    # Nota: api_key NÃO é retornada por segurança
    headers_json: Optional[dict]
    
    caminho_arquivo: Optional[str]
    encoding: Optional[str]
    delimiter: Optional[str]
    
    parametros_adicionais: Optional[dict]
    
    ultima_sincronizacao: Optional[datetime]
    proxima_sincronizacao: Optional[datetime]
    frequencia_sync_horas: int
    
    total_registros_importados: int
    total_erros: int
    tempo_ultima_sync_segundos: Optional[float]
    mensagem_ultimo_erro: Optional[str]
    
    criado_em: datetime
    atualizado_em: Optional[datetime]
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "nome": "MySQL Vendas Principal",
                "tipo": "mysql",
                "status": "active",
                "host": "db.empresa.com",
                "port": 3306,
                "database": "vendas_db",
                "username": "iarecomend_user",
                "ultima_sincronizacao": "2025-10-28T10:30:00",
                "proxima_sincronizacao": "2025-10-28T22:30:00",
                "frequencia_sync_horas": 12,
                "total_registros_importados": 15420,
                "total_erros": 0,
                "tempo_ultima_sync_segundos": 45.3,
                "mensagem_ultimo_erro": None,
                "criado_em": "2025-10-15T08:00:00",
                "atualizado_em": "2025-10-28T10:30:00"
            }
        }

class TesteConexaoRequest(BaseModel):
    """Schema para teste de conexão"""
    tipo: TipoFonteEnum
    host: Optional[str] = None
    port: Optional[int] = None
    database: Optional[str] = None
    username: Optional[str] = None
    senha: Optional[str] = None
    url_api: Optional[str] = None
    api_key: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "tipo": "mysql",
                "host": "db.empresa.com",
                "port": 3306,
                "database": "vendas_db",
                "username": "test_user",
                "senha": "test_password"
            }
        }

class TesteConexaoResponse(BaseModel):
    """Resposta do teste de conexão"""
    sucesso: bool
    mensagem: str
    tempo_resposta_ms: Optional[float] = None
    detalhes: Optional[dict] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "sucesso": True,
                "mensagem": "Conexão estabelecida com sucesso!",
                "tempo_resposta_ms": 124.5,
                "detalhes": {
                    "versao_servidor": "MySQL 8.0.35",
                    "charset": "utf8mb4",
                    "tabelas_encontradas": 45
                }
            }
        }

class SincronizacaoRequest(BaseModel):
    """Request para iniciar sincronização manual"""
    force: bool = Field(default=False, description="Forçar sincronização mesmo se já sincronizado recentemente")
    
    class Config:
        json_schema_extra = {
            "example": {
                "force": False
            }
        }

class SincronizacaoResponse(BaseModel):
    """Resposta da sincronização"""
    sucesso: bool
    mensagem: str
    registros_importados: int
    registros_atualizados: int
    registros_com_erro: int
    tempo_total_segundos: float
    data_sincronizacao: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "sucesso": True,
                "mensagem": "Sincronização concluída com sucesso",
                "registros_importados": 1250,
                "registros_atualizados": 340,
                "registros_com_erro": 0,
                "tempo_total_segundos": 58.7,
                "data_sincronizacao": "2025-10-28T14:30:00"
            }
        }

class FonteDadosStats(BaseModel):
    """Estatísticas de fontes de dados"""
    total: int
    ativas: int
    inativas: int
    com_erro: int
    pendentes: int
    sincronizando: int
    por_tipo: dict
    total_registros_todos: int
    ultima_sincronizacao_geral: Optional[datetime]
    
    class Config:
        json_schema_extra = {
            "example": {
                "total": 8,
                "ativas": 5,
                "inativas": 2,
                "com_erro": 1,
                "pendentes": 0,
                "sincronizando": 0,
                "por_tipo": {
                    "mysql": 3,
                    "postgresql": 2,
                    "api": 2,
                    "csv": 1
                },
                "total_registros_todos": 125340,
                "ultima_sincronizacao_geral": "2025-10-28T14:30:00"
            }
        }

class FonteDadosFiltros(BaseModel):
    """Filtros para listagem de fontes"""
    busca: Optional[str] = Field(None, description="Buscar por nome")
    tipo: Optional[TipoFonteEnum] = None
    status: Optional[StatusFonteEnum] = None
    limite: int = Field(default=100, ge=1, le=1000)
    offset: int = Field(default=0, ge=0)
    
    class Config:
        json_schema_extra = {
            "example": {
                "busca": "vendas",
                "tipo": "mysql",
                "status": "active",
                "limite": 20,
                "offset": 0
            }
        }



