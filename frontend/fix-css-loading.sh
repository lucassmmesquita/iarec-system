#!/bin/bash
# fix-css-loading.sh
# Corrige problema de CSS não carregando no S3

set -e

echo "🎨 Corrigindo carregamento de CSS no S3..."

cd ~/IARECOMEND/frontend

BUCKET_NAME="iarecomend-frontend-1760632349"
BACKEND_URL="http://iarecomend-prod-env.eba-5umweadu.us-east-1.elasticbeanstalk.com"

# 1. Atualizar vite.config.js com base relativa
echo "⚙️  Atualizando vite.config.js..."
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})
EOF

echo "✅ vite.config.js atualizado"

# 2. Garantir .env.production
echo "🔧 Configurando variáveis de ambiente..."
cat > .env.production << EOF
VITE_API_URL=${BACKEND_URL}
EOF

# 3. Limpar build anterior
echo "🧹 Limpando build anterior..."
rm -rf dist/

# 4. Fazer novo build
echo "🔨 Fazendo build com configuração corrigida..."
npm run build

# Verificar se build foi criado
if [ ! -d "dist" ]; then
    echo "❌ ERRO: Build falhou!"
    exit 1
fi

echo "✅ Build criado com sucesso!"

# 5. Verificar estrutura do dist
echo ""
echo "📂 Estrutura do build:"
ls -lh dist/
echo ""
echo "📦 Assets:"
ls -lh dist/assets/ | head -n 10

# 6. Limpar bucket S3
echo ""
echo "🗑️  Limpando arquivos antigos do S3..."
aws s3 rm s3://${BUCKET_NAME}/ --recursive

# 7. Upload com content-types corretos
echo ""
echo "📤 Fazendo upload para S3..."

# Upload de todos os arquivos
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable"

# Upload específico do index.html sem cache
aws s3 cp dist/index.html s3://${BUCKET_NAME}/index.html \
  --content-type "text/html; charset=utf-8" \
  --cache-control "no-cache, no-store, must-revalidate"

# Garantir content-types corretos
echo "🎯 Configurando content-types..."

# CSS
for file in $(aws s3 ls s3://${BUCKET_NAME}/assets/ --recursive | grep ".css" | awk '{print $4}'); do
    aws s3 cp s3://${BUCKET_NAME}/${file} s3://${BUCKET_NAME}/${file} \
        --content-type "text/css" \
        --metadata-directive REPLACE \
        --cache-control "public, max-age=31536000, immutable"
done

# JavaScript
for file in $(aws s3 ls s3://${BUCKET_NAME}/assets/ --recursive | grep ".js" | awk '{print $4}'); do
    aws s3 cp s3://${BUCKET_NAME}/${file} s3://${BUCKET_NAME}/${file} \
        --content-type "application/javascript" \
        --metadata-directive REPLACE \
        --cache-control "public, max-age=31536000, immutable"
done

# SVG
for file in $(aws s3 ls s3://${BUCKET_NAME}/ --recursive | grep ".svg" | awk '{print $4}'); do
    aws s3 cp s3://${BUCKET_NAME}/${file} s3://${BUCKET_NAME}/${file} \
        --content-type "image/svg+xml" \
        --metadata-directive REPLACE \
        --cache-control "public, max-age=31536000, immutable"
done

echo ""
echo "✅ Upload concluído!"

# 8. Verificar index.html
echo ""
echo "🔍 Verificando index.html no S3..."
aws s3 cp s3://${BUCKET_NAME}/index.html - | grep -E "(href|src)=" | head -n 5

# 9. Testar URLs
FRONTEND_URL="http://${BUCKET_NAME}.s3-website-us-east-1.amazonaws.com"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ DEPLOY CORRIGIDO COM SUCESSO!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "🌐 URL do Frontend:"
echo "   ${FRONTEND_URL}"
echo ""
echo "🔗 URL do Backend:"
echo "   ${BACKEND_URL}"
echo ""
echo "🧪 Testar no navegador:"
echo "   1. Abra: ${FRONTEND_URL}"
echo "   2. Pressione Ctrl+Shift+R (hard refresh)"
echo "   3. Credenciais: admin@shopinfo.com / admin123"
echo ""
echo "🔍 Verificar no DevTools:"
echo "   1. F12 > Network"
echo "   2. Verificar se CSS/JS carregam (status 200)"
echo ""
echo "═══════════════════════════════════════════════════════"

# Salvar informações
cat > deploy-final.txt << EOF
IARECOMEND - Deploy Final
========================

Data: $(date)

Frontend: ${FRONTEND_URL}
Backend:  ${BACKEND_URL}
Bucket:   ${BUCKET_NAME}

Credenciais:
- Admin:    admin@shopinfo.com / admin123
- Vendedor: maria@shopinfo.com / 123456

Atualizar:
cd ~/IARECOMEND/frontend
npm run build
aws s3 sync dist/ s3://${BUCKET_NAME}/ --delete
EOF

echo "💾 Informações salvas em: deploy-final.txt"
echo ""
