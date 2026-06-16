# DPA Templates — Contratos de Processamento de Dados

> **Versão**: v1.0 · **Data**: 2026-06-16
> Modelos para contratos de processador (Data Processing Agreement) com terceiros.
> Revisão jurídica externa obrigatória antes de assinatura.

A LGPD (art. 39) exige que o controlador verifique a regularidade do operador e exija contrato que regule as condições de tratamento. Para transferências internacionais, o DPA deve incluir **Cláusulas Contratuais Padrão (SCCs)** ou base equivalente (art. 33).

Este diretório contém **templates** (não documentos legais assináveis) para:

- [`stripe.md`](./stripe.md) — Stripe (pagamentos).
- [`google.md`](./google.md) — Google OAuth + Firebase.
- [`sentry.md`](./sentry.md) — Sentry (error tracking).
- [`aws-minio.md`](./aws-minio.md) — Storage (S3/MinIO).
- [`push-providers.md`](./push-providers.md) — FCM / APNs.

## Estrutura comum a todos os DPA

Todo DPA deve conter, no mínimo:

1. **Objeto** — processamento descrito (finalidade, duração, natureza, finalidade do processamento, tipos de dados pessoais, categorias de titulares).
2. **Lista de instruções do controlador** — processador só age conforme documentado.
3. **Confidencialidade** — pessoal do processador sob NDA.
4. **Medidas de segurança** (art. 46) — técnicas e organizacionais adotadas.
5. **Subprocessadores** — somente com consentimento prévio do controlador, com mesmas obrigações.
6. **Assistência ao controlador** — para responder a titulares e à ANPD.
7. **Notificação de incidentes** — prazo (recomendado 72h), conteúdo mínimo.
8. **Auditoria** — direito do controlador de verificar conformidade.
9. **Transferência internacional** — base do art. 33 (SCC, adequação, consentimento).
10. **Devolução/eliminação** ao término do contrato.
11. **Foro** — Brasil (preferencial).

## Como usar

1. **Coletar o DPA oficial** oferecido pelo parceiro (todos abaixo têm templates públicos).
2. **Comparar** com o template ToquePlay abaixo deste diretório — identificar cláusulas divergentes.
3. **Negociar** divergências críticas (especialmente prazos de notificação de incidente, localização de dados, subprocessadores).
4. **Assinar** e arquivar cópia em local seguro (sugerido: 1Password / cofre do jurídico).
5. **Registrar** no RPO (item correspondente em `rpo.md`).
