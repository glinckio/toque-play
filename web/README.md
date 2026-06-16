# ToquePlay — Painel Admin (`web`)

Painel administrativo da plataforma ToquePlay. Next.js 16 (App Router) integrado à API NestJS em `packages/backend`.

## Requisitos

- Node.js 20+
- Backend rodando em `http://localhost:3000` (`packages/backend`)
- Conta com `role = SUPER_ADMIN` (ver `packages/backend/prisma/seed.ts`)

## Setup

```bash
cd packages/web
corepack pnpm install
cp .env.local.example .env.local  # ajustar se necessário
corepack pnpm dev
```

App sobe em `http://localhost:3001`.

## Variáveis de ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api` | URL pública usada no browser |
| `API_INTERNAL_URL` | `http://localhost:3000/api` | URL server-side (route handlers, SSR) |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3001` | Base para redirects de logout |

## Como funciona

### Auth
- Login (`/login`) → POST `/api/auth/login` (route handler Next) → backend `POST /api/auth/login`.
- Tokens (access + refresh) gravados em **cookies httpOnly**; dados do usuário em cookie legível pelo client.
- `proxy.ts` (antigo middleware) faz gate: sem cookie de acesso → redirect `/login`; role fora de `SUPER_ADMIN`/`ADMIN` → redirect `/login?error=forbidden`.
- Refresh automático em rotas server-side (`lib/auth/session.ts`) e no proxy client (`app/api/proxy/[...path]/route.ts`).

### Comunicação com a API
- **Client**: helper `api` em `lib/api/client.ts` chama `/api/proxy/<path>`, que anexa o Bearer token e trata 401 (refresh + retry).
- **Server Components**: `serverGet` em `lib/api/index.ts` lê o cookie direto do backend.

### Páginas
- `/` — Dashboard (KPIs + gráficos)
- `/users` — Usuários (busca, paginação, bloquear/reativar)
- `/tournaments` — Torneios (filtros por status, bloquear, excluir)
- `/matches` — Partidas (filtros por status)
- `/athletes` — Atletas (com estatísticas agregadas)
- `/payments` — Pagamentos (filtros, ação de reembolso)
- `/settings` — Modo manutenção, mensagem global, monitoramento

## Endpoints do backend utilizados

Existentes (em `packages/backend/src/modules/admin/admin.controller.ts`):
- `GET /api/admin/dashboard`
- `GET /api/admin/users` · `PATCH /api/admin/users/:id/{block,unblock}`
- `GET /api/admin/tournaments` · `PATCH /api/admin/tournaments/:id/block` · `DELETE /api/admin/tournaments/:id`
- `GET /api/admin/system` · `PATCH /api/admin/system`
- `GET /api/admin/monitoring`
- `GET /api/admin/logs` · `GET /api/admin/metrics`

Adicionados neste projeto:
- `GET /api/admin/matches`
- `GET /api/admin/athletes`
- `GET /api/admin/payments`
- `POST /api/admin/payments/:id/refund` (marca como reembolsado; integração Stripe a fazer)

## Scripts

```bash
pnpm dev      # dev server na porta 3001
pnpm build    # build de produção
pnpm start    # sobe o build (também em 3001)
pnpm lint     # eslint
```

## Estrutura

```
src/
├─ app/
│  ├─ (admin)/          # rotas protegidas pelo proxy
│  │  ├─ layout.tsx     # sidebar + topbar
│  │  ├─ page.tsx       # dashboard
│  │  ├─ users/ tournaments/ matches/ athletes/ payments/ settings/
│  ├─ (auth)/login/     # tela pública de login
│  ├─ api/auth/{login,refresh,logout}/
│  ├─ api/proxy/[...path]/   # proxy autenticado p/ o backend
├─ components/
│  ├─ admin/            # UI portada do protótipo Vite + páginas
│  ├─ providers.tsx     # QueryClient + Toaster
│  ├─ ui/               # shadcn
├─ lib/
│  ├─ api/              # client + server helpers
│  ├─ auth/             # cookies, session, constants
│  ├─ utils.ts
├─ proxy.ts             # gate de rotas
```

## CORS

O backend (`packages/backend`) precisa permitir `http://localhost:3001`. Já consta no default de `main.ts`; caso sobrescreva via `CORS_ORIGINS`, inclua a origem.

## Próximos passos

- Integração real do reembolso via Stripe (`refundPayment` em `admin.service.ts`).
- Estender `getDashboard` com séries mensais/receita/distribuição de roles.
- Bulk actions (ex.: bloquear múltiplos usuários).
- Export CSV real.
