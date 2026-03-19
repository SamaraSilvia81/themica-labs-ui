# 🎨 themica — Design System Playground

Laboratório visual para testar **paletas de cores**, **tipografia** e **componentes UI** antes de implementar em projetos reais.  
Troque tema, fonte e modo escuro ao vivo — e edite qualquer cor diretamente pela interface.

> **The**_mica_ — onde o design toma forma.

---

## ✨ Funcionalidades

| Feature | Descrição |
|---|---|
| 🎨 **16 paletas de cores** | Cada tema tem light + dark mode |
| 🔤 **13 combinações tipográficas** | Pares heading/body + singles |
| ✏️ **Editor visual de cores** | Edite HEX/RGBA ao vivo, salva no localStorage |
| 🌙 **Dark mode** | Alternável por paleta |
| 📱 **Responsivo** | Funciona em mobile |
| 💾 **Preferências salvas** | Tema, typo, modo e cores customizadas persistem |
| 🏷️ **Logo adaptativo** | Nome "themica" muda de estilo com cada tipografia |

---

## 🗂️ Estrutura de Pastas

```
themica/  (pasta: ux-lab)
├── index.html
├── vite.config.js
├── package.json
│
└── src/
    ├── styles/
    │   ├── index.css               ← importa tudo
    │   ├── tokens/
    │   │   ├── _typography.css     Google Fonts + classes .typo-*
    │   │   └── _spacing.css        Variáveis globais
    │   ├── themes/
    │   │   ├── _reverie-soft.css   Paleta 1
    │   │   └── _all-themes.css     Paletas 2–16
    │   ├── components/
    │   │   ├── _buttons.css
    │   │   ├── _inputs.css
    │   │   ├── _cards.css
    │   │   ├── _table.css
    │   │   ├── _controllers.css    Painéis + editor de cores
    │   │   └── _typography-showcase.css
    │   ├── pages/
    │   │   ├── _login.css          Inclui estilo .brand-themica
    │   │   └── _dashboard.css
    │   └── utils/
    │       ├── _reset.css
    │       ├── _animations.css
    │       └── _responsive.css
    │
    ├── js/
    │   ├── main.js
    │   ├── core/ThemeLab.js
    │   ├── features/color-editor.js
    │   └── utils/
    │       ├── storage.js
    │       └── themes-data.js
    │
    └── assets/
        ├── fonts/
        ├── img/
        └── logo/
```

---

## 🚀 Rodando localmente

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera /dist
npm run preview  # visualiza o build
```

---

## 🌐 Deploy no GitHub Pages

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy themica

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

> Em `vite.config.js`, ajuste `base`:
> - Repo `/themica/` → `base: '/themica/'`
> - Repo raiz → `base: '/'`

---

## 🏷️ Estilo do logo — The*mica*

O nome usa a fonte heading ativa + segunda parte em itálico na `--accent` do tema:

```html
<h1 class="brand-themica">The<em>mica</em></h1>
```

Cada tipografia renderiza diferente — é exatamente isso que o showcase demonstra.  
Inspirado no projeto **Delicatte** (Cormorant Garamond + itálico crimson).

---

## ✏️ Editor de cores

1. Botão **🎨** → role até **"Editar Cores"**
2. Clique no swatch ou digite HEX/RGBA
3. Preview em tempo real
4. **Aplicar** → salva no localStorage
5. **Resetar** → volta ao tema base

Variáveis editáveis: `--primary` · `--secondary` · `--accent` · `--bg-body` · `--text-primary` · `--success` · `--warning` · `--danger`

---

## 🎨 Adicionando um tema novo

1. Crie `src/styles/themes/_meu-tema.css`
2. Importe em `src/styles/index.css`
3. Adicione ao array `THEMES` em `src/js/utils/themes-data.js`

```js
{ id: 'meu-tema', label: 'Meu Tema', colors: ['#cor1', '#cor2', '#cor3'] }
```

---

## 📦 Stack

- **Vite** — build + dev server
- **CSS puro** — custom properties nativas, sem framework
- **Vanilla JS ESM** — sem dependências de runtime
- **Phosphor Icons** — via CDN

---

## 📄 Licença

MIT

---

## 💡 Outros nomes considerados para a ferramenta

| Nome | Leitura | Conceito |
|---|---|---|
| **themica** ✦ *escolhido* | "thé-mi-ca" | De *theme* + sufixo orgânico — tema que vive |
| **Chromia** | "cró-mia" | Do grego *chroma* (cor) — laboratório de cor |
| **Palettia** | "pa-lé-tia" | *Palette* + sufixo italiano — galeria de paletas |
| **Styllab** | "stáil-lab" | *Style* + *lab* — laboratório de estilo direto |
| **Tonea** | "to-né-a" | De *tone* — tons e harmonia cromática |
| **Vistara** | "vis-tá-ra" | Do latim *vista* — visão, perspectiva visual |
| **Huela** | "ué-la" | De *hue* (matiz) — laboratório de matizes |
| **Pigmenta** | "pig-mén-ta" | De *pigment* — pigmentos e composição |

> A themica como ferramenta de **UI** (componentes, cores, tipografia) é diferente de um lab de **UX** (fluxos, heurísticas, testes de usabilidade). São complementares — a themica resolve o *como parece*, o UX Lab resolve o *como funciona*.

