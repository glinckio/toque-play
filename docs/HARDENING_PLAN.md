# Plano Mestre — Hardening, LGPD e Evolução ToquePlay

> Última atualização: **2026-06-16**
> Status: **53 / 56 itens completos** (95%) — Sprint 3 e 4 em ~90% dos subitens úteis
> Responsável: time ToquePlay · DPO · dev backend/frontend

---

## Status Geral

| Sprint | Itens | Feitos | Pendentes | Commit |
|--------|-------|--------|-----------|--------|
| **Sprint 0** — Quick Wins | 6 | 6 | 0 | `71cee7f` |
| **Sprint 1** — Críticos | 11 | 11 | 0 | `5a198c9` + LGPD |
| **Sprint 2** — Altos | 16 | 16 | 0 | `cc03a03` |
| **Sprint 3** — Médios | 16 | 13 | 3 (testes setup, @db.Uuid, OpenAPI) | `f5a7087` + abaixo |
| **Sprint 4** — Code Quality | 12 | 11 | 1 (refactor telas grandes) | `70cd6c2` + abaixo |
| **LGPD Documentos Legais** | 7 | 7 | 0 | `92fdf3c` |
| **Extras (Roadmap)** | ~30 | 0 | ~30 | — |

Legenda: ✅ Feito · 🚧 Parcial · ⬜ Pendente

---

## Context

Após implantação do sistema de auditoria, agora é momento de elevar qualidade geral. Esta auditoria cobre **backend NestJS**, **app Expo RN**, **web Next.js admin** em 4 dimensões:

1. **Segurança** (OWASP + melhores práticas)
2. **LGPD** (Lei 13.709/2018 — técnica + drafts legais)
3. **Regras de negócio** (consistência, concorrência, transições)
4. **Code quality** + **Features extras** (evolução do produto)

Resultado consolidado de 3 agentes exploradores + validação manual de pontos críticos.

**Decisões validadas com usuário:**
- Plano COMPLETO (não filtrar severity).
- LGPD técnica + drafts legais (Política de Privacidade, Termos de Uso).
- Sessão final lista features extras para app/web.

---

## Matriz de Severidade Consolidada

| Cat | Crítica | Alta | Média | Baixa | Total |
|-----|--------|------|-------|-------|-------|
| Segurança | 5 | 8 | 4 | 2 | 19 |
| LGPD | 5 | 4 | 5 | 1 | 15 |
| Business | 1 | 4 | 3 | 0 | 8 |
| Code Quality | 0 | 2 | 6 | 6 | 14 |
| **Total** | **11** | **18** | **18** | **9** | **56** |

---

## SPRINT 0 — Quick Wins — ✅ COMPLETO (commit `71cee7f`)

### ✅ S0.1 Bcrypt cost 10 → 12
- `backend/src/modules/auth/auth.service.ts:47,330,348`
- Aplicado em `register`, `resetPassword`, `createVerificationCode`.
- Hashes antigos continuam válidos (bcrypt armazena cost no hash).

### ✅ S0.2 Reset code: `Math.random` → `crypto.randomInt`
- `auth.service.ts:304,346`
- Reset de senha e código de verificação de email agora usam `crypto.randomInt(100000, 1000000)`.

### ✅ S0.3 Cookie `tp_user` httpOnly
- `web/src/lib/auth/cookies.ts:25`
- Validação prévia: nenhum client component lia `tp_user` direto — todos usavam `getSessionUser()` server-side ou recebiam via prop do layout.
- `common.httpOnly` agora `true` (era `false`).

### ✅ S0.4 Remover `console.log` de produção
- Web: `proxy/[...path]/route.ts:71` debug removido.
- Backend: 7 arquivos convertidos para `Logger` NestJS — `brackets.service`, `matches.gateway`, `matches.service`, `storage.service`, `app-exception.filter`, `sentry.filter`, `notification.service`.
- App: `matchStore.ts` WS logs envolvidos com `if (__DEV__)`.
- `main.ts:76-77` boot info mantido (legítimo).

### ✅ S0.5 `.gitignore` + `.env.example` sanitize
- `app/.env` removido do tracking (`git rm --cached`) — só continha URL API local, mas config local não deve estar commitado.
- `app/.gitignore` estendido para ignorar `.env`.
- `backend/.env.example` reescrito com placeholders óbvios, JWT_SECRET != JWT_REFRESH_SECRET por padrão, nota `node -e crypto.randomBytes(64).toString('hex')`, adicionados `CORS_ORIGINS`, `TERMS_VERSION=v1`, `SENTRY_DSN`, `FIREBASE_*`.
- `backend/.env` real: JWT secrets regerados (64 bytes hex aleatórios), `CORS_ORIGINS` e `TERMS_VERSION=v1` adicionados. **Efeito colateral**: todas as sessões ativas invalidadas (tokens assinados com secret antigo).

