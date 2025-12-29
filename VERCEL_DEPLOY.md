# Deploy no Vercel

Este documento descreve como conectar o repositório ao Vercel e publicar seu app (Vite + React + TypeScript). Inclui as variáveis de ambiente recomendadas e passos para validar que os QR codes gerados apontam para um domínio acessível.

## ✅ Pré-requisitos

- Repositório no GitHub (ou GitLab/Bitbucket) com acesso do seu usuário ou organização.
- Conta no Vercel (https://vercel.com).
- Node.js (local) para testes (recomendado 18+).

---

## Passo a passo (Web UI)

1. Acesse o painel do Vercel e clique em **Import Project** → **From Git Repository**. Autorize o Vercel a acessar seu repositório.
2. Selecione o repositório do projeto e clique em **Import**.
3. Configure os parâmetros do projeto:
   - **Framework Preset**: Vite (deve ser detectado automaticamente)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci` (ou `npm install`)
4. Clique em **Environment Variables** e adicione as variáveis abaixo (opcionalmente por ambiênte: Preview/Production/Development):
   - `VITE_BASE_URL` — **(Recomendado)** URL pública do deploy (ex.: `https://meu-app.vercel.app`). Quando definida, o app usará essa base para gerar links de QR que funcionarão em outros dispositivos.
   - Se você automatizar deploys via CLI/API, adicione também `VERCEL_TOKEN` (não é necessário só para deploy via web).
5. Clique em **Deploy**. O Vercel fará build e criará uma URL pública (preview/prod conforme branch).

---

## Configurações úteis

- **Custom domain**: no painel do projeto → Settings → Domains, adicione seu domínio e atualize os registros DNS com as instruções da Vercel.
- **Proteção de secrets**: configure variáveis por ambiente; **não** comite segredos no código.
- **Rollbacks**: o Vercel permite reverter para um deploy anterior via a UI.

---

## Testando QR e URLs em produção

- No ambiente de produção, configure `VITE_BASE_URL` com o domínio público (`https://meu-app.vercel.app`).
- Gere QRs usando esse domínio para garantir que celulares na mesma rede (ou qualquer lugar) possam acessar sem depender de `localhost`.

---

## Exemplo — usar `VITE_BASE_URL` no código

No código você pode usar (runtime):

```ts
const base = import.meta.env.VITE_BASE_URL || window.location.origin;
const url = `${base}/menu/sabor-do-para?mesa=${t.number}`;
```

Se `VITE_BASE_URL` estiver definida no Vercel, a geração do QR usará esse domínio automaticamente.

---

## Dicas finais

- Para assets e imagens de produtos (em produção) é recomendado usar um storage (S3/Cloudinary) em vez de salvar data URLs no localStorage.
- Se quiser, posso adicionar um pequeno script/README com comandos para o deploy via `vercel` CLI ou automatizar o deploy por GitHub Actions.

---

Se desejar, eu posso também:
- Adicionar a variável `VITE_BASE_URL` no código (substituir construções `window.location` por `import.meta.env.VITE_BASE_URL || window.location.origin`) e commitar as mudanças, ou
- Criar um template de `workflow` de GitHub Actions ou um pequeno script `vercel.json`.

Diga qual opção prefere e eu aplico em seguida.
