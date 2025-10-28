#!/bin/bash
# deploy-aws-eb.sh - Script CORRIGIDO para Deploy no AWS Elastic Beanstalk
# Sistema: IARECOMEND Backend (FastAPI)
# Plataforma: Python 3.11 running on 64bit Amazon Linux 2023/4.7.3
# VERSÃO FINAL CORRIGIDA - SEM configurações problemáticas de listener

set -e

# ==========================================
# CONFIGURAÇÕES
# ==========================================
BACKEND_DIR="$HOME/developer/iarec-system/backend"
EB_ENV="iarecomend-prod-env"
EB_APP="iarecomend-backend"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# ==========================================
# VALIDAÇÕES
# ==========================================
print_header "VALIDANDO AMBIENTE"

if [ ! -d "$BACKEND_DIR" ]; then
    print_error "Pasta backend não encontrada: $BACKEND_DIR"
    print_info "Ajuste a variável BACKEND_DIR no início do script"
    exit 1
fi

cd "$BACKEND_DIR"
print_success "Pasta backend encontrada"

if [ ! -f "app.py" ]; then
    print_error "app.py não encontrado!"
    exit 1
fi

if [ ! -f "requirements.txt" ]; then
    print_error "requirements.txt não encontrado!"
    exit 1
fi

print_success "Arquivos essenciais OK"

if ! command -v eb &> /dev/null; then
    print_error "EB CLI não instalado!"
    print_info "Instale com: pip3 install awsebcli --user"
    exit 1
fi

print_success "EB CLI encontrado"

# ==========================================
# 1. LIMPAR ARQUIVOS ANTIGOS
# ==========================================
print_header "LIMPANDO ARQUIVOS ANTIGOS"

rm -rf .ebextensions/
rm -rf venv/
rm -rf __pycache__/
rm -f .python-version
find . -name "*.pyc" -delete
find . -name "*.pyo" -delete

print_success "Limpeza concluída"

# ==========================================
# 2. CRIAR PROCFILE
# ==========================================
print_header "CRIANDO PROCFILE"

cat > Procfile << 'EOF'
web: uvicorn app:app --host 0.0.0.0 --port 8000 --workers 1 --timeout-keep-alive 120 --log-level info
EOF

print_success "Procfile criado"
cat Procfile
echo ""

# ==========================================
# 3. CRIAR .EBEXTENSIONS (APENAS 01_APP.CONFIG)
# ==========================================
print_header "CRIANDO CONFIGURAÇÃO AWS"

mkdir -p .ebextensions

# APENAS 01_app.config - SEM 02_healthcheck.config problemático
cat > .ebextensions/01_app.config << 'EOF'
option_settings:
  aws:elasticbeanstalk:application:environment:
    ENVIRONMENT: production
    DEBUG: "False"
    SECRET_KEY: "production-secret-key-iarecomend-2025"
    DATABASE_URL: "sqlite:///./iarecomend.db"
    PYTHONPATH: "/var/app/current"
  aws:elasticbeanstalk:container:python:
    NumProcesses: 1
    NumThreads: 15
  aws:elasticbeanstalk:environment:process:default:
    HealthCheckPath: /health
    HealthCheckInterval: 15
    HealthCheckTimeout: 5
    UnhealthyThresholdCount: 3
    HealthyThresholdCount: 2

packages:
  yum:
    gcc: []
    python3-devel: []

commands:
  01_upgrade_pip:
    command: "/var/app/venv/*/bin/pip install --upgrade pip"
    ignoreErrors: true
EOF

print_success "01_app.config criado (com health check integrado)"
echo ""
print_info "Configuração de Health Check:"
echo "  - Path: /health"
echo "  - Interval: 15 segundos"
echo "  - Timeout: 5 segundos"
echo ""

# ==========================================
# 4. CRIAR .EBIGNORE
# ==========================================
print_header "CRIANDO .EBIGNORE"

cat > .ebignore << 'EOF'
venv/
.venv/
__pycache__/
*.pyc
*.pyo
.env
.env.local
*.log
.DS_Store
.git/
.gitignore
README.md
test_*.py
*.md
EOF

print_success ".ebignore criado"

# ==========================================
# 5. VALIDAR REQUIREMENTS.TXT
# ==========================================
print_header "VALIDANDO REQUIREMENTS.TXT"

echo ""
print_info "Dependências atuais:"
cat requirements.txt
echo ""

# Verificar uvicorn
if ! grep -q "uvicorn" requirements.txt; then
    print_warning "uvicorn não encontrado - adicionando..."
    echo "uvicorn[standard]==0.24.0" >> requirements.txt
fi

# Verificar email-validator
if ! grep -q "email-validator\|pydantic\[email\]" requirements.txt; then
    print_warning "email-validator não encontrado - adicionando..."
    echo "email-validator==2.1.0" >> requirements.txt
fi

print_success "requirements.txt validado"

