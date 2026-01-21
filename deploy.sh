#!/bin/bash

# Script de deploy para Vercel
# Uso: ./deploy.sh

echo "🚀 Iniciando deploy para Vercel..."

# Verifica se está autenticado
if ! npx vercel whoami &> /dev/null; then
    echo "❌ Você precisa fazer login na Vercel primeiro."
    echo "Execute: npx vercel login"
    exit 1
fi

# Faz o build
echo "📦 Fazendo build do projeto..."
npm run build

# Faz o deploy em produção
echo "🌐 Fazendo deploy em produção..."
npx vercel --prod --yes

echo "✅ Deploy concluído!"
