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