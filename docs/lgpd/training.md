# Treinamento Interno LGPD e Segurança

> **Versão**: v1.0 · **Data**: 2026-06-16
> **Público**: toda a equipe ToquePlay (devs, ops, suporte, jurídico, gestão).
> **Periodicidade**: admissão + anual + após incidentes relevantes.

---

## Objetivos

Ao concluir este treinamento, a equipe deve ser capaz de:

1. Identificar dados pessoais e dados pessoais sensíveis no dia a dia.
2. Aplicar princípios da LGPD (minimização, finalidade, transparência) em decisões de produto.
3. Seguir boas práticas de higiene de senhas, segredos e acessos.
4. Reconhecer tentativas de phishing e engenharia social.
5. Acionar o fluxo de resposta a incidentes conforme `incident-response.md`.

---

## Módulo 1 — Fundamentos da LGPD (30 min)

### 1.1 Conceitos

- **Dado pessoal**: qualquer informação relacionada a pessoa natural identificada ou identificável (art. 5º, I).
- **Dado sensível**: origem racial, convicção religiosa, saúde, biometria (art. 5º, II). **Requer cuidado extra**.
- **Titular, Controlador, Operador, Encarregado**.
- **Finalidade, adequação, necessidade, livre acesso, qualidade, transparência, segurança, prevenção, não-discriminação, responsabilização** (princípios art. 6º).

### 1.2 Bases legais

| Base legal | Quando usar |
|------------|-------------|
| art. 7º, I — consentimento | Quase nunca default; exigido para marketing, push, localização |
| art. 7º, II — obrigação legal | Registros fiscais, ordem judicial |
| art. 7º, IV — legítimo interesse | Cuidado: balanceamento necessário |
| art. 7º, V — execução de contrato | Cadastro, login, pagamento |
| art. 7º, VI — exercício regular de direitos | Auditoria, segurança |
| art. 8º — dados sensíveis | Exige consentimento específico |
| art. 10/11 — dados públicos | Pode tratar, com restrições |

### 1.3 Direitos do titular (art. 18)

Confirmação, acesso, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamento, revogação de consentimento. Prazo de resposta: **15 dias**.

**Como exercer na ToquePlay**: telas no app (`/me/export`, `/me/delete-account`, `/me/dpo-contact`), endpoints REST documentados no Swagger.

---

## Módulo 2 — Privacy by Design no desenvolvimento (45 min)

### 2.1 Checklist antes de cada PR

Usar o checklist em `CONTRIBUTING.md` → "LGPD — Privacy by Design Checklist". Reforço dos pontos mais comuns:

- **Minimização**: por que preciso deste campo? Posso eliminar?
- **Select no Prisma**: nunca `findFirst()` sem `select` para retornar usuário. Listar campos explicitamente.
- **Logs**: nunca `console.log(password, code, refreshToken, paymentId)`. Logs de produção passam por `AuditInterceptor` que sanitiza.
- **Sentry**: configurar `beforeSend` se adicionar campos novos sensíveis.
- **Testes**: dados de teste NUNCA devem ser dados reais de pessoas. Usar `faker` ou nomes fictícios.

### 2.2 Erros comuns

- ❌ Retornar `user` completo no `getUser(id)` (vaza senha hash, preferências, etc.).
  ✅ `select: { id, name, email, role, status }`.
- ❌ Salvar CPF em texto plano.
  ✅ Se necessário, criptografar com AES-256-GCM (chave em KMS).
- ❌ Enviar PII em payload de push.
  ✅ Enviar apenas `referenceId`, o app busca detalhes.
- ❌ Logar `req.body` inteiro em filtro de exceção.
  ✅ Logar `req.body` sanitizado (sem campos de senha/código).
- ❌ Permitir `@Public()` em endpoint que lê dados.
  ✅ Sempre `@UseGuards(JwtAuthGuard)` + `@Roles()`.

---

## Módulo 3 — Higiene de credenciais e segredos (30 min)

### 3.1 Senhas pessoais

- Usar **gerenciador de senhas** (1Password, Bitwarden).
- Senhas únicas por serviço. Nunca reutilizar.
- 2FA em TODOS os serviços que suportam (GitHub, Stripe, AWS, Sentry, Google).
- Frase-senha para o cofre: ≥ 4 palavras aleatórias.

### 3.2 Segredos da aplicação

- **Nunca commitar** `.env`. `.gitignore` cobre.
- **Rotação**: JWT_SECRET/JWT_REFRESH_SECRET a cada 6 meses ou após incidente suspeito.
- **Stripe webhook secret**: rotacionar no dashboard se houver mudança de endpoint.
- **Firebase service account**: rotacionar a cada 12 meses.
- **AWS access keys**: usar IAM Roles em vez de access keys quando possível.

### 3.3 Acessos

