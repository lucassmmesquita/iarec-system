"""
Modelos de dados do IARECOMEND
SQLAlchemy Models para PostgreSQL
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class TipoUsuario(str, enum.Enum):
    ADMIN = "admin"
    GESTOR = "gestor"
    VENDEDOR = "vendedor"

class StatusUsuario(str, enum.Enum):
    ATIVO = "ativo"
    INATIVO = "inativo"
    BLOQUEADO = "bloqueado"

class Usuario(Base):
    __tablename__ = "usuarios"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=False, index=True)
    senha_hash = Column(String(255), nullable=False)
    tipo = Column(SQLEnum(TipoUsuario), nullable=False, default=TipoUsuario.VENDEDOR)
    status = Column(SQLEnum(StatusUsuario), nullable=False, default=StatusUsuario.ATIVO)
    departamento = Column(String(100), nullable=True)
    telefone = Column(String(20), nullable=True)
    ultimo_acesso = Column(DateTime, nullable=True)
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Converte o modelo para dicionário"""
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'tipo': self.tipo.value if self.tipo else None,
            'status': self.status.value if self.status else None,
            'departamento': self.departamento,
            'telefone': self.telefone,
            'ultimo_acesso': self.ultimo_acesso.isoformat() if self.ultimo_acesso else None,
            'criado_em': self.criado_em.isoformat() if self.criado_em else None,
            'atualizado_em': self.atualizado_em.isoformat() if self.atualizado_em else None
        }