# Política de Privacidade

> **Versão**: v1.0 · **Data**: 2026-06-16
> Aplicável conforme `TERMS_VERSION=v1` no backend. Mudanças de versão exigem re-consentimento.

A ToquePlay ("nós", "nossa", "Controladora") respeita a privacidade dos usuários ("titulares") e está comprometida em proteger seus dados pessoais em conformidade com a **Lei nº 13.709/2018 (LGPD)**.

---

## 1. Quem somos

| Campo | Valor |
|-------|-------|
| Controlador | _[RAZÃO SOCIAL — preencher]_ |
| CNPJ | _[XX.XXX.XXX/0001-XX — preencher]_ |
| Endereço | _[preencher]_ |
| Encarregado de Dados (DPO) | dpo@toqueplay.com |
| Canal de comunicação | App: tela "Fale com o DPO" · API: `POST /me/dpo-contact` |

---

## 2. Dados pessoais coletados

Coletamos os seguintes dados, sempre que você fornecê-los ou consentir:

| Categoria | Dados |
|-----------|-------|
| Identificação | Nome completo, email, telefone (opcional) |
| Acesso | Senha (armazenada como hash bcrypt cost 12 — nunca em texto plano), foto de avatar (opcional) |
| Localização | Latitude/longitude (opt-in, somente se você ativar a funcionalidade "torneios próximos") |
| Financeiros | Dados de pagamento processados diretamente pela Stripe (não armazenamos número de cartão) |
| Uso | Endereço IP, User-Agent, eventos do sistema (logs de auditoria — ação, data/hora, recurso afetado) |
| Esportivos | CPF de membros convidados (quando aplicável), posição em quadra, estatísticas agregadas |
| Comunicação | Mensagens trocadas no chat intra-time e inter-time |

---

## 3. Finalidades e bases legais

Tratamos seus dados conforme as finalidades e bases legais previstas na LGPD:

| Finalidade | Base legal (LGPD) |
|------------|-------------------|
| Execução de contrato de uso da plataforma | art. 7º, V |
| Cadastro, autenticação, login (inclusive Google OAuth) | art. 7º, V |
| Processamento de pagamentos via Stripe | art. 7º, V (execução de contrato) |
| Cumprimento de obrigação legal (registros fiscais 5 anos) | art. 7º, II |
| Exercício regular de direitos (auditoria, segurança) | art. 7º, VI |
| Notificações push sobre jogos e torneios | art. 8º (consentimento — opt-in granular) |
| Descoberta de torneios por geolocalização | art. 8º (consentimento — opt-in granular) |
| Emails promocionais e marketing | art. 8º (consentimento — opt-in granular, default off) |
| Estatísticas públicas de atleta no perfil | art. 7º, V ou art. 11 (legítimo interesse) |
| Diagnóstico de erros (Sentry) | art. 7º, V (legítimo interesse) |

Você pode revogar consentimentos a qualquer momento em **Privacidade e consentimentos** no app ou via `PUT /me/consents`.

---

## 4. Compartilhamento de dados

Compartilhamos dados somente com os seguintes parceiros, para as finalidades indicadas:

| Parceiro | Dados compartilhados | Finalidade | Localização |
|----------|---------------------|------------|-------------|
| **Stripe** | email, valor, descrição do torneio, ID da inscrição | Processamento de pagamentos | EUA |
| **Google** | token OAuth, email Google | Login alternativo (Google Sign-In) | EUA |
| **AWS / MinIO** | avatares, capas de torneio | Armazenamento de arquivos | Variável (configurar região) |
| **Sentry** | stack traces, request scrubbed (sem Authorization/Cookie; email hash) | Diagnóstico de erros | EUA |
| **Firebase Cloud Messaging (Google)** | deviceToken, payload da notificação | Push notifications (somente se opt-in) | EUA |
| **Apple Push Notification service** | deviceToken, payload da notificação | Push notifications iOS (somente se opt-in) | Variável |
| **ANPD** | dados solicitados em investigação | Cumprimento de obrigação legal | Brasil |

Não vendemos seus dados. Não compartilhamos com fins publicitários de terceiros.

---

## 5. Transferência internacional (art. 33 LGPD)

As transferências para EUA listadas acima ocorrem sob uma das hipóteses do art. 33:

- **Standard Contractual Clauses (SCCs)** firmadas com Stripe, Google, Sentry.
- **Consentimento específico** para Firebase Cloud Messaging / APNs (manifestado no consentimento granular de push).
- **Decisão de adequação** eventualmente emitida pela ANPD para o destinatário.

Os contratos DPA completos estão disponíveis mediante solicitação ao DPO.

---

## 6. Retenção