- **Princípio do menor privilégio**: dev não tem acesso a prod DB.
- **MFA** obrigatório para acessos a sistemas prod (GitHub, AWS Console, Stripe Dashboard).
- **SSO** quando possível (Google Workspace).
- **Revisão trimestral** de usuários com privilégios (admin, SUPER_ADMIN role).

---

## Módulo 4 — Phishing e engenharia social (30 min)

### 4.1 Sinais de alerta

- Urgência ("sua conta será suspensa em 24h").
- Remetente parecido mas não idêntico (`suporte@toquepl4y.com`).
- Links que pedem credenciais (hover antes de clicar).
- Anexos inesperados, especialmente `.exe`, `.zip`, `.docm`.
- Solicitação de transferência financeira por email/WhatsApp.

### 4.2 O que fazer

1. **Não clicar** em links nem baixar anexos.
2. Reportar ao time de segurança (`security@toqueplay.com` ou canal Slack #security).
3. Em caso de clique acidental: **desconectar da rede** + contatar TI imediatamente.
4. Verificar se credenciais foram expostas em https://haveibeenpwned.com/.

### 4.3 Engenharia social por telefone

- ToquePlay **nunca** pede senha, 2FA ou acesso remoto por telefone.
- "Sou do TI da ToquePlay" sem caller ID verificado → desligar e reportar.
- Fornecedores pedindo acesso urgente: validar com o gerente do contrato.

### 4.4 Simulações

A ToquePlay realizará **1 simulação de phishing por trimestre** (KnowBe4 ou similar). Cliques são tratados como oportunidade de treinamento, não punição.

---

## Módulo 5 — Resposta a incidentes (45 min)

### 5.1 Quando acionar

Suspeita de:
- Acesso não autorizado a dados ou sistemas.
- Vazamento de credenciais.
- Malware em equipamento corporativo.
- Vulnerabilidade crítica reportada externamente.

### 5.2 Quem acionar

- **Primeira pessoa a notar**: DPO (`dpo@toqueplay.com` · app "Falar com o DPO" · urgente via Slack `#incident-response`).
- Em horário não-útil: telefone do plantão (registro em 1Password).

### 5.3 O que NÃO fazer

- ❌ Tentar investigar sozinho e "consertar" sem documentar.
- ❌ Comunicar externamente (imprensa, clientes) antes do DPO autorizar.
- ❌ Deletar evidências (logs, arquivos) — podem ser necessárias para perícia.
- ❌ Discutir o incidente em canais públicos (Slack não-confidenciais, redes sociais).

### 5.4 O que fazer

- ✅ Anotar timeline (o quê, quando, quem descobriu).
- ✅ Preservar evidências (screenshots, logs copiados para local seguro).
- ✅ Seguir o runbook em `docs/lgpd/incident-response.md`.

### 5.5 Tabletop exercise

1x por semestre: simulação completa. Cenários em `incident-response.md` §6. Participação obrigatória para DPO, Tech Lead, Jurídico, Comunicação.

---

## Módulo 6 — Específico por função

### 6.1 Desenvolvedores
- Revisar PRs quanto ao checklist LGPD.
- Auditoria: confirmar `@Audit`/`@AuditRead` em endpoints sensíveis.
- Não desabilitar Helmet, ValidationPipe, rate limit sem revisão do DPO.
- Source maps: nunca commitar maps de produção.

### 6.2 Suporte ao cliente
- **Nunca** solicitar senha por ticket/email.
- Confirmar identidade (email + código) antes de alterar dados de conta.
- Solicitações de exclusão de conta: orientar o usuário a usar `DELETE /me/delete-account` (não excluir manualmente no DB).
- Logs de tickets são auditáveis — não incluir PII desnecessário.

### 6.3 Operações (organizadores)
- Confirmações de pagamento: usar o dashboard, não o DB.
- Cancelamentos em massa: abrir PR com flag de admin para evitar ação irrefletida.
- Dados de participantes: somente os necessários para o evento.

### 6.4 Jurídico
- Manter contratos DPA atualizados (ver `dpa-templates/`).
- Monitorar mudanças na legislação (LGPD updates ANPD).
- Revisar cada mudança de versão dos Termos/Política.

---

## Avaliação

Após o treinamento: quiz de 15 questões (mínimo 80% para passar). Tópicos cobertos:

- Identificar bases legais em cenários (5 questões).
- Aplicar minimização em endpoints (3 questões).
- Reagir a tentativa de phishing (3 questões).
- Acionar resposta a incidente (2 questões).
- Políticas internas ToquePlay (2 questões).

Resultado: registrado em `docs/lgpd/training-records/<user>.md` (accessível ao auditor ANPD).

---

## Atualizações

| Versão | Data | Mudança |
|--------|------|---------|
| v1.0 | 2026-06-16 | Versão inicial. |

Treinamento deve ser revisado anualmente ou após cada incidente CRÍTICO.
