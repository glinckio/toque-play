# Plano: Design do app ToquePlay

## Contexto
ToquePlay é um app mobile (React Native, viewport 390px) para organização de torneios e amistosos de vôlei (beach/court). O usuário enviou um doc completo (`src/imports/pasted_text/toqueplay-app-design.md`) com toda a lógica de backend (status, DTOs, fluxos) e mais de 30 telas de referência Figma sob `src/imports/` do app esportivo "Sportify". Decisão do usuário:

- **Cor principal:** `#6d2ec0` (roxo) — substitui o vermelho `#FF5050` do Sportify
- **Não copiar Sportify** — usar como referência estética (tipografia Bebas/Manrope, botões chevron-tipped, header colorido com watermark, navbar pill flutuante) mas criar uma identidade nova para ToquePlay
- **Escopo desta entrega:** apenas fluxos de **torneios** e **amistosos** + telas auxiliares listadas
- **Decisões livres** para o restante (estrutura de navegação, hierarquia, microinterações)

## Identidade visual proposta

**Paleta**
- Primário: `#6D2EC0` (roxo)
- Primário escuro: `#4A1F87` (header / fundo do hero)
- Acento: `#A674F0` (highlights, gradientes)
- Texto: `#150A1F` / `#3D2C52` / `#6B5B7E` / `#A89BBA`
- Surface: `#FAFAFA` (bg), white (cards), `#F4EFFA` (input bg roxo claro)
- Estado: success `#1FB87A`, danger `#E04545`, warning `#F0A030`

**Tipografia (mantém o stack do Sportify)**
- Display/UI accent: Bebas Neue Bold — títulos hero, labels de botão, badges, status do torneio
- Body: Manrope Regular/Medium/SemiBold — copy, listas, formulários
- Wordmark "TOQUEPLAY": Azeret Mono SemiBold (mesmo tratamento)
- Forms: IBM Plex Sans (carbon-style inputs)

**Componentes-assinatura (reuso adaptado do Sportify)**
- Botão chevron-tipped pill (8px triangle caps) — primário roxo, secundário escuro, ghost outline
- Header hero roxo com watermark Bebas opacity 10% atrás do título
- Navbar pill flutuante com backdrop-blur — 5 ícones (Home / Explorar / Criar `+` central destacado / Notificações / Perfil)
- Cards de match/torneio com header colorido + corpo branco
- Tab bar com underline 2px roxo para alternar (Torneios / Amistosos, Próximos / Passados, etc.)

## Arquitetura de navegação

```
Splash → Auth Stack            → Main Tabs
                                  ├─ Home (feed: próximos jogos do usuário + atalhos)
                                  ├─ Explorar (busca torneios + amistosos por região/data)
                                  ├─ [+] Criar (action sheet: Torneio / Amistoso)
                                  ├─ Notificações
                                  └─ Perfil
                                       ├─ Meus times
                                       ├─ Torneios que organizo
                                       ├─ Minhas arbitragens
                                       └─ Configurações
```

Stacks empilhadas a partir de qualquer tab:
- Detalhe do Torneio (Overview / Categorias / Chaves / Patrocinadores)
- Wizard de criação de torneio (5 passos: Básico → Estrutura → Categorias → Patrocinadores/imagem → Revisão & Publicar)
- Detalhe do Amistoso + ações (aceitar / rejeitar / cancelar / selecionar atletas)
- Wizard de criação de amistoso (1 passo: data, local, time, modalidade, formato, atletas, desafiado)
- Match Live (placar, registrar ponto, set, timeout, substituição, walkover, finalizar)
- Entrar como árbitro (input do código de 6 chars)

## Telas a construir (escopo desta entrega)

### Auth
1. **Splash** — wordmark TOQUEPLAY + logo, fundo roxo com gradiente, loader
2. **Registro** — header roxo + watermark, form: Nome / Email / Senha / Confirmar Senha, botão "Criar conta" + link p/ Login
3. **Login** — Email / Senha + "Esqueci minha senha", botão "Entrar", divisor OR, "Continuar com Google", "Entrar como visitante" (ghost)

### Main
4. **Home** — saudação + próximos jogos (cards horizontais) + meus torneios em andamento + amistosos pendentes (badge)
5. **Explorar** — search bar + filtros (modalidade, formato, cidade, data, raio) + abas Torneios/Amistosos + lista de cards com mapa-thumb
6. **Notificações** — lista agrupada por dia (FRIENDLY_REQUEST, FRIENDLY_ACCEPTED, tournament updates, match alerts) com ações inline
7. **Perfil** — header roxo com avatar/nome + atalhos (Meus Times, Torneios que organizo, Minhas Arbitragens, Configurações, Sair)

