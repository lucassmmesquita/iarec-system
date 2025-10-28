#!/bin/bash
# deploy.sh - Script de Deploy Completo IARECOMEND (FastAPI + React)
# Uso: ./deploy.sh [frontend|backend|all]

set -e

# ==========================================
# CONFIGURAÇÕES
# ==========================================
PROJECT_DIR="$HOME/developer/iarec-system"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
S3_BUCKET="iarecomend-frontend-1760632349"
BACKEND_URL="http://iarecomend-prod-env.eba-5umweadu.us-east-1.elasticbeanstalk.com"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==========================================
# FUNÇÕES AUXILIARES
# ==========================================

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# ==========================================
# DEPLOY BACKEND (FastAPI)
# ==========================================

deploy_backend() {
    print_header "DEPLOY DO BACKEND (FastAPI)"
    
    cd "$BACKEND_DIR"
    
    print_info "Verificando arquivos obrigatórios..."
    
    if [ ! -f "app.py" ]; then
        print_error "app.py não encontrado!"
        exit 1
    fi
    
    if [ ! -f "requirements.txt" ]; then
        print_error "requirements.txt não encontrado!"
        exit 1
    fi
    
    if [ ! -f "config.py" ]; then
        print_error "config.py não encontrado!"
        exit 1
    fi
    
    print_success "Arquivos OK"
    
    # Criar/atualizar Procfile para FastAPI com Uvicorn
    print_info "Criando Procfile para FastAPI..."
    cat > Procfile << 'EOF'
web: uvicorn app:app --host 0.0.0.0 --port 8000
EOF
    
    # Criar/atualizar .ebextensions
    print_info "Configurando Elastic Beanstalk..."
    mkdir -p .ebextensions
    
    cat > .ebextensions/python.config << 'EOF'
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: app:app
  aws:elasticbeanstalk:application:environment:
    ENVIRONMENT: production
    DEBUG: "False"
    RDS_DB_HOST: "iarecomend-db2.can8uiyocmxb.us-east-1.rds.amazonaws.com"
    RDS_DB_PORT: "5432"
    RDS_DB_NAME: "postgres"
    RDS_DB_USER: "postgres"
    RDS_DB_PASSWORD: "ShopInfo#123"
    SECRET_KEY: "production-secret-key-change-me"
  aws:elasticbeanstalk:environment:proxy:staticfiles:
    /static: static
EOF
    
    print_success "Configuração criada"
    
    print_info "Fazendo deploy no Elastic Beanstalk..."
    eb deploy
    
    if [ $? -eq 0 ]; then
        print_success "Backend deployado com sucesso!"
        print_info "URL: $BACKEND_URL"
    else
        print_error "Falha no deploy do backend"
        exit 1
    fi
    
    print_info "Testando API (aguardando 10s)..."
    sleep 10
    
    # Testar health check
    if curl -s "$BACKEND_URL/health" | grep -q "healthy"; then
        print_success "API está respondendo!"
        
        # Testar endpoint de usuários
        print_info "Testando endpoint de usuários..."
        if curl -s "$BACKEND_URL/api/usuarios" > /dev/null 2>&1; then
            print_success "Endpoint /api/usuarios OK!"
        else
            print_warning "Endpoint /api/usuarios pode estar carregando..."
        fi
        
        # Testar documentação
        print_info "Documentação disponível em: $BACKEND_URL/docs"
        
    else
        print_warning "API pode estar demorando para iniciar. Verifique com: eb logs"
        print_info "Aguarde 1-2 minutos e teste manualmente:"
        print_info "  Health: $BACKEND_URL/health"
        print_info "  Docs:   $BACKEND_URL/docs"
        print_info "  API:    $BACKEND_URL/api/usuarios"
    fi
}

# ==========================================
# DEPLOY FRONTEND
# ==========================================

