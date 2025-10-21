"""
Configuração do IARECOMEND
Permite alternar entre banco local e AWS RDS
"""
import os
from enum import Enum
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

class Environment(str, Enum):
    """Ambientes disponíveis"""
    LOCAL = "local"
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"

class Config:
    """Configuração base"""
    
    # Ambiente atual (altere aqui para trocar!)
    # ENVIRONMENT = os.getenv("ENVIRONMENT", Environment.LOCAL)
    ENVIRONMENT = os.getenv("ENVIRONMENT", Environment.DEVELOPMENT)
    
    # Configurações gerais
    APP_NAME = "IARECOMEND"
    APP_VERSION = "1.0.0"
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    
    # Segurança
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    
    # CORS
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ]

class LocalConfig(Config):
    """Configuração para desenvolvimento local"""
    
    # PostgreSQL Local
    DB_HOST = os.getenv("LOCAL_DB_HOST", "localhost")
    DB_PORT = os.getenv("LOCAL_DB_PORT", "5432")
    DB_NAME = os.getenv("LOCAL_DB_NAME", "iarecomend_dev")
    DB_USER = os.getenv("LOCAL_DB_USER", "postgres")
    DB_PASSWORD = os.getenv("LOCAL_DB_PASSWORD", "postgres")
    
    # String de conexão
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    # Debug
    DEBUG = True

class DevelopmentConfig(Config):
    """Configuração para AWS RDS (Desenvolvimento)"""
    
    # AWS RDS PostgreSQL
    DB_HOST = os.getenv("RDS_DB_HOST", "iarecomend-db2.can8uiyocmxb.us-east-1.rds.amazonaws.com")
    DB_PORT = os.getenv("RDS_DB_PORT", "5432")
    DB_NAME = os.getenv("RDS_DB_NAME", "postgres")
    DB_USER = os.getenv("RDS_DB_USER", "postgres")
    DB_PASSWORD = os.getenv("RDS_DB_PASSWORD", "ShopInfo#123")
    
    # String de conexão
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    # Debug
    DEBUG = True

class StagingConfig(Config):
    """Configuração para Staging"""
    
    DB_HOST = os.getenv("STAGING_DB_HOST")
    DB_PORT = os.getenv("STAGING_DB_PORT", "5432")
    DB_NAME = os.getenv("STAGING_DB_NAME")
    DB_USER = os.getenv("STAGING_DB_USER")
    DB_PASSWORD = os.getenv("STAGING_DB_PASSWORD")
    
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    DEBUG = False

class ProductionConfig(Config):
    """Configuração para Produção"""
    
    DB_HOST = os.getenv("PROD_DB_HOST")
    DB_PORT = os.getenv("PROD_DB_PORT", "5432")
    DB_NAME = os.getenv("PROD_DB_NAME")
    DB_USER = os.getenv("PROD_DB_USER")
    DB_PASSWORD = os.getenv("PROD_DB_PASSWORD")
    
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    DEBUG = False
    
    # CORS mais restritivo
    CORS_ORIGINS = [
        os.getenv("FRONTEND_URL", "https://iarecomend.com")
    ]

# Mapeamento de ambientes
config_map = {
    Environment.LOCAL: LocalConfig,
    Environment.DEVELOPMENT: DevelopmentConfig,
    Environment.STAGING: StagingConfig,
    Environment.PRODUCTION: ProductionConfig,
}

def get_config():
    """
    Retorna a configuração baseada no ambiente
    """
    env = os.getenv("ENVIRONMENT", Environment.LOCAL)
    config_class = config_map.get(env, LocalConfig)
    return config_class()

# Instância global da configuração
settings = get_config()

# Print de debug (remover em produção)
if settings.DEBUG:
    print(f"""
    ╔════════════════════════════════════════╗
    ║  IARECOMEND - Configuração Carregada   ║
    ╚════════════════════════════════════════╝
    
    Ambiente: {settings.ENVIRONMENT}
    Debug: {settings.DEBUG}
    Database: {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}
    """)