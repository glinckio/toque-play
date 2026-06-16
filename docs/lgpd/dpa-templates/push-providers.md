# DPA — Push Providers (FCM / APNs)

> **Parceiros**: Firebase Cloud Messaging (Google, EUA) e Apple Push Notification service (Apple, EUA).
> **DPA oficial Firebase**: coberto por `google.md`.
> **DPA APNs**: coberto pelo Apple Developer Agreement.

## Dados processados

### FCM (Android)
- **DeviceToken** (registro do dispositivo com FCM).
- **Payload**: title, body, type, referenceId, sound, badge.
- **Dados opcionais**: data fields (chave-valor customizados).

### APNs (iOS)
- **DeviceToken** (registro com APNs).
- **Payload**:aps.alert.title, aps.alert.body, etc.

Providers **não** recebem: PII bruto no payload (apenas IDs de referência, ex.: `tournamentId`).

## Bases contratuais

### FCM
- Firebase Terms: https://firebase.google.com/terms.
- Privacy: https://firebase.google.com/support/privacy.
- DPA: ver `google.md`.

### APNs
- Apple Developer Agreement: https://developer.apple.com/terms/.
- Apple Privacy: https://www.apple.com/legal/privacy/.
- DPA: Apple mantém addendum para empresas com Apple Developer Enterprise.

## Configuração recomendada

- **Opt-in granular**: push somente se usuário consentiu (`UserConsent` purpose `NOTIFICATIONS_PUSH`).
- **Respeitar preferências**: checar `notificationPreferences` antes de enviar (`NotificationService.shouldNotify`).
- **Não logar PII no payload**: logs do Firebase Console podem reter dados; usar IDs opacos.
- **TTL curto** para notificações temporais (ex.: "partida começou"): 1h. Evita entrega tardia.
- **Tópicos**: usar `topic` para broadcast (ex.: `tournament.<id>`) em vez de lista de tokens quando possível.
- **Rate limit**: FCM permite 240 msg/min por device; ToquePlay respeita.

## Incidentes

- FCM: notifica via Firebase Console + email do admin.
- APNs: raramente notifica incidentes — monitorar status page https://developer.apple.com/system-status/.

## Subprocessadores

- FCM: coberto por `google.md`.
- APNs: Apple mantém subprocessadores mínimos (data centers próprios).

## Retenção

- DeviceTokens: ToquePlay purga tokens >90 dias sem uso.
- Firebase Messaging: até 30 dias de logs de entrega (configurável).

## Devolução/eliminação

- FCM: deletar projeto Firebase (irreversível).
- APNs: revogar certificates/keys no Apple Developer Portal.

## Pendências ToquePlay

- [ ] Implementar **opt-out granular** de push no app (atualmente todas as categorias respeitam `notificationPreferences`).
- [ ] Avaliar迁移 do FCM para **AWS SNS** se houver consolidação de provedores cloud.
- [ ] Documentar política interna: nunca enviar PII em payload, mesmo para debugging.