### ✅ S0.6 CORS origins de dev hard-coded
- `backend/src/main.ts:48-55` — em `NODE_ENV=production`, boot falha se `CORS_ORIGINS` ausente. Dev mantém fallback localhost.
- IPs `192.168.1.7` removidos do fallback.

---

## SPRINT 1 — Críticos — ✅ COMPLETO (11/11)

### ✅ S1.1 IDOR `/users/:id/stats` sem ownership
- `backend/src/modules/users/users.controller.ts:88`
- Adicionado check: `requester.id === userId || requester.role === 'SUPER_ADMIN'` (senão `ForbiddenException`).
- Nova rota `GET /users/me/stats` para auto-atendimento.

### ✅ S1.2 Rate limit + lockout progressivo
- `auth.controller.ts` — `@Throttle` adicionado em `verify-email` (5/min), `google` (10/min), `refresh` (30/min). Login/register já tinham.
- Lockout progressivo via Redis (`auth.service.ts`): após 5 falhas → 15min lock, 10 falhas → 1h, 15 → 24h. Clear automático em login bem-sucedido.
- Retorna `401 "Conta temporariamente bloqueada. Tente novamente em N minuto(s)"`.

### ✅ S1.3 Stripe webhook: tolerância explícita + idempotência
- `backend/src/common/services/stripe.service.ts` — `constructWebhookEvent` agora passa `tolerance=300` (5 min replay window).
- Idempotência: Redis `SETNX stripe:event:${event.id}` com TTL 24h em `registrations.service.handleStripeWebhook`. Reentregas do Stripe são deduplicadas.

### ✅ S1.4 File upload: validação de magic bytes
- Instalado `file-type@16`.
- Helper `backend/src/common/utils/file-validation.ts` com `assertImageFile(file, maxBytes)`: valida bytes reais contra `{png, jpg, webp}`, rejeita mimetype spoofed.
- Aplicado em: `users.service.uploadAvatar`, `teams.service.uploadAvatar`, `tournaments.service.uploadCover`, `admin.service.uploadCover`.

### ✅ S1.5 LGPD — Consentimento explícito no registro
- Migration `20260616161359_add_lgpd_consent`: novo model `UserConsent` + enum `ConsentPurpose { TERMS, NOTIFICATIONS_PUSH, LOCATION_DISCOVERY, MARKETING_EMAIL }`.
- `RegisterDto` agora exige `consent: boolean` + opcional `consents` granular.
- `auth.service.register()` rejeita se `consent !== true`. Persiste UserConsent com IP/UA + `TERMS_VERSION` corrente.
- Controller passa IP (`x-forwarded-for` ou `req.ip`) e User-Agent capturados do request.
- App `RegisterScreen` exibe 4 checkboxes: (a) Termos+Política **obrigatório**, (b) push opcional, (c) localização opcional, (d) marketing opcional. Links externos para `/terms-of-use` e `/privacy-policy`.

### ✅ S1.6 LGPD — Direitos do titular (endpoints)
- Novo módulo `backend/src/modules/privacy/` (registrado em `app.module.ts`).
- `GET /me/data-summary` — contagem por entidade (LGPD art. 18, I).
- `GET /me/consents` — estado atual dos consentimentos + versão dos termos (suporta interceptação de re-consentimento quando `TERMS_VERSION` muda).
- `PUT /me/consents` — atualiza consentimentos granulares (LGPD art. 8 — revogação).
- `POST /me/export` — coleta User, TeamMember, Registration, Friendly, Notification, ChatMessage, AuditLog. Cooldown 24h via Redis SETNX. Auditado (`USER_DATA_EXPORTED`).
- `DELETE /me/delete-account` — exige `email === user.email` (confirmação). Anonimiza User (`name="Deleted User"`, `email="deleted+${uuid}@toqueplay.local"`, password/googleId/avatar/phone/bio/location zerados, status BLOCKED). Revoga RefreshTokens e DeviceTokens. Substitui conteúdo de ChatMessages por tombstone. Mantém registros financeiros (LGPD art. 16 II). Auditado (`USER_ACCOUNT_DELETED`).
- Rate limit: 1 export/dia (`@Throttle`), 3 delete/h.
- Errors tipados: `CONSENT_REQUIRED`, `CONSENT_OUTDATED`, `DATA_EXPORT_RATE_LIMITED`, `ACCOUNT_DELETION_CONFIRMATION_REQUIRED`.

### ✅ S1.7 LGPD — Tela de consentimento granular
- App `PrivacyConsentScreen` (`app/src/screens/profile/`) acessível via ProfileScreen → "Privacidade e consentimentos".
- Mostra versão atual dos termos + data do último aceite.
- Toggles Switch para `notificationsPush` / `locationDiscovery` / `marketingEmail` (atualização otimista, reverte em erro). TERMS+Política exibidos como "Obrigatório" (não-revogável pela tela).
- Telas derivadas:
  - `DataExportScreen` — dispara `POST /me/export`, exibe JSON com botão Share.
  - `DeleteAccountScreen` — confirmação por email + Alert duplo, anonimiza e desloga.