| Categoria | Período | Destino pós retenção |
|-----------|---------|---------------------|
| Conta ativa | Enquanto ativa | Anonimização em exclusão (`DELETE /me/delete-account`) |
| Refresh tokens | 7 dias | Auto-purge Redis + DB |
| Código de verificação de email | 10 min | DB TTL |
| Código de reset de senha | 15 min | Redis TTL |
| Notificações | 180 dias | Auto-purge (cron diário) |
| DeviceTokens (push) | 90 dias sem uso | Auto-purge |
| Mensagens de chat | 2 anos | Archive S3 Glacier → apagar DB |
| Logs de auditoria | 24 meses | Auto-purge (cron mensal) |
| Eventos de partida (PointEvent, MatchEvent) | 5 anos | Archive Glacier → apagar DB |
| Registros financeiros / fiscais | 5 anos | Exclusão (obrigação legal CDC/fiscal) |
| Solicitações DPO | 5 anos | Exclusão (registro de compliance) |
| Incidentes de segurança | 5 anos | Exclusão |

Política operacionalizada por `PrivacyRetentionCron` no backend.

---

## 7. Direitos do titular (art. 18 LGPD)

Você pode exercer, a qualquer momento, os seguintes direitos:

| Direito | Como exercer |
|---------|--------------|
| **Confirmação** da existência de tratamento | `GET /me/data-summary` |
| **Acesso** aos seus dados | `POST /me/export` (cooldown 24h) |
| **Correção** de dados incompletos/inexatos | `PATCH /users/me` ou via DPO |
| **Anonimização / Eliminação** | `DELETE /me/delete-account` |
| **Portabilidade** dos dados | `POST /me/export` (formato JSON) |
| **Eliminação** dos dados pessoais desnecessários | `DELETE /me/delete-account` |
| **Informação** sobre compartilhamento | Esta Política, §4 |
| **Revogação** do consentimento | `PUT /me/consents` ou "Privacidade e consentimentos" no app |
| **Reclamação** à ANPD | https://www.gov.br/anpd |

**Prazos de resposta**:
- Acesso/exportação: até **15 dias** corridos.
- Correção: imediato quando via app/API.
- Eliminação: imediato (anonimização), com retenção legal de 5 anos para registros fiscais (art. 16, II).

Solicitações fora do app podem ser feitas pelo canal do DPO (`POST /me/dpo-contact` ou email).

---

## 8. Segurança dos dados (art. 46)

Adotamos medidas técnicas e organizacionais:

- **Criptografia em trânsito**: TLS 1.2+ obrigatório (HSTS preload, 2 anos).
- **Criptografia em repouso**: discos do banco de dados gerenciado com criptografia.
- **Senhas**: bcrypt cost 12.
- **Tokens JWT**: access 15min + refresh rotacionado a cada uso + blacklist Redis em logout.
- **Lockout progressivo** após 5/10/15 falhas de login.
- **2FA TOTP** opcional para admins.
- **Magic bytes** em uploads de imagem (anti-mimetype spoofing).
- **Sentry com PII scrubbing** (`sendDefaultPii=false`, hash de email, remoção de headers sensíveis).
- **Auditoria** completa de mutações (`AuditLog`) e acessos a PII pelo admin (`AuditRead`).
- **CSP/HSTS** no web admin, Helmet no backend, proxy whitelist.
- **Treinamento** interno da equipe em minimização e resposta a incidentes (ver `training.md`).
- **Mascaramento** de PII em exports CSV administrativos.

---

## 9. Cookies e storage local

A plataforma web admin usa 3 cookies **todos httpOnly** (não acessíveis via JavaScript):

- `tp_access` — token JWT de acesso (15 min).
- `tp_refresh` — refresh token (7 dias).
- `tp_user` — JSON mínimo do usuário logado (id, nome, email, role).

O app móvel armazena tokens em **Keychain (iOS) / Android Keystore** via `expo-secure-store`.

Detalhes em `cookies-policy.md`.

---

## 10. Atualizações e versão

Esta Política pode ser atualizada para refletir mudanças legais, técnicas ou operacionais. Cada versão recebe um identificador semântico (`vMAJOR.MINOR`).

- Mudanças **minor** (ex.: v1.0 → v1.1): comunicadas por email e in-app.
- Mudanças **major** (ex.: v1 → v2) ou que incluam nova finalidade de tratamento: **exigem re-consentimento** no próximo login.

| Versão | Data | Mudança |
|--------|------|---------|
| v1.0 | 2026-06-16 | Versão inicial. |

---

## Contato

Para dúvidas, exercício de direitos ou reclamações:

- App: tela **Privacidade e consentimentos → Falar com o DPO**.
- Email: **dpo@toqueplay.com**.
- ANPD: https://www.gov.br/anpd.
