# themica — monorepo

```
themica-monorepo/
├── landing/    → Landing page (Vite, porta 5173)
└── themica/    → O lab em si   (Vite, porta 5174)
```

## Rodar local

```bash
# instalar tudo
cd landing  && npm install
cd ../themica && npm install

# dev separados
npm run dev --prefix landing
npm run dev --prefix themica
```

## Deploy Vercel

Cada pasta é um projeto separado no Vercel:

| Projeto    | Root Directory | Build Command   | Output |
|------------|---------------|-----------------|--------|
| landing    | `landing`     | `npm run build` | `dist` |
| themica    | `themica`     | `npm run build` | `dist` |

No `themica/vite.config.js`, ajuste `base` para o path do seu domínio.