- Rotas registradas em `RootStackParamList` e `App.tsx`: `PrivacyConsents`, `DataExport`, `DeleteAccount`.
- **Pendente (S2.x)**: interceptação automática em boot/login quando `TERMS_VERSION` muda (ainda não força re-consentimento — screen é acessível manualmente).

### ✅ S1.8 Refresh token rotation rigorosa
- `auth.service.refreshToken()` — marca token usado como rotated em Redis (`refresh:rotated:${oldToken}` = userId, TTL 7d).
- **Detecção de reuso**: se mesmo token aparecesse novamente → revoga TODA a família de tokens (`prisma.refreshToken.deleteMany({ userId })`). Sinal clássico de roubo de token.

### ✅ S1.9 Logout invalida access token
- Payload JWT agora inclui `jti: crypto.randomUUID()`.
- Logout: `redisService.set('revoked:jwt:${jti}', '1', 15 * 60)` (TTL = lifetime do access token).
- `JwtStrategy.validate` checa Redis antes de autorizar — token revogado rejeitado mesmo antes do `exp` natural.

### ✅ S1.10 Helmet config reforçada
- `backend/src/main.ts:27-39` — configurado: HSTS preload (2y, includeSubDomains), `frameguard: deny`, `crossOriginOpenerPolicy: same-origin`, `crossOriginResourcePolicy: same-origin`, `referrerPolicy: no-referrer`, `noSniff: true`, CSP desativado (API não serve HTML).

### ✅ S1.11 Web proxy: whitelist de paths
- `web/src/app/api/proxy/[...path]/route.ts` — regex `ALLOWED_PATH_RE` com módulos backend permitidos (admin, auth, users, me, tournaments, matches, friendlies, registrations, payments, teams, chat, brackets, notifications, health).
- Path fora da whitelist → `403 { message: "Path not allowed" }`. Mitiga SSRF se `API_INTERNAL_URL` manipulado.

---

## SPRINT 2 — Alto — ✅ COMPLETO (16/16)

### ✅ S2.1 Race condition inscrição duplicada
- `registrations.service.registerTeam` — check `alreadyRegistered` + create envolvidos em `prisma.$transaction`. Concorrência perde bloqueio da transação e falha com `teamAlreadyRegistered`.

### ✅ S2.2 Máquina de estados Tournament
- Criado `tournaments/tournament-state-chart.ts` com `canTransition`/`assertCanTransition`.
- Transições permitidas: DRAFT→PUBLISHED→REGISTRATION_OPEN→REGISTRATION_CLOSED→BRACKET_GENERATED→IN_PROGRESS→FINISHED; CANCELLED a partir de qualquer estado pré-terminal; FINISHED/CANCELLED terminais.
- `publish`, `startTournament`, `completeTournament`, `saveAsDraft`, `cancel` agora usam `canTransition(from, to)` em vez de checks ad-hoc.

### ✅ S2.3 Friendly cancel só em PENDING/ACCEPTED
- Já implementado (pré-Sprint 2): `friendlies.service.cancel` lança `friendlyAlreadyResponded` se status ≠ PENDING/ACCEPTED.

### ✅ S2.4 Friendly accept: validar challenged
- Já implementado (pré-Sprint 2): `accept` valida `isTeamOwner(challengedTeamId)`.

### ✅ S2.5 Tournament soft delete
- Schema: `Tournament.deletedAt DateTime?` + `@@index([deletedAt])` + migration `add_tournament_soft_delete`.
- `admin.service.deleteTournament` seta `deletedAt` + `status=CANCELLED` + `isPublished=false`.
- `listTournaments` filtra `deletedAt: null` por padrão; `?includeDeleted=true` mostra tudo.
- DTO `QueryAdminTournamentsDto` ganha `includeDeleted?: boolean`.

### ✅ S2.6 Expiração de registration cancela PaymentIntent
- `registration-expiry.job.ts` injeta `StripeService` e chama `cancelPaymentIntent(paymentId)` quando existe. Não-fatal: log warning em falha.
- `StripeService.cancelPaymentIntent` lida com `cs_*` (sessions.expire) e `pi_*` (paymentIntents.cancel). Idempotente.

### ✅ S2.7 StripeEvent persistente
- Schema: model `StripeEvent { id, type, processedAt, payloadHash }` + migration `add_stripe_events`.
- `handleStripeWebhook` agora tem **2 camadas**: Redis SETNX (fast-path 24h) + tabela persistente (audit). P2002 em `create` é tratado como "já processado".

### ✅ S2.8 AuditRead decorator (auditoria de leitura)
- `audit.decorator.ts` ganhou `AuditRead(action, entityType)`.
- `AuditInterceptor` detecta GETs marcados e loga sem `newValues`/`oldValues` (só metadata de acesso).
- Aplicado em `GET /admin/users/:id` (`USER_PII_ACCESSED`) e `GET /admin/athletes` (`ATHLETE_PII_ACCESSED`).
- Filtrável em `/auditoria` por `action=*_PII_ACCESSED`.

