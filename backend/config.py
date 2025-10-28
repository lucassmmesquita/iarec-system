"""
Configurações da aplicação IARECOMEND
Carrega variáveis de ambiente com fallbacks para produção
"""
import os
from typing import List

class Settings:
    """Configurações da aplicação"""
    
    def __init__(self):
        # Ambiente
        self.ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        self.DEBUG: bool = os.getenv("DEBUG", "True") == "True"
        
        # Database - Elastic Beanstalk usa prefixo RDS_
        # Tenta ler RDS_DB_* primeiro, depois DB_* como fallback
        self.DB_HOST: str = os.getenv("RDS_DB_HOST") or os.getenv("DB_HOST") or "localhost"
        self.DB_PORT: str = os.getenv("RDS_DB_PORT") or os.getenv("DB_PORT") or "5432"
        self.DB_NAME: str = os.getenv("RDS_DB_NAME") or os.getenv("DB_NAME") or "iarecomend"
        self.DB_USER: str = os.getenv("RDS_DB_USER") or os.getenv("DB_USER") or "postgres"
        self.DB_PASSWORD: str = os.getenv("RDS_DB_PASSWORD") or os.getenv("DB_PASSWORD") or "postgres"
        
        # Security
        self.SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
        
        # CORS - Permite todas as origens (ajustar em produção se necessário)
        self.CORS_ORIGINS: List[str] = [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8080",
            "http://iarecomend-frontend-1760632349.s3-website-us-east-1.amazonaws.com",
            "*"
        ]
    
    @property
    def DATABASE_URL(self) -> str:
        """Monta URL de conexão do banco de dados"""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

# Instância global das configurações
settings = Settings()

# Log de debug (apenas em desenvolvimento)
if settings.DEBUG:
    print(f"🔧 Environment: {settings.ENVIRONMENT}")
    print(f"📍 Database: {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}")
    print(f"👤 DB User: {settings.DB_USER}")
    print(f"🔒 Secret Key: {'*' * len(settings.SECRET_KEY)}")