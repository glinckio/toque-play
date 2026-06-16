# Contribuindo para o ToquePlay

Este documento orienta desenvolvimento no monorepo `packages/{backend,app,web}`.

## Setup

- `pnpm install` na raiz (pnpm via corepack).
- Backend: `cd backend && pnpm exec prisma generate && pnpm run start:dev`.
- App: `cd app && pnpm start`.
- Web admin: `cd web && pnpm dev`.

## Padrões de código

- **TypeScript estrito** — sem `any` em código novo.
- **Conventional commits** — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- **Builds precisam passar** — `pnpm --filter <pkg> run build` antes de commit.
- **Schema Prisma migration** — sempre `pnpm --filter backend exec prisma migrate dev --name <desc>` para alterações de schema.

## Segurança

- Nunca commitar `.env`. Variáveis reais ficam no secret manager (prod) ou `.env` local (gitignored).
- Validar **todo** input de rota com DTOs `class-validator` (`whitelist: true`, `forbidNonWhitelisted: true` já no ValidationPipe global).
- Hashear senhas com bcrypt cost ≥ 12.
- Usar `crypto.randomInt` para códigos (nunca `Math.random`).
- File uploads devem passar por `assertImageFile` (magic bytes).
- Endpoints que disparam mutação sensível recebem `@Audit(action, entityType)` para auditoria.

## LGPD — Privacy by Design Checklist

> **Aplicar em TODO novo endpoint que lê ou escreve dados pessoais.**

Antes de abrir o PR, confirme:

- [ ] **Minimização**: o endpoint retorna apenas os campos estritamente necessários? (ex: `select` no Prisma em vez de `include: *`).
- [ ] **Base legal**: a finalidade está coberta por uma base legal do art. 7º/8º/9º/10º/11º (execução de contrato, consentimento, obrigação legal, legítimo interesse, etc.)? Atualize `docs/lgpd/rpo.md` se for finalidade nova.
- [ ] **Consentimento granular**: se tratar dado sensível (localização, biométrico, marketing), exige `@IsBoolean() consentimentoX` explícito e gravação em `UserConsent`.
- [ ] **Direitos do titular**: endpoints de leitura de PII do próprio usuário devem ter equivalente em `/me/*` para que ele possa exercer acesso/portabilidade.
- [ ] **Retenção**: dado novo tem TTL definido? Se armazena indefinidamente, justifique (ex: obrigação fiscal 5 anos).
- [ ] **PII em logs**: não logar senha, código, refresh token. `AuditInterceptor` sanitiza automaticamente — confirme que campos novos sensíveis entrem na lista `STRIP_KEYS` se necessário.
- [ ] **PII em Sentry**: o `beforeSend` em `main.ts` remove headers Authorization/Cookie e hashs email. Não adicionar payload novo com PII semelhante sem antes estender o scrubber.
- [ ] **Compartilhamento com terceiros**: se envia dados para Stripe/Google/FCM/Sentry/etc., está na lista do RPO §2? Caso contrário, abrir questão com o DPO.
- [ ] **Transferência internacional**: provedor fora do Brasil? Documentar base do art. 33 (SCC, decisão de adequação da ANPD).
- [ ] **Auditoria**: mutações em PII têm `@Audit`? Leituras de PII pelo admin têm `@AuditRead`?
- [ ] **Rate limit**: rotas sensíveis (auth, export, DPO) têm `@Throttle`.
- [ ] **Mascaramento em exports**: listagens/CSVs admin usam helpers `maskEmail/maskCpf/maskPhone/maskName` — PII completa só via toggle 2FA-gated.

## Migrations destrutivas

Antes de aplicar migrations que contêm `DROP`, `ALTER TYPE`, ou `ALTER COLUMN` com perda de dados:

1. **Status check**: `pnpm --filter backend run db:migrate:status` para confirmar estado atual.
2. **Backup**: rodar `pg_dump` (ou snapshot gerenciado) em ambientes não-dev antes de aplicar.
3. **Review do SQL**: abrir o arquivo gerado em `prisma/migrations/<ts>_<name>/migration.sql`. Não aplicar no automerge se houver `DROP TABLE` sem `IF EXISTS` ou `CASCADE`.
4. **Rollback plan**: migrations Prisma são forward-only. Documentar rollback manual no PR (ex: SQL para recriar índice/coluna).
5. **Dry-run**: para migrations grandes, criar PR separado, aplicar em staging primeiro, validar antes de prod.

Scripts disponíveis em `backend/package.json`:

- `pnpm --filter backend run db:migrate` — dev (`migrate dev`).
- `pnpm --filter backend run db:migrate:prod` — deploy (`migrate deploy`).
- `pnpm --filter backend run db:migrate:status` — checar estado (não-destrutivo).
- `pnpm --filter backend run db:migrate:resolve` — marcar migration como aplicada (em caso de drift).

## Testes

- Hoje: 9 specs em backend (`*.service.spec.ts`). Nova lógica crítica (auth, payment, registration, audit) deve vir acompanhada de teste.
- Frontend: idealmente React Native Testing Library para componentes críticos do app. Web admin usa React Query + componentes server-first quando possível.

## Revisão de PR

- Rodar `pnpm --filter backend run build && pnpm --filter web run build && pnpm --filter app run tsc --noEmit` antes de pedir review.
- Confirmar que não há `console.log` desnecessários em produção (backend usa `Logger`, app wrap com `__DEV__`).
- Atualizar `docs/HARDENING_PLAN.md` se o PR toca um item de sprint.
