"""
Modelos de dados do IARECOMEND
SQLAlchemy Models para PostgreSQL
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum as SQLEnum, Float, JSON
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

class TipoFonte(str, enum.Enum):
    """Tipos de fontes de dados suportadas"""
    MYSQL = "mysql"
    POSTGRESQL = "postgresql"
    SQLSERVER = "sqlserver"
    ORACLE = "oracle"
    MONGODB = "mongodb"
    API = "api"
    CSV = "csv"
    EXCEL = "excel"

class StatusFonte(str, enum.Enum):
    """Status da fonte de dados"""
    ATIVA = "active"
    INATIVA = "inactive"
    ERRO = "error"
    PENDENTE = "pending"
    SINCRONIZANDO = "syncing"

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
    
class FonteDados(Base):
    """
    Modelo de Fonte de Dados
    Armazena configurações de conexão com diferentes fontes de dados
    """
    __tablename__ = "fontes_dados"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(200), nullable=False, unique=True, index=True)
    tipo = Column(SQLEnum(TipoFonte), nullable=False)
    status = Column(SQLEnum(StatusFonte), nullable=False, default=StatusFonte.PENDENTE)
    
    # Configurações de conexão (variam por tipo)
    host = Column(String(255), nullable=True)
    port = Column(Integer, nullable=True)
    database = Column(String(200), nullable=True)
    username = Column(String(200), nullable=True)
    senha_criptografada = Column(String(500), nullable=True)  # Senha criptografada
    
    # Para APIs
    url_api = Column(String(500), nullable=True)
    api_key = Column(String(500), nullable=True)
    headers_json = Column(JSON, nullable=True)  # Headers customizados
    
    # Para arquivos (CSV/Excel)
    caminho_arquivo = Column(String(500), nullable=True)
    encoding = Column(String(50), default="utf-8")
    delimiter = Column(String(10), default=",")
    
    # Parâmetros adicionais (JSON flexível)
    parametros_adicionais = Column(JSON, nullable=True)
    
    # Metadados de sincronização
    ultima_sincronizacao = Column(DateTime, nullable=True)
    proxima_sincronizacao = Column(DateTime, nullable=True)
    frequencia_sync_horas = Column(Integer, default=24)  # Sincronizar a cada 24h
    
    # Estatísticas
    total_registros_importados = Column(Integer, default=0)
    total_erros = Column(Integer, default=0)
    tempo_ultima_sync_segundos = Column(Float, nullable=True)
    mensagem_ultimo_erro = Column(Text, nullable=True)
    
    # Auditoria
    criado_por = Column(Integer, nullable=True)  # ID do usuário que criou
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Converte o modelo para dicionário (sem expor senhas)"""
        return {
            'id': self.id,
            'nome': self.nome,
            'tipo': self.tipo.value if self.tipo else None,
            'status': self.status.value if self.status else None,
            'host': self.host,
            'port': self.port,
            'database': self.database,
            'username': self.username,
            'url_api': self.url_api,
            'caminho_arquivo': self.caminho_arquivo,
            'encoding': self.encoding,
            'delimiter': self.delimiter,
            'parametros_adicionais': self.parametros_adicionais,
            'ultima_sincronizacao': self.ultima_sincronizacao.isoformat() if self.ultima_sincronizacao else None,
            'proxima_sincronizacao': self.proxima_sincronizacao.isoformat() if self.proxima_sincronizacao else None,
            'frequencia_sync_horas': self.frequencia_sync_horas,
            'total_registros_importados': self.total_registros_importados,
            'total_erros': self.total_erros,
            'tempo_ultima_sync_segundos': self.tempo_ultima_sync_segundos,
            'mensagem_ultimo_erro': self.mensagem_ultimo_erro,
            'criado_em': self.criado_em.isoformat() if self.criado_em else None,
            'atualizado_em': self.atualizado_em.isoformat() if self.atualizado_em else None
        }
    
    def to_dict_seguro(self):
        """Versão segura sem informações sensíveis"""
        data = self.to_dict()
        # Remove informações sensíveis
        data.pop('senha_criptografada', None)
        data.pop('api_key', None)
        return data
