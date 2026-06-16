# RPO — Registro de Operações de Tratamento de Dados Pessoais

> Documento interno — LGPD art. 37 / ANPD
> Última atualização: 2026-06-16
> Responsável: DPO ToquePlay

## 1. Identificação do Controlador

| Campo | Valor |
|-------|-------|
| Razão social | _[PREENCHER]_ |
| CNPJ | _[PREENCHER]_ |
| Endereço | _[PREENCHER]_ |
| Encarregado (DPO) | _dpo@toqueplay.com_ |
| Canal do titular | App: `/dpo-contact` · API: `POST /me/dpo-contact` |

## 2. Operações de Tratamento

| # | Operação | Dado | Finalidade | Base legal (LGPD) | Coletado de | Retenção | Destinatários | Transferência internacional | Medidas de segurança |
|---|----------|------|------------|-------------------|-------------|----------|---------------|------------------------------|----------------------|
| 1 | Cadastro de conta | nome, email, senha (hash bcrypt cost 12), telefone opcional, avatar opcional | Execução de contrato de uso da plataforma | art. 7º, V (execução de contrato) | Titular (formulário) | Enquanto conta ativa + 5 anos para registros fiscais se admin/organizador | Interno · Stripe (somente email p/ cobrança) | EUA (Stripe) | bcrypt, TLS, audit log, SecureStore no app |
| 2 | Verificação de email | código 6 dígitos (crypto.randomInt), email | Prevenir fraude e contas falsas | art. 7º, V | Titular | 10 min após emissão | Interno | Não | TTL DB + Redis |
| 3 | Redefinição de senha | email, código 6 dígitos | Permitir recuperação de acesso | art. 7º, V | Titular | 15 min após solicitação | Interno | Não | Redis TTL |
| 4 | Login | email, senha, IP, User-Agent | Autenticar usuário | art. 7º, V | Titular | RefreshToken 7d · Access JWT 15min · AuditLog 24m | Interno | Não | Lockout progressivo, 2FA opcional |
| 5 | Login Google OAuth | token Google, email Google | Autenticação alternativa | art. 7º, V + consentimento | Titular → Google | Enquanto conta ativa | Google | EUA | OAuth2 verification, refresh rotation |
| 6 | Pagamento (Stripe) | email, valor, descrição torneio, ID inscrição | Processar pagamento | art. 7º, V | Titular → Stripe | 5 anos (obrigação fiscal) | Stripe | EUA | TLS, idempotência, webhook tolerance |
| 7 | Notificações push (FCM/APNs) | deviceToken, payload (título/corpo) | Notificar eventos relevantes (partida, inscrição) | art. 8º (consentimento granular) | Titular (opt-in) | DeviceToken 90 dias sem uso · Notification 180 dias | FCM (Google), APNs (Apple) | EUA (Google),variável (Apple) | TTL auto-purge, opt-out a qualquer momento |
| 8 | Localização para descoberta | latitude, longitude | Mostrar torneios próximos | art. 8º (consentimento granular) | Titular (opt-in) | Enquanto feature ativa · revogável | Interno | Não | Hash/rounding futuro · opt-out |
| 9 | Chat intra/inter time | mensagens texto, senderId | Comunicação entre membros/equipes | art. 7º, V | Titular | 2 anos (archive S3 Glacier → apagar DB) | Interno | Não | Moderação futura |
| 10 | Auditoria de eventos | ação, entityType, entityId, actorId, IP, User-Agent, oldValues/newValues | Trilha de segurança e LGPD compliance | art. 7º, II (cumprimento de obrigação legal) | Sistema (AuditInterceptor) | 24 meses | Interno · ANPD se solicitado | Não | Sanitização de secrets, masking de PII |
| 11 | Inscrição em torneio | userId, teamId, membros (CPF opcional em convidados), categoria | Confirmar participação | art. 7º, V | Titular | 5 anos (registro esportivo) | Interno · Stripe (financeiro) | EUA (Stripe) | Validação CPF, transação atômica |
| 12 | Estatísticas de atleta | userId, teamId, tournamentId, partidas/sets/pontos | Ranking e visão pública agregada | art. 7º, V | Sistema (computado de Match) | Indefinida enquanto relevantes · anonimizada após 5 anos | Público via perfil (mediante opt-in) | Não | Agregação, IDOR protegido |
| 13 | Logs de erro (Sentry) | stack trace, request body (PII scrubbed), user.email hash | Diagnóstico de bugs | art. 7º, V | Sistema | 90 dias | Sentry | EUA | `sendDefaultPii=false`, scrub headers Authorization/Cookie, hash email |
| 14 | DPO requests | email, subject, message, attachments ≤5MB | Exercício de direitos do titular | art. 18 | Titular | 5 anos (registro de compliance) | Interno · ANPD se reclamação | Não | Rate limited, auditado |
| 15 | Incidentes de segurança | tipo, severidade, usuários afetados, notas | Resposta a incidentes + notificação ANPD | art. 48 | Sistema / Admin | 5 anos | ANPD (se alto impacto) · afetados | Não | Workflow de escalonamento |

## 3. Direitos do Titular (art. 18)

A qualquer momento o titular pode exercer via app (`/dpo-contact`) ou endpoint público:

| Direito | Endpoint | Prazo interno |
|---------|----------|---------------|
| Confirmação de tratamento | `GET /me/data-summary` | Imediato |
| Acesso aos dados | `POST /me/export` (cooldown 24h) | Até 15 dias |
| Portabilidade | `POST /me/export` (JSON) | Até 15 dias |
| Correção | `PATCH /users/me` ou via DPO | Imediato |
| Anonimização / Eliminação | `DELETE /me/delete-account` | Imediato (registros financeiros retidos 5 anos art. 16 II) |
| Informação sobre compartilhamento | Política de Privacidade · RPO | Imediato |
| Revogação de consentimento | `PUT /me/consents` | Imediato |
| Reclamação à ANPD | Ação externa do titular | n/a |

## 4. Revisões

| Versão | Data | Mudança |
|--------|------|---------|
| v1 | 2026-06-16 | RPO inicial derivado do schema Prisma + fluxos identificados. |

## 5. Próximas revisões

- Adicionar archive ChatMessage S3 Glacier quando implementado (relacionado ao S2.10).
- Detalhar DPA com Stripe/Google/Sentry/FCM (item L.6 dos documentos legais).
- Validar com jurídica externa.
