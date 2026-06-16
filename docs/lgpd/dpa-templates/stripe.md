# DPA — Stripe

> **Parceiro**: Stripe Payments · **País**: EUA (com entity EU opcional Stripe Payments Europe Ltd Ireland)
> **DPA oficial**: https://stripe.com/legal/dpa
> **Status**: SCC (Standard Contractual Clauses) firmados pela Stripe com todos os clientes.

## Dados processados

- **Email** do titular (para envio de recibos, comunicação de cobrança).
- **Valor**, **moeda**, **descrição do produto** (torneio + categoria).
- **metadata**: `registrationId`.
- **PaymentIntent ID**, **Checkout Session ID**.

Stripe **não** recebe: CPF, telefone, senha, endereço (exceto para faturamento opcional).

## Bases contratuais

- **Stripe Services Agreement** (aceito no ato da criação da conta Stripe da ToquePlay).
- **Stripe Privacy Policy**: https://stripe.com/privacy.
- **DPA**: https://stripe.com/legal/dpa (auto-aplicável, cobre LGPD e GDPR).
- **SCCs**: https://stripe.com/legal/pte (Personal Data Export).

## Configuração recomendada

- Ativar **Stripe Radar** para detecção de fraude.
- Configurar **webhook signature verification** (já implementado — tolerância 300s).
- Restringir IPs do webhook no dashboard Stripe quando possível.
- Ativar **3DSecure** para transações acima de R$ 200 (recomendado para chargeback protection).
- **PCI-DSS**: ToquePlay **não** toca dados de cartão — usa Stripe Checkout / PaymentIntents. SAI do escopo PCI SAQ-A.

## Incidentes

Stripe notifica incidentes pelo dashboard e por email do admin da conta. **Prazo Stripe**: sem compromisso contratual específico; recomendado incluir na política interna que notificações da Stripe devem ser tratadas como incidente CRÍTICO até prova em contrário.

## Subprocessadores

Lista atualizada em https://stripe.com/legal/sub-processors. ToquePlay recebe notificação por email de adições — revisar mensalmente.

## Auditoria

Stripe oferece relatórios via dashboard e API. Não permite auditoria in loco — compensar com revisão trimestral de eventos de webhook + reconciliação contábil.

## Retenção

- Stripe retém dados de transação por **10 anos** para obrigações AML/KYX.
- ToquePlay mantém `paymentId` em `Registration.paymentId` por 5 anos (fiscal BR).

## Devolução/eliminação

Para encerrar: exportar todos os charges via API, solicitar purge da conta Stripe (processo demorado, até 30 dias). Em geral, **não eliminável** por obrigação legal financeira.

## Pendências ToquePlay

- [ ] Assinar/aditar contrato específico se volume > R$ X/ano (Stripe oferece termos customizados).
- [ ] Decidir sobre Stripe BR vs Stripe US entity (impacto em transferência internacional).
