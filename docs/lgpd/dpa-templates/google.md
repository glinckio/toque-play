# DPA — Google (OAuth + Firebase)

> **Parceiros**: Google LLC (OAuth), Google Ireland / Firebase (FCM).
> **DPA oficial**: https://workspace.google.com/terms/dpa_terms.html (Google Workspace) · https://firebase.google.com/terms/data-processing-terms (Firebase).

## Dados processados

### OAuth (Google Sign-In)
- Token OAuth 2.0 trocado pelo backend.
- Campos do profile Google: `sub`, `email`, `email_verified`, `name`, `picture`.
- Armazenados na ToquePlay: `googleId`, `email`, `name`, `avatarUrl`.

### Firebase Cloud Messaging (Push Notifications)
- **DeviceToken** por usuário/plataforma (FCM token).
- Payload de notificação: `title`, `body`, `type`, `referenceId`.

Google **não** recebe: senha, telefone, CPF, dados de pagamento.

## Bases contratuais

- **Google APIs Terms of Service**: https://developers.google.com/terms.
- **Google Privacy Policy**: https://policies.google.com/privacy.
- **Firebase Terms**: https://firebase.google.com/terms.
- **Data Processing Amendment (DPA)**: auto-aplicável para clientes pagantes do Google Cloud / Workspace.
- **SCCs**: Google aderiu aos SCCs da Comissão Europeia — válido para LGPD por analogia.

## Configuração recomendada

- OAuth: restringir `client_id` da ToquePlay a domínios confiáveis.
- Firebase: desabilitar Analytics se não utilizado (minimização).
- Firebase: configurar **data residency** = `us-central1` (padrão) ou `southamerica-east1` (Brasil) se disponível.
- Auditar monthlymente o `OAuth consent screen` — apps em status "Testing" limitam a 100 usuários.
- Para OAuth prod: submeter app para **verification** do Google (processo demorado, $15k-75k auditoria).

## Incidentes

Google notifica incidentes materialmente relevantes pelo admin console e email. Sem prazo específico — recomendado tratar como CRÍTICO até prova em contrário.

## Subprocessadores

Lista: https://privacy.google.com/businesses/subprocessors/.

## Retenção

- OAuth: tokens têm TTL definido pelo Google (1h access, sem refresh se optou por "ephemeral").
- Firebase: device tokens persistem enquanto o app estiver ativo. ToquePlay purga tokens >90 dias sem uso.

## Devolução/eliminação

OAuth: desligar Google Sign-In no consent screen + desativar client_id.
Firebase: deletar projeto via console (irreversível, 30 dias soft delete).

## Pendências ToquePlay

- [ ] Verificar necessidade de app verification do Google para escala.
- [ ] Considerar migrar para **Firebase Cloud Messaging BR (southamerica-east1)** quando disponível.
