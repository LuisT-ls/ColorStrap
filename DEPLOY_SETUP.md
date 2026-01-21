# Configuração de Deploy Automático - Vercel + GitHub

## ✅ Deploy Manual Concluído

O deploy manual foi realizado com sucesso. Para configurar o deploy automático:

## 🔧 Passos para Configurar Deploy Automático

### 1. Acesse o Dashboard da Vercel
- Acesse: https://vercel.com/dashboard
- Entre no projeto **colorstrap**

### 2. Conecte o Repositório GitHub

1. Vá em **Settings** → **Git**
2. Se não houver repositório conectado:
   - Clique em **Connect Git Repository**
   - Selecione **GitHub**
   - Autorize o acesso se necessário
   - Selecione o repositório: `LuisT-ls/ColorStrap`
   - Clique em **Connect**

### 3. Verifique as Configurações

1. **Production Branch**: Certifique-se de que está configurado como `main`
2. **Build Command**: Deve ser `npm run build` (já configurado)
3. **Output Directory**: Deve estar vazio (Next.js detecta automaticamente)
4. **Install Command**: Deve ser `npm install`

### 4. Verifique Permissões do GitHub

1. No GitHub, vá em: **Settings** → **Installed GitHub Apps**
2. Verifique se **Vercel** está instalado
3. Certifique-se de que tem acesso ao repositório `ColorStrap`

### 5. Verifique Webhooks

1. No GitHub, vá em: **Settings** → **Webhooks** do repositório
2. Deve haver um webhook da Vercel
3. Se não houver, desconecte e reconecte o repositório na Vercel

### 6. Teste o Deploy Automático

Após configurar, faça um commit e push:

```bash
git add .
git commit -m "test: Test automatic deployment"
git push origin main
```

O deploy deve iniciar automaticamente na Vercel.

## 🔍 Troubleshooting

### Se o deploy automático não funcionar:

1. **Verifique o email do commit**:
   ```bash
   git config user.email
   ```
   O email deve estar associado à sua conta Vercel

2. **Verifique os webhooks no GitHub**:
   - Deve haver um webhook da Vercel ativo
   - Se não houver, reconecte o repositório

3. **Verifique as permissões**:
   - Você deve ser Owner/Admin do repositório no GitHub
   - A Vercel GitHub App deve ter acesso ao repositório

4. **Tente desconectar e reconectar**:
   - Na Vercel: Settings → Git → Disconnect
   - Depois: Connect novamente

## 📝 Informações do Projeto

- **Projeto Vercel**: colorstrap
- **ID do Projeto**: prj_R3rz0WYyXld9ZyoXT21Z3GVfb8tu
- **Repositório GitHub**: https://github.com/LuisT-ls/ColorStrap.git
- **Branch de Produção**: main
- **URL de Produção**: https://colorstrap.vercel.app