deploy_frontend() {
    print_header "DEPLOY DO FRONTEND"
    
    cd "$FRONTEND_DIR"
    
    print_info "Verificando arquivos obrigatórios..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json não encontrado!"
        exit 1
    fi
    
    if [ ! -f "index.html" ]; then
        print_error "index.html não encontrado!"
        exit 1
    fi
    
    print_success "Arquivos OK"
    
    print_info "Criando .env.production..."
    cat > .env.production << EOF
VITE_API_URL=$BACKEND_URL
EOF
    
    print_success "Configurado para usar: $BACKEND_URL"
    
    print_info "Instalando dependências..."
    npm install --silent
    
    print_info "Limpando build anterior..."
    rm -rf dist/
    
    print_info "Fazendo build de produção..."
    npm run build
    
    if [ ! -d "dist" ]; then
        print_error "Build falhou - pasta dist/ não foi criada"
        exit 1
    fi
    
    print_success "Build criado com sucesso!"
    
    # Verificar tamanho do CSS (deve ter Tailwind compilado)
    CSS_SIZE=$(find dist/assets -name "*.css" -exec du -k {} + | awk '{sum+=$1} END {print sum}')
    
    if [ "$CSS_SIZE" -lt 20 ]; then
        print_warning "CSS muito pequeno ($CSS_SIZE KB) - Tailwind pode não ter compilado"
    else
        print_success "CSS compilado: ${CSS_SIZE}KB"
    fi
    
    print_info "Fazendo upload para S3..."
    
    # Limpar bucket
    aws s3 rm s3://${S3_BUCKET}/ --recursive --quiet
    
    # Upload de assets com cache longo
    aws s3 sync dist/ s3://${S3_BUCKET}/ \
        --delete \
        --cache-control "public, max-age=31536000, immutable" \
        --exclude "index.html" \
        --quiet
    
    # Upload do index.html sem cache
    aws s3 cp dist/index.html s3://${S3_BUCKET}/index.html \
        --content-type "text/html; charset=utf-8" \
        --cache-control "no-cache, no-store, must-revalidate" \
        --quiet
    
    print_success "Upload concluído!"
    
    FRONTEND_URL="http://${S3_BUCKET}.s3-website-us-east-1.amazonaws.com"
    print_info "URL: $FRONTEND_URL"
    
    # Testar frontend
    print_info "Testando frontend..."
    sleep 2
    
    if curl -s "$FRONTEND_URL" | grep -q "IARECOMEND\|IARecomend"; then
        print_success "Frontend está acessível!"
    else
        print_warning "Frontend pode estar demorando para propagar. Aguarde alguns segundos."
    fi
}

# ==========================================
# DEPLOY COMPLETO
# ==========================================

deploy_all() {
    print_header "DEPLOY COMPLETO - BACKEND + FRONTEND"
    
    START_TIME=$(date +%s)
    
    # Deploy backend primeiro
    deploy_backend
    
    echo ""
    print_info "Aguardando 15 segundos para backend estabilizar..."
    sleep 15
    
    # Deploy frontend
    deploy_frontend
    
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    print_header "DEPLOY CONCLUÍDO"
    
    echo ""
    print_success "Tempo total: ${DURATION}s"
    echo ""
    echo -e "${GREEN}📊 INFORMAÇÕES DO DEPLOY:${NC}"
    echo ""
    echo -e "${BLUE}Backend API (FastAPI):${NC}"
    echo "  $BACKEND_URL"
    echo "  Docs: $BACKEND_URL/docs"
    echo "  Health: $BACKEND_URL/health"
    echo ""
    echo -e "${BLUE}Frontend Web (React):${NC}"
    echo "  http://${S3_BUCKET}.s3-website-us-east-1.amazonaws.com"
    echo ""
    echo -e "${BLUE}Banco de Dados (RDS):${NC}"
    echo "  Host: iarecomend-db2.can8uiyocmxb.us-east-1.rds.amazonaws.com"
    echo "  Database: postgres"
    echo ""
    echo -e "${YELLOW}🧪 TESTAR:${NC}"
    echo "  1. Abra o frontend no navegador"
    echo "  2. Use: admin@shopinfo.com / admin123"
    echo "  3. Acesse a documentação: $BACKEND_URL/docs"
    echo ""
    echo -e "${BLUE}📝 LOGS:${NC}"
    echo "  Backend:  cd $BACKEND_DIR && eb logs"
    echo "  Frontend: aws s3 ls s3://${S3_BUCKET}/"
    echo ""
    
    # Salvar informações
    cat > "$PROJECT_DIR/deploy-info.txt" << EOF
IARECOMEND - Deploy Info
========================

Data: $(date)

Backend API:  $BACKEND_URL
API Docs:     $BACKEND_URL/docs
Health Check: $BACKEND_URL/health

Frontend Web: http://${S3_BUCKET}.s3-website-us-east-1.amazonaws.com
S3 Bucket:    ${S3_BUCKET}

Database RDS: iarecomend-db2.can8uiyocmxb.us-east-1.rds.amazonaws.com

Credenciais de teste:
- admin@shopinfo.com / admin123

Comandos úteis:
- Ver logs backend: cd $BACKEND_DIR && eb logs
- Ver status: ./deploy.sh status
- Atualizar frontend: cd $FRONTEND_DIR && npm run build && aws s3 sync dist/ s3://${S3_BUCKET}/ --delete
EOF
    
    print_success "Informações salvas em: $PROJECT_DIR/deploy-info.txt"
}