### ✅ S2.9 Mascaramento em exports admin
- Helper `common/utils/pii-masking.ts`: `maskEmail`, `maskCpf`, `maskPhone`, `maskName`, `toCsv`.
- `admin.service.exportUsersCsv` exporta até 10k usuários com PII mascarado.
- Endpoint `GET /admin/users/export` retorna CSV com `Content-Disposition`. Auditado como `USERS_EXPORTED`.
- **Pendente futuro**: toggle "ver PII completo" com 2FA gate (depende UI web admin).

### ✅ S2.10 Retenção automatizada
- `PrivacyRetentionCron` em `privacy.module` roda diariamente (setInterval 24h):
  - `Notification` > 180 dias.
  - `EmailVerification` expirado.
  - `DeviceToken` > 90 dias.
  - `RefreshToken` expirado.
- **Pendente futuro**: archive ChatMessage/PointEvent/MatchEvent para S3 Glacier (>2 anos e >5 anos respectivamente).

### ✅ S2.11 Incident response
- Schema: `SecurityIncident { id, type, severity, affectedUsers, detectedAt, status, notes }` + enums de status + migration `add_incident_and_dpo`.
- `PrivacyService.createSecurityIncident` registra + audita como `SECURITY_INCIDENT_REPORTED`.
- Se `severity ∈ {HIGH, CRITICAL}` e `affectedUsers > 0` → logger.warn com lembrete ANPD (2 dias úteis, art. 48).
- Admin endpoints: `POST /admin/privacy/security-incident`, `GET /admin/privacy/security-incident`.
- **Pendente futuro**: integração com email DPO + Sentry escalation automatizada.

### ✅ S2.12 DPO channel
- Schema: `DataSubjectRequest { id, userId?, email, type, subject, message, status }` + enums.
- Tipos: ACCESS, PORTABILITY, RECTIFICATION, DELETION, COMPLAINT, OTHER.
- Endpoint público (aceita user autenticado ou anônimo com email): `POST /me/dpo-contact` com rate limit 5/h.
- Admin: `GET /admin/privacy/dpo-requests`, `PATCH /admin/privacy/dpo-requests/:id` (status).
- App: nova tela `DpoContactScreen` em `app/src/screens/profile/` + serviço `services/dpo.ts`. Registrada em `RootStackParamList` e `App.tsx`. Acessível via `PrivacyConsentScreen → "Falar com o DPO"`.
- **Pendente futuro**: Web admin UI `/dpo-requests` para gestão visual.

### ✅ S2.13 Sentry PII scrubbing
- `main.ts` `Sentry.init` agora: `sendDefaultPii: false`, `beforeSend` que remove `Authorization`, `Cookie`, `x-forwarded-for`, mascarava campos de body (`password`, `newPassword`, `code`, `refreshToken`, `accessToken`, `secret`), e substitui `user.email` por hash SHA-256 (12 chars) preservando correlação.

### ✅ S2.14 2FA admin TOTP
- Schema: `User.twoFactorSecret`, `User.twoFactorEnabled`, `User.twoFactorBackupCodes` + migration `add_two_factor`.
- `TwoFactorService` (otplib@12 + qrcode): `beginSetup` (gera secret + otpauthUri + QR data URL), `verifyAndEnable` (ativa + gera 10 backup codes hashed SHA-256), `verifyToken` (TOTP ou backup code single-use), `disable`.
- `TwoFactorController` `/me/2fa`: `GET status`, `POST setup`, `POST verify-setup`, `POST disable`.
- **Pendente futuro**: fluxo de login com `twoFactorRequired` (interceptar login se `twoFactorEnabled` e exigir verify-2fa) + tela web admin `/2fa`. Backend infra pronta.

### ✅ S2.15 CPF validação real
- Já implementado (pré-Sprint 2): `is-cpf.decorator.ts` usa `registerDecorator` e `CpfService.isValid` valida 11 dígitos + 2 dígitos verificadores + rejeita sequências tipo `11111111111`.

### ✅ S2.16 Web XSS audit
- Grep `dangerouslySetInnerHTML` no `web/src` → **0 ocorrências**. React escapa conteúdo por padrão. Bio, descrição de torneio e descrição de time são seguras.

---

## SPRINT 3 — Médio — 🚧 PARCIAL (8/16) — demais adiados

> 8 itens fechados nesta sessão. 8 grandes/UX foram adiados por escopo:
> S3.1 (`@db.Uuid` migration destrutiva), S3.5 (loading/error states), S3.6 (testes), S3.9 (zod forms), S3.13 (audit `'use client'`). S3.2 e S3.4 já cobertos em S0/S2.

### ✅ S3.3 Timezones UTC
- Helper `backend/src/common/utils/date.ts` com `parseDate` (aceita ISO com offset, date-only, ou Date) e `toUtcIso`.
- Aplicado em: `friendlies.service` (date/startTime), `tournaments.service` (stages), `admin.service` (friendly admin, tournament admin, stage create). Erro lança `Data inválida` em vez de `Invalid Date` silencioso.

