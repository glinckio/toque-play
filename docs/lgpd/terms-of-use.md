# Termos de Uso

> **Versão**: v1.0 · **Data**: 2026-06-16
> Aplicável conforme `TERMS_VERSION=v1` no backend.

Ao criar uma conta ou utilizar qualquer funcionalidade da ToquePlay, você concorda integralmente com estes Termos.

---

## 1. Objeto

A ToquePlay é uma plataforma digital para organização e participação em torneios e amistosos de vôlei (de praia e de quadra), com gestão de times, inscrições, chaves, partidas ao vivo e pagamentos.

Estes Termos regulam a relação entre _[RAZÃO SOCIAL]_ ("ToquePlay", "nós", "Controladora"), inscrita no CNPJ sob nº _[XX.XXX.XXX/0001-XX]_, e o usuário ("você", "titular").

---

## 2. Cadastro e conta

### 2.1 Elegibilidade
- Você deve ter **16 anos ou mais**. Menores de 18 devem ter autorização dos responsáveis legais.
- Você concorda em fornecer informações **verdadeiras, completas e atualizadas**.

### 2.2 Credenciais
- Você é **responsável exclusivo** pela guarda de sua senha e por toda atividade realizada com sua conta.
- Comunique imediatamente o DPO em caso de uso não autorizado.
- Senhas são armazenadas com hash bcrypt cost 12 — nunca em texto plano.

### 2.3 Verificação
- Email deve ser verificado em até **10 minutos** após o registro (código enviado por email).
- Código de redefinição de senha expira em **5 minutos**.
- A ToquePlay pode exigir verificação adicional (CPF, documento) para uso de funções específicas.

---

## 3. Responsabilidades do usuário

Você se compromete a:

- Não utilizar a plataforma para finalidades **ilegais, abusivas ou fraudulentas**.
- Não criar contas falsas, usurpar identidade de terceiros ou falsificar dados.
- Não tentar burlar sistemas de segurança, autenticação, rate limit ou auditoria.
- Não coletar dados de outros usuários (scraping) para uso fora da plataforma.
- Tratar todos os participantes com respeito. Não publicar conteúdo discriminatório, ofensivo, sexual, violento ou que viole direitos de terceiros.
- Cumprir os regulamentos específicos de cada torneio (categorização por tipo, formato, modalidade).
- Efetuar pagamentos somente pelos canais oficiais (Stripe) — nunca transferir valores diretamente a organizadores sem registro na plataforma.
- Não utilizar bots, scripts automatizados ou APIs não autorizadas para criar inscrições em massa, gerar chaves, manipular placares.

---

## 4. Regras de torneios e pagamentos

### 4.1 Torneios
- O organizador define regras, valores, datas, local e número de vagas.
- A inscrição só é confirmada após pagamento confirmado (ou liberação gratuita pelo organizador).
- A ToquePlay pode cancelar torneios que violem a legislação, estes Termos ou que apresentem risco aos participantes.

### 4.2 Pagamentos
- Processados pela Stripe (Padrão PCI-DSS).
- A ToquePlay **não armazena** números de cartão.
- Os valores das inscrições podem incluir taxa de serviço da ToquePlay, divulgada previamente.

### 4.3 Chaveamento e partidas
- A geração automática de chaves obedece a critérios de desempate configuráveis (ordem de inscrição, número de sets vencidos, saldo de pontos).
- Decisões de arbitragem são de responsabilidade do torneio. A ToquePlay fornece ferramenta de registro de placar, não arbitra o jogo.

---

## 5. Cancelamento e reembolso

### 5.1 Pelo organizador
- Cancelamento de torneio: reembolso integral dos valores pagos em até **30 dias**.

### 5.2 Pelo usuário
- Cancelamento de inscrição antes do início do torneio (`status = REGISTRATION_OPEN` ou `PENDING_PAYMENT`): reembolso integral.
- Cancelamento após geração de chave ou início: **sem reembolso**, exceto decisão em contrário do organizador.
- Em caso de `W.O.` (não comparecimento), não há reembolso.

### 5.3 Procedimento
- Solicitação via app (cancelamento na inscrição) ou via DPO.
- Estorno processado pela Stripe no cartão original em até 2 ciclos de fatura.

---

## 6. Propriedade intelectual

- A marca, logotipo, código-fonte, design e documentação da ToquePlay são protegidos por direitos autorais e marca.
- Você mantém a propriedade sobre fotos, nomes de times e descrições que publicar, concedendo à ToquePlay licença **não-exclusiva, gratuita, mundial, pelo período de uso da plataforma**, para hospedar, exibir e processar esses conteúdos na prestação do serviço.
- Não é permitido usar a marca "ToquePlay" em produtos comerciais de terceiros sem autorização prévia por escrito.

---

## 7. Suspensão e bloqueio

A ToquePlay poderá suspender ou encerrar contas que:

- Violem estes Termos (especialmente §3).
- Sejam alvo de **reclamações fundamentadas reiteradas** por outros usuários, avaliadas caso a caso pelo time de moderação.
- Apresentem atividade fraudulenta, pagamento chargeback, ou uso malicioso de rate limit.
- Sejam determinadas por ordem judicial ou requisição da ANPD.

Em casos graves (fraude, crimes), o bloqueio é imediato e dados podem ser retidos para cumprimento de obrigação legal (art. 16, II LGPD).

Notificação por email será enviada previamente, salvo vedação legal.

---

## 8. Limitação de responsabilidade

A ToquePlay:

- Atua como **intermediadora tecnológica** entre organizadores, atletas e times. Não é parte dos contratos celebrados entre esses atores.
- **Não se responsabiliza** por: cancelamentos de torneios por motivos de força maior, decisões de arbitragem, condutas de terceiros, qualidade dos eventos, pagamento direto entre as partes (fora da Stripe).
- Responderá por **danos diretos e comprovados** decorrentes de dolo ou culpa grave da ToquePlay, limitados ao valor recebido do titular nos últimos 12 meses.
- Em **nenhuma hipótese** responde por lucros cessantes, danos indiretos, consequenciais ou morais não provados.

---

## 9. Foro e legislação aplicável

Estes Termos regem-se pela legislação brasileira. Fica eleito o foro da **Comarca de _[SÃO PAULO / SP ou sede da empresa]_**, com renúncia a qualquer outro, por mais privilegiado que seja, para dirimir quaisquer controvérsias.

Eventuais conflitos podem ser submetidos a **mediação** ou ao sistema de reclamações da ANPD antes de ajuizamento.

---

## 10. Atualizações e versão

Termos podem ser atualizados. Mudanças **major** (ex.: v1 → v2) ou que afetem obrigações financeiras exigem **consentimento explícito** no próximo login.

| Versão | Data | Mudança |
|--------|------|---------|
| v1.0 | 2026-06-16 | Versão inicial. |
| v1.1 | 2026-06-18 | Adicionado prazo de reset de senha (5 min). Ajustada regra de bloqueio: removido número fixo "3 reclamações em 90 dias" (sem mecanismo automático), substituída por avaliação caso a caso. |

---

## Contato

- Email: **contato@toqueplay.com** (assuntos gerais)
- DPO: **dpo@toqueplay.com** (LGPD/dados pessoais)
- App: tela "Fale com o DPO"
