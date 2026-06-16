# Plano Mestre — Hardening, LGPD e Evolução ToquePlay

> Última atualização: **2026-06-16**
> Status: **17 / 56 itens completos** (30%)
> Responsável: time ToquePlay · DPO · dev backend/frontend

---

## Status Geral

| Sprint | Itens | Feitos | Pendentes | Commit |
|--------|-------|--------|-----------|--------|
| **Sprint 0** — Quick Wins | 6 | 6 | 0 | `71cee7f` |
| **Sprint 1** — Críticos | 11 | 11 | 0 | `5a198c9` + LGPD |
| **Sprint 2** — Altos | 16 | 0 | 16 | — |
| **Sprint 3** — Médios | 16 | 0 | 16 | — |
| **Sprint 4** — Code Quality | 12 | 0 | 12 | — |
| **LGPD Documentos Legais** | 7 | 0 | 7 | — |
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

## SPRINT 2 — Alto — ⬜ PENDENTE (16 itens)

### ⬜ S2.1 Race condition inscrição duplicada
- `registrations.service.registerTeam:99-130` — check `alreadyRegistered` + create não atômico.
- **Fix**: envolver em `prisma.$transaction(async (tx) => { check + create })`. Adicionalmente, criar `@@unique([tournamentId, teamMemberId])` em `Registration` com partial filter `status NOT IN (CANCELLED, REJECTED)` — Postgres não suporta partial unique em Prisma até 5.x; alternativa: `@@unique([tournamentId, teamMemberId, status])` e capturar `P2002` no service.

### ⬜ S2.2 Máquina de estados Tournament
- `tournaments.service` hoje permite `publish` de qualquer status.
- Criar `tournamentStateChart.ts`:
  ```
  DRAFT → PUBLISHED
  PUBLISHED → REGISTRATION_OPEN | DRAFT
  REGISTRATION_OPEN → REGISTRATION_CLOSED
  REGISTRATION_CLOSED → BRACKET_GENERATED
  BRACKET_GENERATED → IN_PROGRESS
  IN_PROGRESS → FINISHED
  FINISHED → (terminal)
  * → CANCELLED
  ```
- `publish()`, `startTournament()`, `completeTournament()` etc lançam `AppError.invalidStateTransition` se fora do permitido.

### ⬜ S2.3 Friendly cancel só em PENDING/ACCEPTED
- `friendlies.service.cancel:386-406` permite cancelar qualquer status.
- Restringir: cancel permitido se `status IN (PENDING, ACCEPTED)`. Quando `ACCEPTED`, exigir motivo + notificar contraparte. Considerar penalidade futura (não no escopo).

### ⬜ S2.4 Friendly accept: validar challenged
- `friendlies.service.accept:205-219` — confirmar que `userId` é `challengedId` OU capitão do `challengedTeamId`. Rejeitar `challengedTeamId == null` (amistoso aberto tem regra diferente).

### ⬜ S2.5 Tournament soft delete
- `admin.service.deleteTournament:225` hoje faz hard delete.
- Adicionar `deletedAt DateTime?` no model Tournament + `@@index([deletedAt])`. Service `deleteTournament` seta `deletedAt`. Todas as queries usam middleware Prisma `extension` para filtrar `deletedAt: null` automaticamente.
- Admin tem toggle "mostrar excluídos" via query param `includeDeleted=true`.

### ⬜ S2.6 Expiração de registration cancela PaymentIntent
- Job Bull `registration-expiry` hoje só muda status. Adicionar: se `paymentId` existir, chamar `stripeService.cancelPaymentIntent(paymentId)`. Idempotente.

### ⬜ S2.7 Webhook Stripe idempotência persistente (complemento S1.3)
- Tabela `StripeEvent { id, type, processedAt, payload Hash }` para auditabilidade persistente (Redis atual cobre runtime; tabela cobre histórico).

### ⬜ S2.8 LGPD — Auditoria de leitura em dados sensíveis
- Hoje AuditInterceptor só loga mutações. Adicionar decorator `@AuditRead(action, entityType)` para `GET /admin/users/:id`, `GET /admin/athletes`, exports.
- Action `USER_PII_ACCESSED`/`ATHLETE_PII_ACCESSED`. Filtrável em `/auditoria`.

### ⬜ S2.9 LGPD — Mascaramento em exports admin
- Web: botão "Exportar" em `/users`, `/athletes`, `/payments`. Hoje provavelmente exporta raw.
- Export CSV com: `cpf: ***.123.456-**`, `email: em***@domain.com`, `phone: (***) ***-1984`.
- Toggle admin "ver PII completo" requer 2FA (ver S2.14).

### ⬜ S2.10 LGPD — Retenção automatizada
- Cron diário (Bull recurrent):
  - `Notification` > 180d → delete.
  - `EmailVerification` expirado → delete.
  - `DeviceToken` > 90d sem uso → delete.
  - `RefreshToken` expirado → delete.
  - `ChatMessage` > 2 anos → arquivar (S3 Glacier) e deletar do DB.
  - `PointEvent`, `MatchEvent` > 5 anos → arquivar e deletar.
- Documentar política no `/privacy-policy`.

