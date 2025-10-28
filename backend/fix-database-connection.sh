#!/bin/bash
# fix-database-connection.sh
# Corrige problema de conexão com banco de dados

set -e

BACKEND_DIR="$HOME/developer/iarec-system/backend"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
}

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

cd "$BACKEND_DIR"

print_header "CORRIGINDO CONEXÃO COM BANCO DE DADOS"

# ==========================================
# 1. VERIFICAR config.py ATUAL
# ==========================================

print_info "Verificando config.py atual..."
echo ""

if [ -f "config.py" ]; then
    echo -e "${BLUE}Conteúdo atual de config.py:${NC}"
    head -n 50 config.py
    echo ""
else
    print_error "config.py não encontrado!"
    exit 1
fi

# ==========================================
# 2. FAZER BACKUP
# ==========================================

print_info "Fazendo backup de config.py..."
cp config.py config.py.backup
print_success "Backup salvo: config.py.backup"
echo ""

# ==========================================
# 3. CRIAR config.py CORRIGIDO
# ==========================================

print_info "Criando config.py corrigido..."

cat > config.py << 'EOF'
"""
Configurações da aplicação IARECOMEND
Carrega variáveis de ambiente com fallbacks
"""
import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Configurações da aplicação"""
    
    # Ambiente
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True") == "True"
    
    # Database - Elastic Beanstalk usa RDS_* prefix
    DB_HOST: str = os.getenv("RDS_DB_HOST", os.getenv("DB_HOST", "localhost"))
    DB_PORT: str = os.getenv("RDS_DB_PORT", os.getenv("DB_PORT", "5432"))
    DB_NAME: str = os.getenv("RDS_DB_NAME", os.getenv("DB_NAME", "iarecomend"))
    DB_USER: str = os.getenv("RDS_DB_USER", os.getenv("DB_USER", "postgres"))
    DB_PASSWORD: str = os.getenv("RDS_DB_PASSWORD", os.getenv("DB_PASSWORD", "postgres"))
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://iarecomend-frontend-1760632349.s3-website-us-east-1.amazonaws.com",
        "*"  # Permite todas as origens (remover em produção)
    ]
    
    @property
    def DATABASE_URL(self) -> str:
        """Monta URL de conexão do banco de dados"""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Instância global das configurações
settings = Settings()

# Log de debug (apenas em desenvolvimento)
if settings.DEBUG:
    print(f"🔧 Environment: {settings.ENVIRONMENT}")
    print(f"📍 Database: {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}")
    print(f"👤 DB User: {settings.DB_USER}")
    print(f"🔒 Secret Key: {'*' * len(settings.SECRET_KEY)}")
EOF

print_success "config.py criado"
echo ""

# ==========================================
# 4. VERIFICAR NOVO config.py
# ==========================================

print_info "Verificando novo config.py..."
echo ""
python3 -c "from config import settings; print(f'✅ Config OK - Environment: {settings.ENVIRONMENT}')"
echo ""

# ==========================================
# 5. ATUALIZAR .ebextensions
# ==========================================

print_info "Atualizando .ebextensions/02_python.config..."

cat > .ebextensions/02_python.config << 'EOF'
option_settings:
  aws:elasticbeanstalk:application:environment:
    ENVIRONMENT: "production"
    DEBUG: "False"
    RDS_DB_HOST: "iarecomend-db2.can8uiyocmxb.us-east-1.rds.amazonaws.com"
    RDS_DB_PORT: "5432"
    RDS_DB_NAME: "postgres"
    RDS_DB_USER: "postgres"
    RDS_DB_PASSWORD: "ShopInfo#123"
    SECRET_KEY: "production-secret-key-iarecomend-2025"
    PYTHONPATH: "/var/app/current"
  aws:elasticbeanstalk:container:python:
    WSGIPath: app:app
    NumProcesses: 1
    NumThreads: 15
EOF

print_success ".ebextensions atualizado"
echo ""

# ==========================================
# 6. VERIFICAR database.py
# ==========================================

print_info "Verificando database.py..."

if grep -q "settings.DATABASE_URL" database.py; then
    print_success "database.py usa settings.DATABASE_URL"
else
    print_warning "database.py pode não estar usando config corretamente"
    echo ""
    echo -e "${YELLOW}Verificar linha de criação do engine:${NC}"
    grep -n "create_engine" database.py || echo "create_engine não encontrado"
fi

echo ""

# ==========================================
# 7. MOSTRAR RESUMO
# ==========================================

print_header "RESUMO DAS ALTERAÇÕES"

echo -e "${BLUE}Arquivos modificados:${NC}"
echo "  ✅ config.py (backup em config.py.backup)"
echo "  ✅ .ebextensions/02_python.config"
echo ""

echo -e "${BLUE}Principais mudanças em config.py:${NC}"
echo "  • Lê RDS_DB_HOST (não apenas DB_HOST)"
echo "  • Lê RDS_DB_PORT (não apenas DB_PORT)"
echo "  • Lê RDS_DB_NAME (não apenas DB_NAME)"
echo "  • Lê RDS_DB_USER (não apenas DB_USER)"
echo "  • Lê RDS_DB_PASSWORD (não apenas DB_PASSWORD)"
echo "  • Fallback para variáveis sem prefixo RDS_"
echo ""

# ==========================================
# 8. FAZER DEPLOY
# ==========================================

print_header "FAZENDO DEPLOY"

print_warning "Deployando para Elastic Beanstalk..."
print_info "Isso levará 3-5 minutos..."
echo ""

eb deploy

if [ $? -eq 0 ]; then
    print_success "Deploy concluído!"
    echo ""
    
    print_info "Aguardando aplicação inicializar (30s)..."
    sleep 30
    
    # ==========================================
    # 9. TESTAR API
    # ==========================================
    
    print_header "TESTANDO API"
    
    BACKEND_URL=$(eb status | grep "CNAME:" | awk '{print $2}')
    BACKEND_URL="http://$BACKEND_URL"
    
    print_info "URL da API: $BACKEND_URL"
    echo ""
    
    # Testar health
    print_info "Testando /health..."
    if curl -s -f "$BACKEND_URL/health" > /dev/null 2>&1; then
        print_success "Health check OK!"
        curl -s "$BACKEND_URL/health" | jq '.' || curl -s "$BACKEND_URL/health"
    else
        print_error "Health check falhou"
        print_info "Aguarde mais 1-2 minutos e teste manualmente:"
        print_info "  curl $BACKEND_URL/health"
    fi
    
    echo ""
    
    # Testar usuários
    print_info "Testando /api/usuarios..."
    if curl -s -f "$BACKEND_URL/api/usuarios?limite=3" > /dev/null 2>&1; then
        print_success "Endpoint de usuários OK!"
        curl -s "$BACKEND_URL/api/usuarios?limite=3" | jq '.' || curl -s "$BACKEND_URL/api/usuarios?limite=3"
    else
        print_warning "Endpoint de usuários não respondeu ainda"
    fi
    
    echo ""
    
    print_header "🎉 DEPLOY CONCLUÍDO!"
    
    echo -e "${GREEN}API disponível em:${NC}"
    echo "  🌐 $BACKEND_URL"
    echo "  📚 $BACKEND_URL/docs"
    echo "  ❤️  $BACKEND_URL/health"
    echo ""
    
    echo -e "${BLUE}Para ver logs:${NC}"
    echo "  eb logs"
    echo "  eb logs --stream"
    echo ""
    
else
    print_error "Falha no deploy"
    print_info "Ver logs: eb logs | grep -A 20 ERROR"
    exit 1
fi