### Times & Listagens
8. **Meus Times** — lista de cards (logo, nome, modalidade) + FAB "+" Criar time
9. **Detalhe do Time** — membros, capitão, estatísticas resumidas
10. **Meus Torneios (organizados)** — abas por status (Rascunho / Publicado / Em andamento / Finalizado), cards com progresso
11. **Minhas Arbitragens** — lista de matches que estou arbitrando, com status e CTA "Entrar"

### Torneio
12. **Detalhe do Torneio** — hero image + status badge + tabs (Visão geral / Categorias / Chaves / Patrocinadores) + CTA contextual (Inscrever / Acompanhar / Gerenciar)
13. **Wizard Criar Torneio (5 passos)** — stepper no topo, formulários por etapa, navegação chevron-tipped "Voltar / Avançar"
14. **Chaves (bracket viewer)** — visualização horizontal scrollável de matches, badges FINAL/SEMIFINAL, status colorido
15. **Inscrição** — selecionar categoria + time + atletas + pagamento (mock)

### Amistoso
16. **Detalhe do Amistoso** — header com data/local + times confrontados + atletas escalados + CTA (Aceitar/Rejeitar se desafiado; Cancelar se solicitante; Selecionar atletas se ACCEPTED)
17. **Criar Amistoso** — form único (data, hora, local, modalidade, formato, time solicitante, time/usuário desafiado, atletas)
18. **Aceitar Amistoso (modal)** — selecionar atletas do time desafiado + capitão

### Match (compartilhado torneio/amistoso)
19. **Match Live (placar)** — dois lados de time grandes, score gigante Bebas, sets vencidos, ações: +1 ponto / remover ponto / timeout / substituição / finalizar set / walkover
20. **Match Finalizado** — resumo final com winner, sets, eventos timeline
21. **Entrar como árbitro** — input grande de 6 caracteres + CTA roxo
22. **Gerar código de árbitro (sheet)** — exibe código + countdown 24h + copiar

## Arquivos a criar

Tudo dentro de `src/app/`:
- `App.tsx` — root com router simples (state-based, sem react-router para começar; pode evoluir)
- `components/` — primitivos compartilhados:
  - `Button.tsx` (chevron-tipped, variants: primary/secondary/ghost/danger)
  - `HeroHeader.tsx` (roxo + watermark Bebas)
  - `StatusBadge.tsx` (mapeia TournamentStatus / MatchStatus / FriendlyStatus para cores)
  - `BottomNav.tsx` (pill flutuante 5 ícones)
  - `TabBar.tsx` (underline 2px)
  - `Input.tsx` (carbon-style, 48px)
  - `MatchCard.tsx`, `TournamentCard.tsx`, `FriendlyCard.tsx`, `TeamCard.tsx`, `NotificationItem.tsx`
  - `Stepper.tsx`, `Scoreboard.tsx`, `BracketView.tsx`, `RefereeCodeInput.tsx`
- `screens/` — uma pasta por área (auth, home, explore, notifications, profile, teams, tournaments, friendlies, match)
- `data/mocks.ts` — dados mock (torneios, amistosos, times, usuários, notificações) tipados com os enums do doc
- `styles/theme.css` — tokens roxos
- `styles/fonts.css` — imports de Bebas/Manrope/Azeret/IBM Plex Sans

## Estratégia de execução
1. Atualizar `styles/theme.css` + `styles/fonts.css` com tokens roxos
2. Construir primitivos (`Button`, `Input`, `HeroHeader`, `StatusBadge`, `BottomNav`, `TabBar`)
3. Criar mocks tipados em `data/mocks.ts`
4. Construir telas de Auth (Splash/Login/Registro)
5. Construir Main shell (BottomNav) + Home + Explorar + Notificações + Perfil
6. Construir fluxos de Torneio (lista, detalhe, wizard simplificado, bracket viewer)
7. Construir fluxos de Amistoso (criar, detalhe, aceitar)
8. Construir Match Live + arbitragem
9. Conectar tudo via roteamento de estado no `App.tsx`

## Verificação
- Visualizar cada rota no preview do Figma Make (sem `localhost`)
- Conferir que: cores correspondem a `#6D2EC0`, tipografia carrega (Bebas + Manrope + Azeret), botões mostram caps triangulares, bottom nav tem blur, status badges refletem os enums do doc
- Navegar do Splash até criar um torneio fake, criar um amistoso, abrir um match e marcar pontos