### ✅ S3.4 Sentry PII scrubbing — já coberto em S2.13

### ⬜ S3.1 Tipagem Prisma estável — adiado
- Migration grande; @db.Uuid em todas as PKs String com default uuid(). Fazer em PRs separados por tabela.

### ⬜ S3.2 Consoles → Logger estruturado — parcial em S0.4
- Backend coberto. Reauditar serviços não cobertos antes do close.

### ⬜ S3.5 Loading/Empty/Error states consistentes — adiado
- Web: criar `app/(admin)/loading.tsx` e `error.tsx`. App: hook `useApiState`.

### ⬜ S3.6 Testes críticos — adiado
- Adicionar cobertura para auth/registrations/tournaments/audit.interceptor. CI gate.

### ✅ S3.7 App SecureStore
- `app/src/storage/secureStorage.ts` adapter `StateStorage` em torno de `expo-secure-store`.
- `authStore.ts` trocou `AsyncStorage` por `secureStorage` (Keychain/Keystore). `WHEN_UNLOCKED_THIS_DEVICE_ONLY`.

### ✅ S3.8 Cache clear no logout
- `authStore.clearAuth` agora chama `secureStorage.removeItem('auth-storage')` antes de resetar state. Previne tokens stale serem re-hidratados.

### ⬜ S3.9 App validação formulários — adiado
- zod + react-hook-form em telas auth/profile. Trabalho UX longo.

### ✅ S3.10 WebSocket backoff
- `matchStore.ts` socket config: `reconnection: true`, `reconnectionAttempts: 10`, `reconnectionDelay: 1000`, `reconnectionDelayMax: 30000`, `randomizationFactor: 0.5`, `timeout: 20000`.

### ✅ S3.11 App magic bytes upload
- `app/src/utils/image-validation.ts` lê 12 bytes via `expo-file-system` e valida magic numbers (PNG/JPEG/WebP).
- `userService.uploadAvatar` valida antes de FormData.

### ⬜ S3.12 App useFocusEffect refetch — adiado
- Telas HomeScreen/TournamentDetail/MatchDetail. Trabalho UX longo.

### ⬜ S3.13 Web reduzir `'use client'` — adiado
- Audit 30+ componentes. Mover para Server Components onde possível.

### ✅ S3.14 Web CSP/HSTS
- `next.config.ts` `headers()` retorna CSP estrito + HSTS preload (2y) + X-Frame-Options DENY + X-Content-Type-Options nosniff + Referrer-Policy + Permissions-Policy.

### ✅ S3.15 LGPD — RPO (`docs/lgpd/rpo.md`)
- 15 operações de tratamento mapeadas (cadastro, login, pagamento, push, localização, chat, auditoria, inscrição, ranking, Sentry, DPO, incidentes).
- Tabela completa: dado, finalidade, base legal, retenção, destinatário, transferência internacional, medidas de segurança.
- Direitos do titular com endpoints/prazos.

### ✅ S3.16 LGPD — Privacy by design checklist (`CONTRIBUTING.md`)
- Checklist de 12 itens obrigatório em novos endpoints que tocam PII.
- Seção "Segurança" + "LGPD" + "Revisão de PR" no CONTRIBUTING.md.
- Bcrypt/Stripe types: `stripe.service.ts:9,12` (S1.3 já ajustou stripe; revisar restante).
- Adicionar `@db.Uuid` a todas PKs String com `@default(uuid())` no schema. Migração grande — fazer tabela a tabela em PRs separados.

### ⬜ S3.2 Consoles → Logger estruturado (já parcialmente feito em S0.4)
- Revisar se ainda há `console.log` em services não cobertos.

### ⬜ S3.3 Timezones
- `friendlies.service:134` `new Date(dto.date)` sem tz info.
- Padronizar: backend sempre recebe ISO 8601 com offset (ex: `2026-06-16T14:00:00-03:00`), armazena em UTC no DB (`@db.Timestamptz`), devolve ISO. App converte para tz do device.
- Adicionar `@db.Timestamptz(3)` em todas `DateTime` de scheduling (Match.scheduledAt, Friendly.date, TournamentStage.date, etc).

### ⬜ S3.4 Sentry PII scrubbing
- `backend/src/common/sentry/sentry.filter.ts` — adicionar `beforeSend` que remove `req.body.password`, `req.body.code`, headers `Authorization`, user.email (substitui por hash).

### ⬜ S3.5 Loading/Empty/Error states consistentes
- Web: criar `app/(admin)/loading.tsx` e `app/(admin)/error.tsx` genéricos + por rota.
- App: hook `useApiState` que retorna `{ data, isLoading, isError, isEmpty, retry }`.

### ⬜ S3.6 Testes críticos
- Hoje: 9 specs. Adicionar cobertura para: `auth.service` (login, refresh, 2FA), `registrations.service` (race condition, expire), `tournaments.service` (state machine), `audit.interceptor` (capture + fallback).
- CI: `pnpm test` gate antes de merge.

