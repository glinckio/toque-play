# DPA — Sentry

> **Parceiro**: Functional Software, Inc. (Sentry) · **País**: EUA.
> **DPA oficial**: https://sentry.io/legal/dpa/.

## Dados processados

- Stack traces, breadcrumbs, mensagens de erro.
- **Request data** (URL, método, headers — ToquePlay configurou `beforeSend` para **remover** `Authorization`, `Cookie`, `x-forwarded-for` e mascarar `password`/`code`/`refreshToken`).
- **User** (`id`, `email` → substituído por hash SHA-256 de 12 chars).
- Ambiente (Node.js version, OS, library versions).
- **Não** coleta: PII bruto quando `sendDefaultPii=false` (configuração ativa).

## Bases contratuais

- **Sentry Terms**: https://sentry.io/terms/.
- **Sentry Privacy**: https://sentry.io/privacy/.
- **DPA**: https://sentry.io/legal/dpa/ (auto-aplicável para contas Business/Enterprise).
- **SCCs**: Sentry adota SCCs para clientes fora dos EUA.

## Configuração recomendada

- **PII Scrubbing ativo** no `beforeSend` (configuração em `backend/src/main.ts`).
- **sendDefaultPii: false**.
- **Server-side rate limit**: máximo 100 eventos/seg para evitar custos.
- **Retention**: plano Free 30 dias, Business 90 dias. Configurar conforme plano.
- **Source maps**: opcional — só ativar quando necessário (expõe nomes de variáveis).
- **PII fields adicionais**: adicionar à lista no `beforeSend` conforme novas funcionalidades.

## Incidentes

Sentry notifica via email e dashboard. Sem SLA contratual específico.

## Subprocessadores

https://sentry.io/legal/subprocessors/ — AWS (hosting), etc.

## Retenção

Configurável por projeto. ToquePlay: 90 dias (plano Business default).

## Devolução/eliminação

A qualquer momento: deletar projeto via UI (irreversível após 30 dias).

## Pendências ToquePlay

- [ ] Confirmar plano Business vs Enterprise (impacto DPA).
- [ ] Considerar self-host Sentry (GlitchTip open source) para dados sensíveis (custo vs compliance).
- [ ] Documentar periodicidade de revisão do `beforeSend` (mensal).
