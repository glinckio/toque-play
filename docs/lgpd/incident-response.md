# Procedimento de Resposta a Incidentes de Segurança

> **Versão**: v1.0 · **Data**: 2026-06-16
> Conforme **LGPD art. 48** e **Resolução CD/ANPD nº 15/2024**.

Este documento descreve o fluxo completo de resposta a incidentes que envolvam dados pessoais na ToquePlay.

---

## 1. Definições

**Incidente de segurança** é qualquer evento adverso, confirmado ou suspeito, que possa resultar em:
- Acesso não autorizado a dados pessoais.
- Perda, alteração ou destruição não autorizada.
- Vazamento (disclosure) para terceiros.
- Indisponibilidade significativa do serviço que afete dados.

**Severidade**:

| Nível | Critério | Exemplos |
|-------|----------|----------|
| **CRÍTICA** | Vazamento confirmado de >1000 registros OU PII sensível (CPF, financeiro) | Dump do DB extraído, credenciais admin vazadas |
| **ALTA** | Vazamento confirmado de <1000 registros OU acesso não autorizado a PII | IDOR explorado, token admin comprometido |
| **MÉDIA** | Vulnerabilidade explorável sem evidência de exploração ativa | CVE crítico sem patch, config errada exposta |
| **BAIXA** | Tentativa sem sucesso ou impacto mínimo | Scan automatizado bloqueado por rate limit |

---

## 2. Fluxo de resposta

```
DETECÇÃO → TRIAGEM → CONTENÇÃO → ERRADICAÇÃO → RECUPERAÇÃO → NOTIFICAÇÃO → PÓS-INCIDENTE
```

### 2.1 Detecção (até 1h)
Fontes:
- **Sentry** (alertas automáticos de erro 5xx ou erro crítico).
- **Logs de auditoria** (`AuditLog` com padrões anômalos — ex.: export de PII em massa).
- **Monitoramento** (Bull Board, Prometheus se aplicável).
- **Denúncia interna/externa** (whitehat, usuário, parceiro).

### 2.2 Triagem (até 4h)
Responsável: **DPO + Tech Lead**.
- Confirmar ou descartar o incidente.
- Classificar severidade (CRÍTICA/ALTA/MÉDIA/BAIXA).
- Identificar dados afetados, volume, período temporal.
- Registrar em `SecurityIncident` (`POST /admin/privacy/security-incident`).
- Acionar CISO/comitê de crise se CRÍTICA.

### 2.3 Contenção (até 8h)
Ações imediatas conforme cenário:
- **Credencial comprometida**: revogar todos os refresh tokens do usuário (`prisma.refreshToken.deleteMany`) + resetar 2FA + forçar redefinição de senha.
- **Token admin comprometido**: rotacionar `JWT_SECRET` e `JWT_REFRESH_SECRET` (invalida todas as sessões).
- **Banco comprometido**: isolar instância, snapshot para análise forense, rotacionar credenciais de DB.
- **Vulnerabilidade em produção**: aplicar hotfix ou desabilitar endpoint (deploy feature flag ou rollback).
- **Ataque em andamento**: ativar rate limit restritivo ou geofencing temporário.

### 2.4 Erradicação (até 24h)
- Aplicar correção definitiva (patch, fix, config).
- Rotação de todas as chaves potencialmente expostas (JWT, Stripe webhook, Sentry DSN, Firebase service account, MinIO credentials).
- Auditoria completa: comparar estado atual vs. estado pré-incidente.
- Verificação de integridade dos dados (checksum, timestamps suspeitos).

### 2.5 Recuperação (até 72h)
- Restauração de backups se necessário (RPO definido por tipo de dado).
- Monitoramento intensivo por 7 dias (logs, alertas Sentry, anomaly detection).
- Testes de regressão do fix em staging antes de reabrir funcionalidades suspensas.

### 2.6 Notificação

#### À ANPD
**Prazo**: 2 dias úteis a partir da constatação do incidente (Res. CD/ANPD 15/2024).
**Condição**: incidente que **possa acarretar risco ou dano relevante** aos titulares (CRÍTICA/ALTA).

**Conteúdo mínimo** (Resolução 15/2024, art. 3º):
1. Descrição da natureza dos dados pessoais afetados.
2. Informação sobre titulares afetados (grupos, número estimado, registro anonimizado).
3. Descrição das consequências (potencialmente) geradas.
4. Medidas de segurança adotadas (imediatas e de médio prazo).
5. Razões pelas quais o incidente possa acarretar risco ou dano relevante.
6. Tratamento dado aos dados após o incidente.
7. Identificação do encarregado (DPO) e canal de comunicação.
8. Se o controlador for operador (ToquePlay para terceiros), identificação do controlador.

