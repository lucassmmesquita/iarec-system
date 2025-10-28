#!/bin/bash
# Script para corrigir configuração do Elastic Beanstalk

set -e

echo "🔧 Corrigindo configuração do Elastic Beanstalk..."

cd ~/developer/iarec-system/backend

# 1. Criar routes/__init__.py
echo "📦 Criando routes/__init__.py..."
touch routes/__init__.py

# 2. Atualizar Procfile
echo "📝 Atualizando Procfile..."
cat > Procfile << 'EOF'
web: uvicorn app:app --host 0.0.0.0 --port 8000 --log-level info
EOF

# 3. Recriar .ebextensions
echo "⚙️  Recriando .ebextensions..."
rm -rf .ebextensions
mkdir -p .ebextensions

# Pacotes do sistema
cat > .ebextensions/01_packages.config << 'EOF'
packages:
  yum:
    postgresql-devel: []
    gcc: []
    python3-devel: []
EOF

# Configurações Python e variáveis de ambiente
cat > .ebextensions/02_python.config << 'EOF'
option_settings:
  aws:elasticbeanstalk:application:environment:
    ENVIRONMENT: production
    DEBUG: "False"
    RDS_DB_HOST: "iarecomend-db2.can8uiyocmxb.us-east-1.rds.amazonaws.com"
    RDS_DB_PORT: "5432"
    RDS_DB_NAME: "postgres"
    RDS_DB_USER: "postgres"
    RDS_DB_PASSWORD: "ShopInfo#123"
    SECRET_KEY: "production-secret-key-iarecomend-2025"
    PYTHONPATH: "/var/app/current:$PYTHONPATH"
  aws:elasticbeanstalk:container:python:
    WSGIPath: app:app

commands:
  01_upgrade_pip:
    command: "/var/app/venv/*/bin/pip install --upgrade pip"
    ignoreErrors: true
EOF

# 4. Criar .ebignore
echo "🚫 Criando .ebignore..."
cat > .ebignore << 'EOF'
venv/
.venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.so
*.egg
*.egg-info/
dist/
build/
.env
.env.local
.env.production
*.log
.DS_Store
.vscode/
.idea/
*.swp
*.swo
.pytest_cache/
.coverage
htmlcov/
.git/
.gitignore
README.md
docs/
tests/
*.md
seed_data.py
test_*.py
EOF

# 5. Criar .python-version
echo "🐍 Definindo versão Python..."
echo "3.11" > .python-version

# 6. Verificar requirements.txt
echo "📋 Verificando requirements.txt..."
if ! grep -q "uvicorn" requirements.txt; then
    echo "❌ uvicorn não encontrado em requirements.txt"
    exit 1
fi

echo "✅ requirements.txt OK"

# 7. Mostrar estrutura
echo ""
echo "📂 Estrutura de arquivos:"
ls -la | grep -E "Procfile|requirements.txt|.python-version"
ls -la routes/ | grep "__init__.py"
ls -la .ebextensions/

echo ""
echo "✅ Configuração corrigida!"
echo ""
echo "🚀 Próximos passos:"
echo "   1. Verificar se está tudo OK acima"
echo "   2. Executar: eb deploy"
echo ""