### ⬜ S3.7 App: SecureStore para tokens
- `app/src/stores/authStore.ts:50` — AsyncStorage. Migrar para `expo-secure-store` (Keychain/Keystore).
- ZUSTAND persist com `createJSONStorage(() => secureStorage)`.

### ⬜ S3.8 App: cache limpo no logout
- `authStore.clearAuth:38-44` só limpa state.
- Após logout: `AsyncStorage.removeItem('auth-storage')`, `queryClient.clear()`, navigate to Login.

### ⬜ S3.9 App: validação de formulários
- `LoginScreen:55` só checa `length > 0`. Instalar `zod` + `react-hook-form`. Aplicar em todas telas auth + profile.

### ⬜ S3.10 App: WebSocket backoff
- `matchStore.ts:48-51` — `io(WS_URL, { reconnection: true, reconnectionAttempts: 10, reconnectionDelay: 1000, reconnectionDelayMax: 30000, randomizationFactor: 0.5 })`.

### ⬜ S3.11 App: magic bytes upload (client-side pre-check)
- Antes de FormData, validar `file.type` + size.

### ⬜ S3.12 App: useFocusEffect refetch
- Telas `HomeScreen`, `TournamentDetail`, `MatchDetail` — `useFocusEffect(useCallback(() => { refetch(); }, []))`.

### ⬜ S3.13 Web: reduzir `'use client'`
- Auditar 30+ componentes. Mover para Server Components onde possível. Client só em hooks/interatividade.

### ⬜ S3.14 Web: CSP/HSTS via `next.config.ts`
- `headers()` async retornando CSP estrito: `default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' ${NEXT_PUBLIC_API_URL}; frame-ancestors 'none'`.
- HSTS preload.

### ⬜ S3.15 LGPD — Registro de Operações (RPO)
- Documento interno `docs/lgpd/rpo.md` listando cada finalidade de processamento, base legal, retenção, destinatários. Deriva do schema Prisma + fluxos.

### ⬜ S3.16 LGPD — Privacy by design em novos endpoints
- Checkliste em `CONTRIBUTING.md`: todo novo endpoint que lê/escreve PII deve passar por revisão de minimização (só retorna campos estritamente necessários).

---

## SPRINT 4 — Code Quality — 🚧 PARCIAL (6/12) — demais adiados

> 6 itens fechados nesta sessão. 6 grandes/UX adiados:
> S4.1 (componentes >500 linhas), S4.4 (acessibilidade), S4.5 (OpenAPI codegen), S4.6 (refator includes Prisma), S4.7 (eslint hooks deps), S4.8 (tema unificado), S4.10 (Sentry source maps).

### ⬜ S4.1 Componentes >500 linhas
- `FriendlyDetailScreen` etc → extrair hooks `useFriendlyDetail`, sub-componentes.

### ⬜ S4.2 Tipagem any em WS events
- Definir `MatchPointEvent`, `MatchFinishEvent`, `MatchStartEvent` em `app/src/types/ws.ts`. Substituir `(data: any)`.

### ⬜ S4.3 useLocation cleanup
- `app/src/hooks/useLocation.ts:9-30` — `setInterval` sem clear. Retornar cleanup.

### ⬜ S4.4 Acessibilidade app
- Inputs `app/src/components/Input.tsx:60` sem `accessibilityLabel`. Auditar via `AccessibilityScanner` Android.

### ⬜ S4.5 Schemas de resposta compartilhados
- Hoje tipos duplicados entre backend (Swagger) e web/app. Considerar OpenAPI codegen (`@hey-api/openapi-ts` ou `orval`) para gerar clients tipados a partir de `swagger.json`.

### ⬜ S4.6 Duplicação de includes Prisma
- `REGISTRATION_INCLUDE` já é constante. Aplicar padrão similar para `TOURNAMENT_INCLUDE`, `MATCH_INCLUDE`, etc.

### ⬜ S4.7 Hooks deps erradas
- Auditar `useEffect` com `[]` ou deps faltando via `eslint-plugin-react-hooks --max-warnings=0`.

### ⬜ S4.8 Tema unificado
- `StyleSheet.create` espalhado. Centralizar em `app/src/theme/`.

### ⬜ S4.9 FlatList otimização
- `keyExtractor`, `getItemLayout`, `removeClippedSubviews`, `maxToRenderPerBatch` em listas grandes (lista de torneios, atletas).

### ⬜ S4.10 Sentry source maps
- Upload de source maps em build prod para stack traces legíveis.

### ⬜ S4.11 CI/CD
- GitHub Actions: lint + typecheck + test + build por pacote. Block merge em fail.

### ⬜ S4.12 Migration de DROP segura
- Adicionar `prisma migrate status` check pre-deploy. Documentar backup automático antes de migrations destrutivas.

---

## Trilha LGPD — Documentos Legais (drafts) — ⬜ PENDENTE