**Canal**: https://www.gov.br/anpd/pt-br/documentos/seguranca-dos-dados.

#### Aos titulares afetados
**Prazo**: 3 dias úteis (Res. 15/2024, art. 4º).
**Conteúdo**: claro e em linguagem acessível — natureza do incidente, dados afetados, medidas tomadas, riscos potenciais, recomendações (mudar senha, monitorar cartão, etc.), canal de contato DPO.

**Canais**: email direto (se aplicável), notificação in-app, banner na home do app.

### 2.7 Pós-incidente (até 30 dias)
- **Post-mortem** escrito com timeline, causa raiz, impacto, ações corretivas, lições aprendidas.
- Atualização do RPO se base legal ou fluxo mudou.
- Treinamento da equipe (ver `training.md`).
- Atualização de controles técnicos (rate limit, monitoramento, etc.).

---

## 3. Responsabilidades

| Papel | Responsável | Ação |
|-------|-------------|------|
| DPO | dpo@toqueplay.com | Triagem, notificação ANPD, comunicação titular, registro em `SecurityIncident` |
| Tech Lead | _[nome]_ | Contenção técnica, erradicação, recuperação |
| CISO / Comitê | _[nome]_ (se CRÍTICA) | Decisão de comunicação pública, acionamento jurídico externo |
| Jurídico | _[advogado externo]_ | Revisão de notificação ANPD, defesa em eventual processo |
| Comunicação | _[nome]_ | Press release (se CRÍTICA com exposição midiática) |

---

## 4. Templates

### 4.1 Notificação ANPD (modelo)

> À ANPD — Autoridade Nacional de Proteção de Dados
>
> **Notificação de Incidente de Segurança** (Resolução CD/ANPD nº 15/2024)
>
> 1. Controlador: _[RAZÃO SOCIAL]_ · CNPJ _[...]_
> 2. Encarregado (DPO): dpo@toqueplay.com · _[tel]_
> 3. Data e hora da constatação: _[AAAA-MM-DD HH:MM BRT]_
> 4. Data e hora estimadas do início: _[...]_
> 5. Natureza do incidente: _[vazamento / acesso indevido / indisponibilidade / perda]_
> 6. Dados afetados: _[lista — nome, email, CPF, financeiros, etc.]_
> 7. Titulares afetados: _[número estimado + grupos]_
> 8. Consequências potenciais: _[...]_
> 9. Medidas imediatas adotadas: _[...]_
> 10. Medidas de médio prazo: _[...]_
> 11. Tratamento dado aos dados após o incidente: _[...]_
> 12. Canal de contato para titulares: dpo@toqueplay.com · App "Falar com o DPO"

### 4.2 Email ao titular (modelo)

> **Assunto**: Aviso importante sobre seus dados na ToquePlay
>
> Olá, _[nome]_,
>
> Identificamos um incidente de segurança em _[data]_ que pode ter exposto os seguintes dados de sua conta:
>
> _[lista específica — ex.: nome, email, telefone]_
>
> **O que fizemos**: _[ações — revogação de sessões, correção da vulnerabilidade, etc.]_
>
> **O que recomendamos**:
> - Altere sua senha em **Privacidade e consentimentos → Redefinir senha**.
> - Ative a autenticação em 2 fatores (se aplicável).
> - Fique atento a tentativas de phishing que usem seu email.
>
> Para dúvidas, responda este email ou acesse "Falar com o DPO" no app.
>
> Atenciosamente,
> DPO · ToquePlay

---

## 5. Métricas e melhoria contínua

- **MTTD** (Mean Time To Detect): alvo < 4h.
- **MTTR** (Mean Time To Resolve): alvo < 72h para ALTA, < 24h para CRÍTICA.
- **% notificações ANPD dentro do prazo**: alvo 100%.
- Avaliação trimestral do runbook após cada incidente real ou simulado (tabletop exercise).

---

## 6. Tabletop exercises

Realizar **1x por semestre** simulação de incidente com a equipe completa (DPO, Tech Lead, Jurídico, Comunicação). Cenários sugeridos:

1. Vazamento do banco de dados via SQL injection em endpoint público.
2. Ataque de credential stuffing que escapa ao rate limit.
3. Funcionário demitido com acesso residual.
4. Parceiro (Stripe) reporta incidente no lado deles que afeta ToquePlay.
5. Vulnerabilidade crítica em biblioteca de dependência (ex.: `lodash`, `axios`).

Documentar aprendizados em `docs/lgpd/incident-postmortem-<date>.md`.

---

## 7. Atualizações

| Versão | Data | Mudança |
|--------|------|---------|
| v1.0 | 2026-06-16 | Versão inicial conforme Res. CD/ANPD 15/2024. |
