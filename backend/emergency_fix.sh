#!/bin/bash
# emergency_fix.sh - Correção Emergencial para Processo Web

echo "🚨 CORREÇÃO EMERGENCIAL - Processo Web Não Inicia"
echo "================================================="
echo ""

cd ~/developer/iarec-system/backend

# 1. Ver logs do erro
echo "📋 1. VERIFICANDO LOGS DE ERRO"
echo "==============================="
eb logs | grep -A 10 -B 5 "error\|Error\|ERROR\|failed\|Failed" | tail -n 50
echo ""

# 2. Verificar o que está no app.py
echo "📋 2. ESTRUTURA DO APP.PY"
echo "========================="
echo "Primeiras 30 linhas:"
head -n 30 app.py
echo ""

# 3. Criar requirements.txt CORRETO para FastAPI
echo "📋 3. CRIANDO REQUIREMENTS.TXT CORRETO"
echo "======================================"
cat > requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn[standard]==0.24.0
gunicorn==21.2.0
python-multipart==0.0.6
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1
pydantic==2.5.0
python-dotenv==1.0.0
EOF

echo "✅ requirements.txt criado:"
cat requirements.txt
echo ""

# 4. Criar Procfile CORRETO
echo "📋 4. CRIANDO PROCFILE CORRETO"
echo "=============================="

# Verificar qual é a instância FastAPI no app.py
if grep -q "^app = FastAPI()" app.py; then
    APP_VAR="app:app"
    echo "✅ Detectado: app = FastAPI()"
elif grep -q "^application = FastAPI()" app.py; then
    APP_VAR="app:application"
    echo "✅ Detectado: application = FastAPI()"
else
    echo "⚠️  Não foi possível detectar a instância FastAPI"
    echo "    Usando padrão: app:app"
    APP_VAR="app:app"
fi

cat > Procfile << EOF
web: gunicorn -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers 2 --timeout 120 --log-level debug $APP_VAR
EOF

echo "✅ Procfile criado:"
cat Procfile
echo ""

# 5. Limpar TUDO
echo "📋 5. LIMPANDO ARQUIVOS ANTIGOS"
echo "================================"
rm -rf .ebextensions
rm -rf venv/
rm -rf __pycache__/
rm -f *.pyc
rm -f deploy-package.zip
echo "✅ Limpeza concluída"
echo ""

# 6. Criar .ebextensions MINIMALISTA
echo "📋 6. CRIANDO .EBEXTENSIONS MINIMALISTA"
echo "======================================="
mkdir -p .ebextensions

cat > .ebextensions/01_packages.config << 'EOF'
packages:
  yum:
    gcc: []
    python3-devel: []
EOF

cat > .ebextensions/02_python.config << 'EOF'
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: app:app
  aws:elasticbeanstalk:application:environment:
    PYTHONPATH: "/var/app/current"
    ENVIRONMENT: "production"
    DEBUG: "False"
EOF

echo "✅ .ebextensions criado"
echo ""

# 7. Testar localmente ANTES do deploy
echo "📋 7. TESTE LOCAL (OPCIONAL)"
echo "============================"
echo "Execute este comando para testar localmente:"
echo ""
echo "  gunicorn -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 $APP_VAR"
echo ""
read -p "Deseja testar localmente agora? (s/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🧪 Testando localmente..."
    
    # Iniciar gunicorn em background
    gunicorn -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers 1 $APP_VAR > /dev/null 2>&1 &
    PID=$!
    
    echo "⏳ Aguardando 5 segundos para aplicação iniciar..."
    sleep 5
    
    # Testar se está funcionando
    if curl -s http://localhost:8000/docs > /dev/null 2>&1; then
        echo "✅ Aplicação funcionando localmente!"
        echo "   Acesse: http://localhost:8000/docs"
        kill $PID 2>/dev/null
    else
        echo "❌ Aplicação NÃO está funcionando localmente"
        echo ""
        echo "🔍 Tentando identificar o erro..."
        # Tentar iniciar em foreground para ver o erro
        gunicorn -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers 1 $APP_VAR &
        ERROR_PID=$!
        sleep 2
        kill $ERROR_PID 2>/dev/null
        
        echo ""
        echo "⚠️  Verifique o erro acima antes de fazer deploy!"
        kill $PID 2>/dev/null
        
        read -p "Deseja continuar mesmo assim? (s/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Ss]$ ]]; then
            exit 1
        fi
    fi
fi

# 8. Criar pacote
echo ""
echo "📋 8. CRIANDO PACOTE DE DEPLOY"
echo "=============================="
zip -r deploy-package.zip \
    *.py \
    requirements.txt \
    Procfile \
    .ebextensions/ \
    -x "*.pyc" \
    -x "__pycache__/*" \
    -x "venv/*" \
    -x ".env" \
    -x "*.log" \
    -x ".git/*"

echo "✅ Pacote criado"
unzip -l deploy-package.zip
echo ""

# 9. Fazer deploy
echo "📋 9. FAZENDO DEPLOY"
echo "===================="
read -p "Fazer deploy agora? (s/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🚀 Fazendo deploy..."
    eb deploy
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deploy concluído!"
        echo ""
        echo "⏳ Aguardando 30 segundos..."
        sleep 30
        
        echo "🧪 Testando aplicação..."
        if curl -s http://iarecomend-prod-env.eba-5umweadu.us-east-1.elasticbeanstalk.com/docs > /dev/null 2>&1; then
            echo "✅ Aplicação está funcionando!"
        else
            echo "⚠️  Aplicação ainda não está respondendo"
            echo "   Aguarde mais um pouco ou verifique os logs"
        fi
    else
        echo "❌ Deploy falhou!"
        echo "   Execute: eb logs"
    fi
else
    echo "ℹ️  Deploy cancelado"
    echo "   Execute manualmente: eb deploy"
fi

echo ""
echo "================================================="
echo "✅ Correção emergencial concluída!"
echo "================================================="
echo ""
echo "Se ainda houver erro, execute:"
echo "  eb logs"
echo "  eb ssh"
echo ""