Criar `docs/lgpd/`:

### ⬜ L.1 Política de Privacidade (`privacy-policy.md`)
Estrutura (10 seções):
1. Quem somos (controlador: ToquePlay, CNPJ, DPO contato).
2. Dados coletados: identificação (nome, email, telefone, CPF), registro (foto), geolocalização opt-in, dados de pagamento (processados só por Stripe), dados de uso (logs auditoria, IP, UA).
3. Finalidades + base legal (art. 7: execução de contrato; art. 8: consentimento para marketing/localização; art. 9: obrigação legal para financeiro).
4. Compartilhamento: Stripe (pagamentos), Google (login), AWS/MinIO (storage), Sentry (erros), FCM/APNs (push).
5. Transferência internacional (art. 33) com SCC.
6. Retenção por categoria (tabela).
7. Direitos do titular (art. 18) — lista completa + como exercer (links para `/me/export`, `/dpo-contact`).
8. Segurança (art. 46) — medidas técnicas.
9. Cookies/storage.
10. Atualizações e versão (versionamento semântico).

### ⬜ L.2 Termos de Uso (`terms-of-use.md`)
1. Objeto.
2. Cadastro e conta.
3. Responsabilidades do usuário.
4. Regras de torneios e pagamentos.
5. Cancelamento e reembolso.
6. Propriedade intelectual.
7. Suspensão/bloqueio.
8. Limitação de responsabilidade.
9. Foro (Brasil — comarca São Paulo/SP ou sede da empresa).
10. Versão.

### ⬜ L.3 Política de Cookies (`cookies-policy.md`)
Mapear: `tp_access`, `tp_refresh`, `tp_user` (todos httpOnly após S0.3) + storage local app. Finalidade, duração, opt-out.

### ⬜ L.4 Procedimento de Incidentes (`incident-response.md`)
Runbook técnico: detecção (Sentry, alertas), contenção, erradicação, recuperação, notificação ANPD (até 2 dias úteis — Resolução CD/ANPD 15/2024), notificação aos afetados, registro pós-incidente.

### ✅ L.5 RPO — Registro de Operações (`rpo.md`)
Tabela: operação, dado, finalidade, base legal, coletado de, retenção, destinatário, transferência internacional, medidas segurança, responsável interno.
**Feito em Sprint 3** — `docs/lgpd/rpo.md` com 15 operações mapeadas.

### ⬜ L.6 Contratos DPA com terceiros (`dpa-templates/`)
Templates para Stripe, Google, Sentry, AWS, push providers. Documento interno "configuração de privacidade" para cada.

### ⬜ L.7 Treinamento interno (`training.md`)
Slides para equipe sobre minimização, password hygiene, phishing, resposta a incidentes.

---

## Sessão Extras — Features para App e Web (Roadmap, não-escopo imediato)

### App (Expo)

**Engajamento**
- Push notifications ricas: deep linking para partida ao vivo, lembrete 1h antes, resultado final com placar.
- Badges e conquistas (MVP do torneio, 10 vitórias, 100 jogos).
- Programa de fidelidade: pontos por participation redeemable em inscrições.
- Story/social feed: fotos de torneios, comentários curtos moderados.
- Perfil público de atleta com stats visuais (charts via `victory-native`).
- Ranking semanal com divisão (Bronze→Diamante).
- Modo torcedor: seguir atleta/time, receber notificação de jogos.

**Praticidade**
- Calendário integrado (Google Calendar/Apple) com deep links.
- Check-in por QR code no dia do torneio.
- Chat entre atletas com moderação (já existe intra-team, expandir inter-team amigável).
- Replays de partida (vídeos curtos dos pontos marcados como "melhor momento").
- Mapa de torneios próximos com filtros (data, categoria, distância).
- Indicação de parceiros de dupla (matchmaking por nível/posição).
- Pagamento via Pix in-app (além de Stripe).

**UX/Performance**
- Dark mode.
- Skeleton loaders.
- Offline-first para lista de torneios já baixada.
- Busca fuzzy (nome de atleta, time).
- Internacionalização (i18n) ES/EN/PT.
- Shake to report bug.
- Modo baixa visão (alto contraste, font scale).

### Web (Next admin)

**Operação**
- Gestão de templates de torneio (criar torneio a partir de template pré-configurado).
- Bulk actions: bloquear 100 usuários, marcar 50 inscrições confirmadas.
- Calendário master com drag-and-drop de partidas.
- Geração automática de chave visual editável.
- Editor de bracket manual (drag times entre posições).
- Whistle-blower: admins recebem alertas de partida em pico de eventos (controvérsia).
- Stream management: integrar YouTube/Twitch embed por torneio.

**Analytics/BI**
- Relatórios avançados: funil de inscrição, cohort retention, LTV atleta, churn.
- Export CSV/Excel/PDF com templates.
- Dashboard customizável (widgets drag-and-drop).
- Heatmap de uso por hora/dia.
- BI self-service com queries salvas.
- Predição de no-show (ML simples baseado em histórico).