# ==========================================
# STATUS
# ==========================================

show_status() {
    print_header "STATUS DOS SERVIÇOS"
    
    echo -e "${BLUE}Backend (Elastic Beanstalk):${NC}"
    cd "$BACKEND_DIR"
    eb status | grep -E "CNAME|Status|Health|Platform"
    
    echo ""
    echo -e "${BLUE}Frontend (S3):${NC}"
    aws s3 ls s3://${S3_BUCKET}/ | tail -n 5
    
    echo ""
    echo -e "${BLUE}URLs:${NC}"
    echo "  Backend:  $BACKEND_URL"
    echo "  Docs:     $BACKEND_URL/docs"
    echo "  Frontend: http://${S3_BUCKET}.s3-website-us-east-1.amazonaws.com"
    
    echo ""
    echo -e "${BLUE}Testando conectividade:${NC}"
    
    # Testar backend
    if curl -s "$BACKEND_URL/health" > /dev/null 2>&1; then
        print_success "Backend está online"
    else
        print_error "Backend não está respondendo"
    fi
    
    # Testar frontend
    if curl -s "http://${S3_BUCKET}.s3-website-us-east-1.amazonaws.com" > /dev/null 2>&1; then
        print_success "Frontend está online"
    else
        print_error "Frontend não está respondendo"
    fi
}

# ==========================================
# LOGS
# ==========================================

show_logs() {
    print_header "LOGS DO BACKEND"
    cd "$BACKEND_DIR"
    eb logs
}

# ==========================================
# ROLLBACK
# ==========================================

rollback_backend() {
    print_header "ROLLBACK DO BACKEND"
    cd "$BACKEND_DIR"
    print_warning "Fazendo rollback para versão anterior..."
    eb deploy --version $(eb appversion lifecycle | tail -n 2 | head -n 1 | awk '{print $2}')
}

# ==========================================
# MENU PRINCIPAL
# ==========================================

show_menu() {
    echo ""
    echo "=========================================="
    echo "  IARECOMEND - Script de Deploy"
    echo "=========================================="
    echo ""
    echo "Uso: ./deploy.sh [comando]"
    echo ""
    echo "Comandos:"
    echo "  all        - Deploy completo (backend + frontend)"
    echo "  backend    - Deploy apenas do backend FastAPI"
    echo "  frontend   - Deploy apenas do frontend React"
    echo "  status     - Verificar status dos serviços"
    echo "  logs       - Ver logs do backend"
    echo "  rollback   - Voltar para versão anterior do backend"
    echo ""
    echo "Exemplos:"
    echo "  ./deploy.sh all"
    echo "  ./deploy.sh backend"
    echo "  ./deploy.sh frontend"
    echo "  ./deploy.sh status"
    echo ""
}

# ==========================================
# VALIDAÇÕES INICIAIS
# ==========================================

validate_environment() {
    # Verificar se está no Mac
    if [[ "$OSTYPE" != "darwin"* ]]; then
        print_warning "Este script foi feito para Mac. Pode não funcionar em outros sistemas."
    fi
    
    # Verificar AWS CLI
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI não encontrado. Instale com: brew install awscli"
        exit 1
    fi
    
    # Verificar EB CLI
    if ! command -v eb &> /dev/null; then
        print_error "EB CLI não encontrado. Instale com: pip3 install awsebcli"
        exit 1
    fi
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js não encontrado. Instale com: brew install node"
        exit 1
    fi
    
    # Verificar se diretórios existem
    if [ ! -d "$PROJECT_DIR" ]; then
        print_error "Diretório do projeto não encontrado: $PROJECT_DIR"
        exit 1
    fi
    
    print_success "Ambiente validado"
}

# ==========================================
# MAIN
# ==========================================

main() {
    # Validar ambiente
    validate_environment
    
    # Processar argumentos
    case "${1:-help}" in
        all|ALL)
            deploy_all
            ;;
        backend|back)
            deploy_backend
            ;;
        frontend|front)
            deploy_frontend
            ;;
        status|st)
            show_status
            ;;
        logs|log)
            show_logs
            ;;
        rollback|rb)
            rollback_backend
            ;;
        help|--help|-h|*)
            show_menu
            ;;
    esac
}

# Executar
main "$@"