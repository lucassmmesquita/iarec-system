#!/bin/bash
# SOLUÇÃO FINAL - Corrige erro do postgresql-devel no Amazon Linux 2023
set -e

echo "🔧 Aplicando correção FINAL para Amazon Linux 2023..."
echo ""

cd ~/developer/iarec-system/backend

# ============================================
# 1. LIMPAR TUDO
# ============================================
echo "🧹 Limpando..."
rm -rf .ebextensions
mkdir -p .ebextensions
echo "✅ Limpo"
echo ""

# ============================================
# 2. .EBEXTENSIONS COM PACOTE CORRETO
# ============================================
echo "⚙️  Criando .ebextensions/01_app.config..."
cat > .ebextensions/01_app.config << 'EOF'
option_settings:
  aws:elasticbeanstalk:application:environment:
    ENVIRONMENT: production
    DEBUG: "False"
    RDS_DB_HOST: iarecomend-db2.can8uiyocmxb.us-east-1.rds.amazonaws.com
    RDS_DB_PORT: "5432"
    RDS_DB_NAME: postgres
    RDS_DB_USER: postgres
    RDS_DB_PASSWORD: "ShopInfo#123"
    SECRET_KEY: production-secret-key-iarecomend-2025
    PYTHONPATH: /var/app/current
  aws:elasticbeanstalk:container:python:
    NumProcesses: 1
    NumThreads: 15

packages:
  yum:
    postgresql15-devel: []
    gcc: []
EOF

echo "✅ Criado com postgresql15-devel (Amazon Linux 2023)"
echo ""

# ============================================
# 3. PROCFILE
# ============================================
echo "📝 Criando Procfile..."
cat > Procfile << 'EOF'
web: uvicorn app:app --host 0.0.0.0 --port 8000 --workers 2
EOF
echo "✅ Procfile OK"
echo ""

# ============================================
# 4. REQUIREMENTS.TXT
# ============================================
echo "📦 Atualizando requirements.txt..."
cat > requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1
pydantic==2.5.0
python-dotenv==1.0.0
EOF
echo "✅ requirements.txt OK"
echo ""

# ============================================
# 5. .EBIGNORE
# ============================================
echo "🚫 Criando .ebignore..."
cat > .ebignore << 'EOF'
venv/
.venv/
__pycache__/
*.pyc
.env
*.log
.git/
test_*.py
.DS_Store
EOF
echo "✅ .ebignore OK"
echo ""

# ============================================
# 6. VERIFICAR ESTRUTURA
# ============================================
echo "🔍 Verificando estrutura..."
if [ ! -d "routes" ]; then
    mkdir -p routes
fi
if [ ! -f "routes/__init__.py" ]; then
    touch routes/__init__.py
fi
echo "✅ Estrutura OK"
echo ""

# ============================================
# 7. MOSTRAR CONFIGURAÇÃO
# ============================================
echo "=========================================="
echo "📋 CONFIGURAÇÃO CRIADA"
echo "=========================================="
echo ""
echo "📝 Procfile:"
cat Procfile
echo ""
echo "⚙️  .ebextensions/01_app.config:"
cat .ebextensions/01_app.config
echo ""

# ============================================
# 8. INSTRUÇÕES FINAIS
# ============================================
echo "=========================================="
echo "✅ PRONTO PARA DEPLOY!"
echo "=========================================="
echo ""
echo "🚀 Execute agora:"
echo ""
echo "git add Procfile requirements.txt .ebextensions .ebignore routes/"
echo "git commit -m 'fix: usar postgresql15-devel para Amazon Linux 2023'"
echo "eb deploy"
echo ""
echo "Depois teste:"
echo "curl http://iarecomend-prod-env.eba-5umweadu.us-east-1.elasticbeanstalk.com/health"
echo ""