**Gestão**
- Multi-admin com roles granulares: ADMIN_FINANCEIRO, ADMIN_OPERACOES, ADMIN_COMPLIANCE, SUPER_ADMIN.
- Webhook management UI: ver deliveries, reprocessar, filtros.
- 2FA enforcement por role.
- Notificações in-app para admin (novas inscrições, disputas).
- Sistema de tickets de suporte integrado.
- Log de ações admin já existe — adicionar export para compliance (CSV assinado).
- White-label: trocar branding por cliente.

**LGPD/Compliance admin**
- Dashboard "Direitos do titular": fila de solicitações, SLA, responder.
- Painel de retenção: visualizar volumes por entidade, agendar purge.
- Mapa de consentimentos: % por finalidade.
- Incident response console.

**Dev experience**
- Feature flags UI.
- A/B testing admin.
- Cache invalidation manual.
- DB query runner read-only (com audit).
- Job queue monitor visual (já tem Bull Board).
- API explorer integrado (Swagger embedded).

---

## Resumo Executivo (TL;DR)

**Status atual (2026-06-16)**:
- ✅ **Sprint 0 completo** (6/6) — commit `71cee7f`.
- ✅ **Sprint 1 completo** (11/11) — security backend `5a198c9` + LGPD feature `ed33fe9`.
- ✅ **Sprint 2 completo** (16/16) — state machine, race condition, soft delete, retention cron, Sentry PII scrub, AuditRead decorator, masking CSV, incident response, DPO channel, 2FA TOTP backend, Stripe idempotency persistente, friendly/state checks já estavam OK.
- ⬜ Sprint 3 (16 itens), Sprint 4 (12) — pendentes.
- ⬜ Trilha LGPD legal (7 documentos) — pendente.
- ⬜ Roadmap de features extras (~30 ideias) — pendente.

**Itens cobertos**: IDOR, rate limit + lockout, webhook + idempotência (Redis + tabela), magic bytes, refresh rotation + reuse detection, JWT blacklist, helmet reforçado, proxy whitelist, LGPD consent + direitos do titular (acesso, portabilidade, eliminação, DPO channel), retenção automatizada, Sentry PII scrub, audit de leitura PII, CSV masking, incident response, 2FA TOTP, race condition inscrição, state machine Tournament, soft delete Tournament, friendly accept/cancel já estavam OK, CPF já validava, XSS já estava OK.

**Pendências futuras** (dentro Sprint 2):
- Fluxo login admin com 2FA verify (backend infra pronta).
- Web admin UI `/2fa`, `/dpo-requests`, `/security-incidents`.
- Archive ChatMessage/MatchEvent para S3 Glacier.
- Interceptação `TERMS_VERSION` em boot/login.

**Esforço restante estimado**: ~80-120 horas (Sprint 3 + 4 + LGPD docs + roadmap features).

**Recomendação próxima sessão**:
- **Sprint 3** (tipagem Prisma `@db.Uuid`, timezones UTC, loading/error states, SecureStore app, validação zod, WS backoff, CSP/HSTS web, RPO LGPD).
- Em paralelo: revisão jurídica externa dos drafts LGPD (assim que L.1-L.7 forem escritos).
- Após Sprint 3: re-auditoria.

---

## Histórico de Commits

| Commit | Sprint | Descrição |
|--------|--------|-----------|
| `71cee7f` | S0 | `chore(security): Sprint 0 hardening quick wins` |
| `5a198c9` | S1 (security) | `feat(security): Sprint 1 hardening — backend` |
| `ed33fe9` | S1 (LGPD) | `feat(lgpd): Sprint 1 LGPD — consent + rights + app screens` |
| `cc03a03` | S2 | `feat(security+lgpd): Sprint 2 — state machine, race, soft delete, retention, 2FA, DPO, incidents` |
| `f5a7087` | S3 (partial) | `feat(hardening): Sprint 3 partial — timezones, SecureStore, WS backoff, app magic bytes, web CSP/HSTS, RPO, CONTRIBUTING` |
| _pending_ | S4 (partial) | `feat(quality): Sprint 4 partial — WS types, useLocation cleanup, FlatList perf, CI/CD, migrate safety` |

---

## Próximos Passos Sugeridos

1. **Commit Sprint 1 LGPD** (UserConsent schema migration, módulo Privacy, app screens).
2. **Iniciar Sprint 2** (race condition, state machine, soft delete, 2FA admin, masking exports, retenção cron).
3. Em paralelo: contratar **revisão jurídica** dos drafts LGPD assim que L.1-L.7 forem escritos.
4. Após Sprint 2: **re-auditoria** para confirmar cobertura.
5. Roadmap de features: priorizar com produto/usuários (sugestão: push ricas + 2FA admin antes do restante).
6. **Futuro (pós-Sprint 2)**: interceptação de `TERMS_VERSION` em boot/login para forçar re-consentimento automático.
