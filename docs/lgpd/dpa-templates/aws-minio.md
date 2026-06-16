# DPA — Storage (AWS S3 / MinIO)

> **Opções**: AWS S3 (provedor gerenciado, ~R$ 0,10/GB-mês) ou MinIO self-hosted.
> **DPA oficial AWS**: https://aws.amazon.com/agreement/anna-addendum/.
> **MinIO**: software livre — ToquePlay é o próprio operador.

## Dados processados

- **Avatares** de usuários (`users/<id>/avatar-<ts>.{png,jpg,webp}`).
- **Capas** de torneios (`tournaments/<id>/cover-<ts>.{png,jpg,webp}`).
- **Brasões** de times (`teams/<id>/avatar-<ts>.{png,jpg,webp}`).
- **Banners padrão** pré-existentes (`banners/...`).
- **Backup do banco** (se snapshot automático do provedor habilitado).

Storage **não** recebe: dados estruturados de PII (CPF, telefone, senha).

## Bases contratuais (AWS)

- **AWS Customer Agreement**: https://aws.amazon.com/agreement/.
- **AWS Privacy**: https://aws.amazon.com/privacy/.
- **AWS DPA (LGPD)**: AWS oferece addendum LGPD via AWS Artifact.
- **SCCs**: AWS fornece SCCs baixáveis pelo Artifact.

## Bases contratuais (MinIO self-host)

MinIO é software livre (AGPLv3). ToquePlay opera como **próprio controlador** dos dados hospedados — não há DPA com terceiro.

Recomendação: hospedar MinIO em VPC privada, com TLS obrigatório, bucket privado (sem policy pública), URLs assinadas para acesso.

## Configuração recomendada

### AWS S3
- **Região**: preferir `sa-east-1` (São Paulo) para minimizar transferência internacional.
- **Encryption**: SSE-S3 (AES-256) por padrão em todos os buckets.
- **Bucket policy**: negar upload sem HTTPS, negar ACL pública.
- **Lifecycle**: transitar para Glacier após 90 dias, expirar após 2 anos (configurável por bucket).
- **Access logs**: habilitar S3 server access logs para auditoria.
- **Bucket names**: sem PII (`toqueplay-avatars`, nunca `cpf-...`).

### MinIO
- Bucket **privado** (sem policy pública) — atualmente ToquePlay tem policy pública de GetObject; revisar.
- Credenciais via env, nunca commitadas.
- TLS obrigatório (`MINIO_USE_SSL=true` em prod).
- Backup: rsync para outra região ou Glacier via lifecycle.

## Incidentes

- AWS: notifica via Health Dashboard + email do root account.
- MinIO: depende de monitoramento próprio (Sentry não cobre infra).

## Subprocessadores AWS

https://aws.amazon.com/compliance/sub-processors/.

## Retenção

- Avatares/capas: enquanto conta ativa. Em `DELETE /me/delete-account`, deletar avatar (`storage.deleteFile`).
- Backups: 30 dias (snapshot automático) — configurar lifecycle.

## Devolução/eliminação

- AWS: `aws s3 rm --recursive` no bucket + deleção do bucket.
- MinIO: `mc rm --recursive` ou `storage.deleteFile` por arquivo.

## Pendências ToquePlay

- [ ] **Decisão AWS vs MinIO para produção** (impacto orçamento + compliance + DevOps).
- [ ] Se AWS: ativar SSE-KMS ao invés de SSE-S3 (chaves próprias).
- [ ] MinIO: **remover policy pública** de GetObject — usar URLs assinadas.
- [ ] Lifecycle: configurar regras no bucket (avatares orfãos após user delete → 30d → expire).