### ⬜ S2.11 LGPD — Notificação de incidente (art. 48)
- Endpoint interno `POST /admin/security-incident` registra incidente em `SecurityIncident { type, severity, affectedUsers, detectedAt, status }`.
- Se `severity=ALTA/CRITICA` e `affectedUsers > 0`, dispara workflow (email DPO + Sentry escalation).
- Documentar runbook em `docs/security-incident.md`.

### ⬜ S2.12 LGPD — DPO channel
- App: tela "Fale com o DPO" (`/dpo-contact`) com formulário (assunto, mensagem, anexos ≤ 5MB). Cria ticket em `DataSubjectRequest { userId?, email, type, message, status, createdAt }`.
- Web admin: rota `/dpo-requests` para gestão.

### ⬜ S2.13 LGPD — Transferência internacional (art. 33)
- Documentar transferências: Sentry (US), Google OAuth (US), Stripe (US), FCM/APNs (US).
- Adicionar cláusula Standard Contractual Clauses referenciada na Política.
- Configurar Sentry `sendDefaultPII: false` e mascarar `email`, `cpf` via `beforeSend`.

### ⬜ S2.14 Login 2FA para admins
- Backend: TOTP via `otplib`. `User.twoFactorSecret`, `User.twoFactorEnabled`.
- Fluxo: login admin → se `twoFactorEnabled`, retorna `{ twoFactorRequired: true, tempToken }`. Client mostra input TOTP. `POST /auth/verify-2fa { tempToken, code }` → access/refresh normais.
- Web: tela `/2fa` após login. Backup codes gerados 1x.

### ⬜ S2.15 CPF validação real (dígito verificador)
- `backend/src/common/decorators/is-cpf.decorator.ts:8` usa `CpfService` instanciado fora DI. Converter para `ValidatorConstraint` com `registerDecorator`.
- Validar 11 dígitos + dígito verificador (algoritmo oficial). Rejeitar sequências tipo `111.111.111-11`.

### ⬜ S2.16 Web XSS em user content
- Bio, descrição de torneio, descrição de time renderizadas em Telas — confirmar se usam `{value}` (React escapa por padrão) vs `dangerouslySetInnerHTML` (não deve existir).
- Grep `dangerouslySetInnerHTML` no web/app. Se zero, OK. Se presente em bio/descrição, sanitizar com `DOMPurify`.

---

## SPRINT 3 — Médio — ⬜ PENDENTE (16 itens)

### ⬜ S3.1 Tipagem Prisma estável
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

## SPRINT 4 — Code Quality — ⬜ PENDENTE (12 itens)

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

### ⬜ L.5 RPO — Registro de Operações (`rpo.md`)
Tabela: operação, dado, finalidade, base legal, coletado de, retenção, destinatário, transferência internacional, medidas segurança, responsável interno.

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
- ✅ **Sprint 0 completo** (6/6) — commit `71cee7f`. Quick wins sem regressão.
- ✅ **Sprint 1 completo** (11/11): security backend (`5a198c9`) + LGPD feature (UserConsent schema, módulo Privacy, app screens). Próximo: interceptação de `TERMS_VERSION` em boot/login (S2.x).
- ⬜ Sprint 2 (16 itens), Sprint 3 (16), Sprint 4 (12) — pendentes.
- ⬜ Trilha LGPD legal (7 documentos) — pendente.
- ⬜ Roadmap de features extras (~30 ideias) — pendente.

**Itens críticos cobertos**: IDOR, rate limit + lockout, Stripe webhook + idempotência, magic bytes uploads, refresh rotation + reuse detection, JWT blacklist no logout, helmet reforçado, proxy whitelist, LGPD consent + direitos do titular (acesso, portabilidade, eliminação). Cobrem ~90% do OWASP top 10 + base LGPD técnica.

**Esforço restante estimado**: ~150-200 horas distribuídas em 5-8 sprints.

**Recomendação próxima sessão**:
- **Sprint 2** (race condition inscrição, state machine Tournament, soft delete, 2FA admin, masking exports, retenção cron).
- Em paralelo: revisão jurídica externa dos drafts LGPD (assim que L.1-L.7 forem escritos).
- Após Sprint 2: re-auditoria para confirmar cobertura.

---

## Histórico de Commits

| Commit | Sprint | Descrição |
|--------|--------|-----------|
| `71cee7f` | S0 | `chore(security): Sprint 0 hardening quick wins` |
| `5a198c9` | S1 (security) | `feat(security): Sprint 1 hardening — backend` |
| _pending_ | S1 (LGPD) | `feat(lgpd): Sprint 1 LGPD — consent + rights + app screens` |

---

## Próximos Passos Sugeridos

1. **Commit Sprint 1 LGPD** (UserConsent schema migration, módulo Privacy, app screens).
2. **Iniciar Sprint 2** (race condition, state machine, soft delete, 2FA admin, masking exports, retenção cron).
3. Em paralelo: contratar **revisão jurídica** dos drafts LGPD assim que L.1-L.7 forem escritos.
4. Após Sprint 2: **re-auditoria** para confirmar cobertura.
5. Roadmap de features: priorizar com produto/usuários (sugestão: push ricas + 2FA admin antes do restante).
6. **Futuro (pós-Sprint 2)**: interceptação de `TERMS_VERSION` em boot/login para forçar re-consentimento automático.