# ==========================================
# 6. VERIFICAR HEALTH CHECK NO CÓDIGO
# ==========================================
print_header "VERIFICANDO HEALTH CHECK NO CÓDIGO"

if grep -q "def health_check" app.py; then
    print_success "Endpoint /health encontrado no código"
else
    print_error "Endpoint /health NÃO encontrado no código!"
    print_info ""
    print_info "Adicione ao app.py:"
    echo ""
    echo "@app.get(\"/health\")"
    echo "def health_check():"
    echo "    return {\"status\": \"healthy\"}"
    echo ""
    print_error "Deploy cancelado. Adicione o endpoint /health primeiro."
    exit 1
fi

# ==========================================
# 7. VERIFICAR ESTRUTURA
# ==========================================
print_header "VERIFICANDO ESTRUTURA"

if [ -d "routes" ]; then
    if [ ! -f "routes/__init__.py" ]; then
        touch routes/__init__.py
        print_success "routes/__init__.py criado"
    fi
fi

echo ""
print_info "Arquivos prontos para deploy:"
ls -1 | grep -E "^(app.py|Procfile|requirements.txt)$"
echo ""
print_info "Configuração AWS:"
ls -1 .ebextensions/
echo ""

# ==========================================
# 8. FAZER DEPLOY
# ==========================================
print_header "INICIANDO DEPLOY NO AWS ELASTIC BEANSTALK"

print_warning "Isso pode levar 3-5 minutos..."
print_info "Ambiente: $EB_ENV"
print_info "Aplicação: $EB_APP"
echo ""

read -p "Deseja continuar com o deploy? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deploy cancelado pelo usuário"
    exit 0
fi

# Deploy
eb deploy $EB_ENV

if [ $? -eq 0 ]; then
    print_success "Deploy concluído com sucesso!"
else
    print_error "Falha no deploy"
    print_info "Verifique os logs com: eb logs"
    exit 1
fi

# ==========================================
# 9. AGUARDAR E TESTAR
# ==========================================
print_header "TESTANDO A API"

print_info "Aguardando 30 segundos para a aplicação inicializar..."
sleep 30

# Obter URL
EB_URL=$(eb status $EB_ENV | grep "CNAME" | awk '{print $2}')

if [ -z "$EB_URL" ]; then
    EB_URL="iarecomend-prod-env.eba-5umweadu.us-east-1.elasticbeanstalk.com"
fi

BACKEND_URL="http://${EB_URL}"

echo ""
print_info "Testando: ${BACKEND_URL}/health"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${BACKEND_URL}/health" 2>/dev/null || echo "000")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ]; then
    print_success "✅ Health check OK (200)"
    echo "$HEALTH_RESPONSE" | head -n -1
else
    print_warning "⚠️  Health check retornou código: $HTTP_CODE"
    print_info "Aguarde mais 1-2 minutos e teste manualmente"
fi

# ==========================================
# 10. RESUMO
# ==========================================
print_header "DEPLOY CONCLUÍDO"

echo ""
echo -e "${GREEN}✅ Backend deployado com sucesso!${NC}"
echo ""
echo -e "${BLUE}📍 URLs:${NC}"
echo "   API:    ${BACKEND_URL}"
echo "   Docs:   ${BACKEND_URL}/docs"
echo "   Health: ${BACKEND_URL}/health"
echo ""
echo -e "${BLUE}🔧 Comandos úteis:${NC}"
echo "   Ver logs:   eb logs"
echo "   Ver status: eb status"
echo "   Abrir app:  eb open"
echo "   Redeploy:   ./deploy-aws-eb.sh"
echo ""
echo -e "${BLUE}📊 Verificar status do ambiente:${NC}"
echo "   eb status"
echo ""
echo -e "${YELLOW}⚠️  Se o status estiver 'Severe':${NC}"
echo "   1. Aguarde 2-3 minutos"
echo "   2. Verifique: eb logs --all"
echo "   3. Teste: curl ${BACKEND_URL}/health"
echo ""

# Salvar informações
cat > deploy-info.txt << EOF
IARECOMEND Backend - Deploy Info
=================================

Data: $(date)
Ambiente: $EB_ENV
Aplicação: $EB_APP
Plataforma: Python 3.11 on Amazon Linux 2023

URLs:
  API:    ${BACKEND_URL}
  Docs:   ${BACKEND_URL}/docs
  Health: ${BACKEND_URL}/health

Health Check:
  Path: /health (configurado em 01_app.config)
  Interval: 15s
  Timeout: 5s

Comandos:
  Ver logs:   cd ${BACKEND_DIR} && eb logs
  Ver status: cd ${BACKEND_DIR} && eb status
  Redeploy:   cd ${BACKEND_DIR} && ./deploy-aws-eb.sh

Arquivos:
  - Procfile (uvicorn)
  - .ebextensions/01_app.config (única configuração)
  - .ebignore
EOF

print_success "Informações salvas em: deploy-info.txt"
echo ""