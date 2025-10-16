#!/bin/bash
# deploy-frontend.sh
# Deploy do frontend IARECOMEND no S3

set -e

echo "🚀 Iniciando deploy do frontend IARECOMEND..."

# Configurações
BACKEND_URL="http://iarecomend-prod-env.eba-5umweadu.us-east-1.elasticbeanstalk.com"
BUCKET_NAME="iarecomend-frontend-$(date +%s)"
REGION="us-east-1"

# Navegar para diretório do frontend
cd ~/IARECOMEND/frontend

echo "📝 Configurando variáveis de ambiente..."
cat > .env.production << EOF
VITE_API_URL=${BACKEND_URL}
EOF

echo "✅ Arquivo .env.production criado"
cat .env.production

echo ""
echo "📦 Instalando dependências..."
npm install

echo ""
echo "🔨 Fazendo build de produção..."
npm run build

# Verificar se build foi criado
if [ ! -d "dist" ]; then
    echo "❌ ERRO: Build não foi gerado (pasta dist/ não existe)"
    exit 1
fi

echo "✅ Build criado com sucesso!"
ls -lh dist/

echo ""
echo "☁️  Criando bucket S3: ${BUCKET_NAME}"
aws s3 mb s3://${BUCKET_NAME} --region ${REGION}

echo ""
echo "⚙️  Configurando bucket como site estático..."
aws s3 website s3://${BUCKET_NAME} \
  --index-document index.html \
  --error-document index.html

echo ""
echo "🔓 Desabilitando bloqueio de acesso público..."
aws s3api put-public-access-block \
  --bucket ${BUCKET_NAME} \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

echo ""
echo "📋 Criando política de acesso público..."
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket ${BUCKET_NAME} \
  --policy file://bucket-policy.json

echo ""
echo "📤 Fazendo upload dos arquivos..."

# Upload com cache longo para assets
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "*.txt"

# Upload index.html sem cache
aws s3 cp dist/index.html s3://${BUCKET_NAME}/index.html \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

# Upload de outros arquivos
if [ -f "dist/robots.txt" ]; then
    aws s3 cp dist/robots.txt s3://${BUCKET_NAME}/robots.txt
fi

echo ""
echo "✅ Upload concluído!"

# Obter URL do site
FRONTEND_URL="http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "📊 INFORMAÇÕES DO DEPLOY:"
echo ""
echo "Backend API:"
echo "  ${BACKEND_URL}"
echo ""
echo "Frontend Web:"
echo "  ${FRONTEND_URL}"
echo ""
echo "Bucket S3:"
echo "  ${BUCKET_NAME}"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
echo "🧪 TESTAR APLICAÇÃO:"
echo ""
echo "1. Abra no navegador:"
echo "   ${FRONTEND_URL}"
echo ""
echo "2. Credenciais de teste:"
echo "   Admin:    admin@shopinfo.com / admin123"
echo "   Vendedor: maria@shopinfo.com / 123456"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
echo "📝 COMANDOS ÚTEIS:"
echo ""
echo "Ver arquivos no S3:"
echo "  aws s3 ls s3://${BUCKET_NAME}/"
echo ""
echo "Atualizar frontend:"
echo "  npm run build && aws s3 sync dist/ s3://${BUCKET_NAME}/ --delete"
echo ""
echo "Deletar bucket:"
echo "  aws s3 rb s3://${BUCKET_NAME} --force"
echo ""
echo "═══════════════════════════════════════════════════════"

# Salvar URLs em arquivo
cat > deploy-info.txt << EOF
IARECOMEND - Informações de Deploy
===================================

Data: $(date)

Backend:  ${BACKEND_URL}
Frontend: ${FRONTEND_URL}
Bucket:   ${BUCKET_NAME}
Region:   ${REGION}

Credenciais de Teste:
- Admin:    admin@shopinfo.com / admin123
- Vendedor: maria@shopinfo.com / 123456

Comandos úteis:
- Atualizar: npm run build && aws s3 sync dist/ s3://${BUCKET_NAME}/ --delete
- Ver logs backend: cd ~/IARECOMEND/backend && eb logs
- Status backend: cd ~/IARECOMEND/backend && eb status
EOF

echo "💾 Informações salvas em: deploy-info.txt"
echo ""
