# Olha que Duas

Repositório do site **Olha que Duas** — comunicação, voz e negócios com propósito.

## Sobre

Projecto multi-página com rádio ao vivo, blog, galeria de trabalhos, loja, área kids e secções institucionais.

## Stack

- **Vite + React 18 + TypeScript** — SPA com code-splitting por rota
- **Tailwind CSS + shadcn/ui** — design system
- **TanStack React Query** — fetching/caching (rádio, schedule, weather, gallery)
- **Supabase** — metadados (álbuns, programação, blog)
- **Cloudinary** — armazenamento e entrega de imagens
- **AzuraCast** (self-hosted em `radio.olhaqueduas.com`) — streaming + now-playing API
- **Vitest + Testing Library** — testes unitários
- **Vercel** — deploy + edge functions

## Como instalar

```bash
git clone <repo>
cd olha-que-duas
npm install
npm run dev          # vite dev server
```

Variáveis de ambiente necessárias (`.env.local`):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Sem estas variáveis o site cai em fallbacks hardcoded para a programação e galeria, e funciona normalmente para tudo o resto.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (`dist/`) |
| `npm run build:dev` | Build em modo development |
| `npm run preview` | Preview do build |
| `npm run lint` | ESLint |
| `npm test` | Testes unitários (vitest) |
| `npm run test:watch` | Testes em modo watch |

## Deploy

Build estático que pode ser servido em Vercel, Netlify ou qualquer estática. As edge functions vivem em `supabase/functions/` (deployadas via `supabase functions deploy`) e em `api/` (Vercel).

## Documentação adicional

- [`CLAUDE.md`](./CLAUDE.md) — convenções do projecto e workflow da galeria
- [`TODO.md`](./TODO.md) — backlog de melhorias
