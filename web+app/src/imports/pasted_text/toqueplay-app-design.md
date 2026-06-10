Você vai criar um design utilizando todos os arquivos que passei para você.
Esse design deve ser único e novo, não vamos "copiar" os arquivos que mandei para você e sim criar um novo porém se baseando nesse design passado nos arquivos.

Informações:
Nome do App: ToquePlay
Stack usada: React Native

O que teremos nesse design:
- Splash screen para o aplicativo
- Tela de registro
  - pediremos do usuário:
     - Nome
     - Email
     - Senha
     - Confirmar senha
- Tela de login
     - Email
     - Senha
     - Logar com google
     - Entrar como visitante
- Tela main com o usuário logado (aqui voce deverpa ver as melhores opções de tela/modal para o fluxo interno)

As regras de negócio e fluxo referente a criação dos torneios são as seguintes:

# Fluxo Completo do Torneio — Criação até Finalização

## 1. Criação do Torneio (POST /tournaments)

**Requisitos:** Role ORGANIZADOR ou SUPER_ADMIN.

**Dados obrigatórios** (`CreateTournamentDto`):
- `name`: string (max 150 chars)

**Dados opcionais:**
- `description`: string (max 1000 chars)

**Resultado:** Torneio criado com status `DRAFT`, `isPublished: false`.

Arquivo: `src/modules/tournaments/tournaments.service.ts:27-36`

---

## 2. Definição da Estrutura (PATCH /tournaments/:id/structure)

**Pré-condição:** Status `DRAFT`.

**Dados** (`UpdateStructureDto`):
- `eventType`: `'SINGLE'` | `'CIRCUIT'` (obrigatório)

### Stages (`StageDto[]`):
- `date`: string (ISO) — **obrigatório** (deve ser ≥7 dias no futuro)
- `name`: string?
- `startTime`: string?
- `maxTeams`: number?
- Endereço: `address`, `street`, `number`, `neighborhood`, `city`, `state`, `cep`
- Localização: `latitude`, `longitude`, `regionRadius`
- `facilities`: `FacilityDto[]` (name + available)

> CIRCUIT exige ≥1 stage. SINGLE usa o stage da category.

### Categories (`CategoryDto[]`):
- `type`: `'MALE'` | `'FEMALE'` | `'MIX'` (obrigatório)
- `format`: `'PAIR'` | `'QUARTET'` | `'SEXTET'` (obrigatório)
- `modality`: `'BEACH'` | `'COURT'` (obrigatório)
- `minMembers`: number? (default 2)
- `maxMembers`: number? (default 2)
- `bestOfSets`: number? (default 3) — melhor de N sets
- `semifinalBestOfSets`: number?
- `finalBestOfSets`: number?
- `tiebreakScore`: number? — pontos do tiebreak
- `startTime`: string?
- `registrationPrice`: number?
- `registrationDeadline`: string?
- `registrationRules`: string?
- `tiebreakerCriteria`: string[]? — critérios ordenados de desempate
- **Configuração de chaves:**
  - `bracketType`: `'SINGLE_ELIMINATION'` | `'DOUBLE_ELIMINATION'` | `'ROUND_ROBIN'` | `'GROUPS_THEN_ELIMINATION'`
  - `groupsCount`: number? (para GROUPS_THEN_ELIMINATION)
  - `teamsPerGroup`: number?
  - `teamsAdvancing`: number?

**Resultado:** Stages e categories criados dentro de transação. Deleta existentes e recria.

Arquivo: `src/modules/tournaments/tournaments.service.ts:54-123`

---

## 3. Dados Adicionais

### Patrocinadores (PATCH /tournaments/:id/sponsors)
- `sponsors[].name`: string (obrigatório)
- `sponsors[].logoUrl`: string?
- `sponsors[].description`: string?

### Imagem (PATCH /tournaments/:id/image — upload)

---

## 4. Publicação (PATCH /tournaments/:id/publish)

**Pré-condição:** Status `DRAFT`.

**Validações:**
- Deve ter nome
- Deve ter ≥1 stage e ≥1 category
- Todos stages devem ter localização (city ou address)
- Datas dos stages ≥7 dias no futuro

**Resultado:** Status → `PUBLISHED`, `isPublished: true`.

Arquivo: `src/modules/tournaments/tournaments.service.ts:224-269`

---

## 5. Inscrições (Registration)

**Status do torneio:** `PUBLISHED` → `REGISTRATION_OPEN` → `REGISTRATION_CLOSED`.

### Dados da inscrição (`Registration`):
- `tournamentId`: string
- `categoryId`: string
- `teamId`: string
- `userId`: string
- `status`: `PENDING_PAYMENT` (inicial)
- `paymentId`, `paymentStatus`, `paymentMethod`, `paidAt`

### Membros da inscrição (`RegistrationMember`):
- `registrationId`: string
- `teamMemberId`: string
- `isCaptain`: boolean

**Validações:**
- Tamanho do time deve respeitar minMembers/maxMembers da category
- Deadline não expirado
- Pagamento necessário se registrationPrice > 0

---

## 6. Geração de Chaves (POST /tournaments/:id/generate-bracket)

**Pré-condição:** Status `PUBLISHED`, `REGISTRATION_OPEN` ou `REGISTRATION_CLOSED`.

**Dados** (`GenerateBracketDto`):
- `categoryId`: string
- `type`: `'SINGLE_ELIMINATION'` | `'ROUND_ROBIN'` | `'GROUPS_THEN_ELIMINATION'`

**Validações:**
- Deve ser ≤2 dias antes da data do stage
- Deve ter ≥2 inscrições confirmadas
- Bracket não pode já existir para essa category

**Resultado:** Status → `BRACKET_GENERATED`.

Arquivo: `src/modules/brackets/brackets.service.ts:31-41`

### Algoritmos de geração:

**Single Elimination** (linhas 139-215):
- Calcula potência de 2 para total de slots
- Randomiza atribuição de times
- Cria hierarquia de matches com `nextMatchId`
- Byes geram walkover automático
- Labels: FINAL, SEMIFINAL com bestOfSets específicos

**Round Robin** (linhas 238-305):
- Todos jogam contra todos
- Distribui matches por rounds
- Cria matches de playoff (final + 3º lugar) com times TBD

**Groups Then Elimination** (linhas 307-440):
- Distribui times em N grupos
- Gera round-robin dentro de cada grupo
- Cria chave eliminatória com slots TBD para classificados
- Usa round offset (100+) para separar fase de grupos vs eliminatória

### Dados do Match gerado:
- `bracketId`, `round`, `position`
- `teamAId`, `teamBId` (ou null para TBD)
- `status`: `SCHEDULED`
- `bestOfSets`, `tiebreakScore` (herdado da category)
- `nextMatchId` (liga ao próximo match na chave)
- `group` (para fase de grupos)
- `label` (FINAL, SEMIFINAL, etc.)

---

## 7. Início do Torneio (PATCH /tournaments/:id/start)

**Pré-condição:** Status `BRACKET_GENERATED`.

**Resultado:** Status → `IN_PROGRESS`.

Arquivo: `src/modules/tournaments/tournaments.service.ts:271-283`

---

## 8. Ciclo de Vida do Match

### 8a. Iniciar Match (PATCH /matches/:id/start)

**Pré-condição:** Status `SCHEDULED`, ambos times atribuídos.

**Ações:**
- Cria `MatchSet` (setNumber: 1)
- Cria `MatchEvent` (MATCH_START)
- Status → `IN_PROGRESS`, `startedAt: now`
- Backfill `bestOfSets` e `tiebreakScore` da category se ausente
- WebSocket: `match:start`

Arquivo: `src/modules/matches/matches.service.ts:36-122`

### 8b. Registrar Ponto (PATCH /matches/:id/point)

**Dados** (`PointDto`):
- `team`: `'A'` | `'B'`

**Lógica:**
- Atualiza score do `MatchSet`
- Cria `PointEvent`
- **Auto-finish set** (torneios): quando score vencedor atingido
- **Beach**: troca de lado aos 11 pontos (1x por set)
- **Auto-finish match**: quando sets decidem vencedor
- WebSocket: `match:point`

Arquivo: `src/modules/matches/matches.service.ts:124-268`

### 8c. Remover Ponto (PATCH /matches/:id/remove-point)

**Dados:** `{ team: 'A' | 'B' }`
- Decrementa score do set
- Remove último `PointEvent`

Arquivo: `src/modules/matches/matches.service.ts:270-348`

### 8d. Finalizar Set (PATCH /matches/:id/set-finish)

**Dados** (`SetFinishDto`):
- `setNumber`: number

**Ações:**
- Cria `MatchEvent` (SET_FINISH)
- Atualiza score do match (sets ganhos)
- Cria próximo `MatchSet` se match não decidido
- WebSocket: `match:set-finish`

Arquivo: `src/modules/matches/matches.service.ts:350-437`

### 8e. Finalizar Match (PATCH /matches/:id/finish)

**Critério de vitória:**
- **Com bestOfSets:** sets ganhos ≥ ceil(bestOfSets / 2)
- **Sem bestOfSets:** score total (beach: 21, court: 25, +2 diferença)

**Ações:**
- Status → `FINISHED`, `finishedAt: now`
- Define `winnerId`
- Cria `MatchEvent` (MATCH_FINISH)
- **Avança vencedor** na chave (se `nextMatchId` existe)
- Atualiza rankings via `RankingService`
- **Auto-advança** times de grupos/round-robin quando fase completa
- WebSocket: `match:finish`

Arquivo: `src/modules/matches/matches.service.ts:439-535`

### 8f. Walkover (PATCH /matches/:id/walkover)

**Dados** (`WalkoverDto`):
- `winnerTeam`: `'A'` | `'B'`

**Pré-condição:** Status `SCHEDULED`.
- Status → `WALKOVER`
- Avança vencedor na chave
- Atualiza rankings

Arquivo: `src/modules/matches/matches.service.ts:537-602`

### 8g. Timeout (PATCH /matches/:id/timeout)

**Dados** (`TimeoutDto`):
- `team?`: `'A' | 'B'`

Arquivo: `src/modules/matches/matches.service.ts:604-643`

### 8h. Substituição (PATCH /matches/:id/substitution)

**Dados** (`SubstitutionDto`):
- `teamId`: string
- `playerOutId`: string
- `playerInId`: string

Arquivo: `src/modules/matches/matches.service.ts:645-713`

---

## 9. Sistema de Árbitro

### Gerar código (POST /matches/:id/generate-referee-code)
- Autorização: dono do torneio
- Gera código alfanumérico 6 chars, expira em 24h

### Entrar com código (POST /matches/referee-enter)
- Valida código e expiração
- Atribui `refereeId` ao match

### Autorização durante o match:
1. Se `refereeId` definido → só árbitro pode agir
2. Torneios → árbitros confirmados ou dono do torneio
3. Friendlies → capitães dos times

Arquivo: `src/modules/matches/matches.service.ts:739-799` e `984-1062`

---

## 10. Avanço Automático na Chave

### Groups Then Elimination:
Após cada match de grupo finalizado:
1. Calcula classificação: vitórias → saldo de pontos → pontos marcados
2. Classifica top N de cada grupo
3. Preenche slots da chave eliminatória
4. Walkover se slot sem adversário

Arquivo: `src/modules/brackets/brackets.service.ts:446-581`

### Round Robin:
Quando todos matches finalizados:
1. Ranking: vitórias → saldo → pontos
2. Preenche playoffs: 1º vs 2º (final), 3º vs 4º (3º lugar)

Arquivo: `src/modules/brackets/brackets.service.ts:608-729`

### Single Elimination:
Vencedor avança automaticamente ao `nextMatchId`.

---

## 11. Finalização do Torneio

Todos matches da chave finalizados → torneio pode ser marcado como `FINISHED`.

**Status lifecycle completo:**

```
DRAFT → PUBLISHED → REGISTRATION_OPEN → REGISTRATION_CLOSED → BRACKET_GENERATED → IN_PROGRESS → FINISHED
                                                                                              ↘ CANCELLED (de qualquer status não-terminal)
```

---

## Resumo dos Enums

### TournamentStatus
`DRAFT` | `PUBLISHED` | `REGISTRATION_OPEN` | `REGISTRATION_CLOSED` | `BRACKET_GENERATED` | `IN_PROGRESS` | `FINISHED` | `CANCELLED`

### MatchStatus
`SCHEDULED` | `IN_PROGRESS` | `FINISHED` | `WALKOVER` | `CANCELLED`

### BracketType
`SINGLE_ELIMINATION` | `DOUBLE_ELIMINATION` | `ROUND_ROBIN` | `GROUPS_THEN_ELIMINATION`

### TournamentType
`MALE` | `FEMALE` | `MIX`

### TournamentFormat
`PAIR` | `QUARTET` | `SEXTET`

### TournamentModality
`BEACH` | `COURT`

### TournamentEventType
`SINGLE` | `CIRCUIT`

### MatchEventType
`POINT` | `MATCH_START` | `SET_FINISH` | `MATCH_FINISH` | `WALKOVER` | `SIDE_SWITCH` | `TIMEOUT` | `SUBSTITUTION`

As regras de negócio e fluxo referente a amistosos são as seguintes:

# Fluxo Completo de Amistosos — Criação até Finalização

## 1. Criação do Amistoso (POST /friendlies)

**Requisitos:** Usuário autenticado.

**Dados** (`CreateFriendlyDto`):
- `date`: string (ISO) — **obrigatório**
- `title`: string?
- `description`: string?
- `requesterTeamId`: string? — time do solicitante
- `challengedId`: string? — usuário desafiado
- `challengedTeamId`: string? — time desafiado (auto-resolve `challengedId` para dono do time)
- `startTime`: string?
- Endereço: `address`, `addressNumber`, `city`, `state`
- Localização: `latitude`, `longitude`, `regionRadius`
- `modality`: `'BEACH'` | `'COURT'`?
- `categoryFormat`: `'PAIR'` | `'QUARTET'` | `'SEXTET'`?
- `athleteIds`: string[]? — IDs dos membros do time solicitante
- `captainId`: string? — se omitido, auto-resolve para dono do time

**Validações:**
- `requesterTeamId` deve pertencer ao usuário
- `challengedTeamId` deve existir
- Quantidade de atletas deve bater com `categoryFormat` (PAIR=2, QUARTET=4, SEXTET=6)
- Todos `athleteIds` devem ser membros do `requesterTeamId`

**Resultado:** Friendly com status `PENDING`.

**Side effects:**
- Cria `FriendlyAthlete` records (lado REQUESTER)
- Notifica usuário desafiado: "Nova Solicitacao de Amistoso"
- Auto-cria chat inter-time se ambos times presentes

Arquivo: `src/modules/friendlies/friendlies.service.ts:51-183`

---

## 2. Resposta ao Amistoso

### 2a. Aceitar (PATCH /friendlies/:id/accept)

**Autorização:** Apenas dono do time desafiado.

**Dados** (`AcceptFriendlyDto`):
- `athleteIds`: string[] — **obrigatório** (membros do time desafiado)
- `captainId`: string? — se omitido, auto-resolve para dono do time

**Validações:**
- Não pode aceitar próprio amistoso
- Apenas dono do time desafiado
- Status deve ser `PENDING`
- Quantidade de atletas deve bater com `categoryFormat`
- Todos atletas devem ser membros do `challengedTeamId`

**Resultado:** Status → `ACCEPTED`.

**Side effects:**
- Cria `FriendlyAthlete` records (lado CHALLENGED)
- **Cria Match** com: `friendlyId`, `round: 0`, `position: 0`, `status: SCHEDULED`, `teamAId: requesterTeamId`, `teamBId: challengedTeamId`
- Notifica solicitante: "Amistoso Aceito!"
- Auto-cria chat inter-time

Arquivo: `src/modules/friendlies/friendlies.service.ts:185-300`

### 2b. Rejeitar (PATCH /friendlies/:id/reject)

**Autorização:** Apenas dono do time desafiado.
**Pré-condição:** Status `PENDING`.
**Resultado:** Status → `REJECTED`.

Arquivo: `src/modules/friendlies/friendlies.service.ts:302-319`

### 2c. Cancelar (PATCH /friendlies/:id/cancel)

**Autorização:** Apenas o solicitante original.
**Pré-condição:** Status `PENDING` ou `ACCEPTED`.
**Resultado:** Status → `CANCELLED`.

Arquivo: `src/modules/friendlies/friendlies.service.ts:321-341`

---

## 3. Preparação (após aceite)

### 3a. Selecionar atletas (PATCH /friendlies/:id/select-athletes)

**Autorização:** Apenas dono do time desafiado.
**Pré-condição:** Status `ACCEPTED`.

**Dados:**
- `athleteIds`: string[] (body) — novos atletas do lado desafiado

**Ações:**
- Deleta `FriendlyAthlete` existentes do lado CHALLENGED
- Cria novos registros com atletas informados

Arquivo: `src/modules/friendlies/friendlies.service.ts:343-408`

### 3b. Gerar código de árbitro (POST /friendlies/:id/generate-referee-code)

**Autorização:** Apenas capitães designados (`isCaptain: true`).

**Resultado:**
- Código alfanumérico 6 chars, maiúsculo
- Expira em 24h
- Armazenado em `refereeCode` + `refereeCodeExpiresAt`

Arquivo: `src/modules/friendlies/friendlies.service.ts:410-453`

### 3c. Entrar como árbitro (POST /friendlies/referee-enter)

**Dados:** `code`: string

**Ações:**
- Valida código e expiração
- Atribui `refereeId` ao match

Arquivo: `src/modules/friendlies/friendlies.service.ts:455-515`

---

## 4. Ciclo de Vida do Match

> Após aceite, o amistoso tem um `Match` vinculado (`friendly.matchId`). Toda operação de match usa o módulo de matches.

### 4a. Iniciar Match (PATCH /matches/:id/start)

**Pré-condição:** Status `SCHEDULED`, ambos times atribuídos.

**Validações específicas para amistosos:**
- Só pode iniciar no dia agendado
- Só pode iniciar no horário agendado ou depois

**Ações:**
- Cria `MatchSet` (setNumber: 1)
- Cria `MatchEvent` (MATCH_START)
- Status → `IN_PROGRESS`, `startedAt: now`
- WebSocket: `match:start` (emite para sala `match:` e `friendly:`)

Arquivo: `src/modules/matches/matches.service.ts:36-122`

### 4b. Registrar Ponto (PATCH /matches/:id/point)

**Dados** (`PointDto`):
- `team`: `'A'` | `'B'`

**Lógica para amistosos:**
- Atualiza score do `MatchSet`
- Cria `PointEvent`
- **Apenas marca set como finalizado** quando score vencedor atingido (NÃO auto-finaliza o match como em torneios)
- Beach: troca de lado aos 11 pontos (1x por set)
- WebSocket: `match:point`

Arquivo: `src/modules/matches/matches.service.ts:124-268`

### 4c. Remover Ponto (PATCH /matches/:id/remove-point)

**Dados:** `{ team: 'A' | 'B' }`
- Decrementa score do set
- Remove último `PointEvent`
- Recalcula sets ganhos

Arquivo: `src/modules/matches/matches.service.ts:270-348`

### 4d. Finalizar Set (PATCH /matches/:id/set-finish)

**Dados** (`SetFinishDto`):
- `setNumber`: number

**Ações:**
- Cria `MatchEvent` (SET_FINISH)
- Atualiza score do match (sets ganhos por cada time)
- Cria próximo `MatchSet` se match não decidido
- WebSocket: `match:set-finish`

Arquivo: `src/modules/matches/matches.service.ts:350-437`

### 4e. Finalizar Match (PATCH /matches/:id/finish)

**Comportamento para amistosos:**
- **Pula validação de critério de vitória** — finish manual permitido
- Status → `FINISHED`, `finishedAt: now`
- Define `winnerId` baseado no score
- Cria `MatchEvent` (MATCH_FINISH)
- **Sincroniza status do friendly** → `COMPLETED`
- Copia scores para `friendly.scoreTeamA` e `friendly.scoreTeamB`
- Atualiza rankings via `RankingService`
- WebSocket: `match:finish`

Arquivo: `src/modules/matches/matches.service.ts:439-535`

### 4f. Walkover (PATCH /matches/:id/walkover)

**Dados** (`WalkoverDto`):
- `winnerTeam`: `'A'` | `'B'`

**Pré-condição:** Status `SCHEDULED`.
- Status → `WALKOVER`
- Define vencedor
- Atualiza rankings

Arquivo: `src/modules/matches/matches.service.ts:537-602`

### 4g. Timeout (PATCH /matches/:id/timeout)

**Dados** (`TimeoutDto`):
- `team?`: `'A' | 'B'`

Arquivo: `src/modules/matches/matches.service.ts:604-643`

### 4h. Substituição (PATCH /matches/:id/substitution)

**Dados** (`SubstitutionDto`):
- `teamId`: string
- `playerOutId`: string
- `playerInId`: string

Arquivo: `src/modules/matches/matches.service.ts:645-713`

---

## 5. Autorização durante o Match

**Prioridade:**

1. Se `refereeId` definido → **só árbitro** pode agir
2. Se sem árbitro → participantes do amistoso:
   - Solicitante (`requesterId`)
   - Dono do time solicitante
   - Desafiado (`challengedId`)
   - Dono do time desafiado

Arquivo: `src/modules/matches/matches.service.ts:984-1062`

---

## 6. WebSocket Events

### Salas:
- `friendly:{friendlyId}` — join via `friendly:join`
- `match:{matchId}` — join via `match:join`

### Eventos emitidos (servidor → cliente):
- `match:start` — match iniciado
- `match:point` — ponto marcado (inclui info de troca de lado)
- `match:set-finish` — set finalizado
- `match:finish` — match finalizado
- `match:update` — timeout / substituição

**Importante:** Para amistosos, eventos são emitidos em AMBAS as salas (`match:` e `friendly:`).

Arquivo: `src/modules/matches/matches.gateway.ts`

---

## 7. Descoberta de Amistosos

### Nearby (GET /friendlies/nearby)

**Query:** `latitude`, `longitude`, `radius` (default 50km)
- Filtra por status `PENDING` ou `ACCEPTED`
- Usa bounding box para geolocalização

Arquivo: `src/modules/friendlies/friendlies.service.ts:579-607`

### Explore (GET /friendlies/explore)

**Query:** `latitude`, `longitude`, `radius`, `dateFrom`, `dateTo`, `city`
- Status `PENDING` ou `ACCEPTED`
- Filtros: cidade (case-insensitive), data, localização
- Limitado a 20 resultados

Arquivo: `src/modules/friendlies/friendlies.service.ts:631-670`

### Meus Amistosos (GET /friendlies)

**Query:** `status`, `city`, `dateFrom`, `dateTo`
- Retorna amistosos onde usuário é solicitante, desafiado ou atleta selecionado

Arquivo: `src/modules/friendlies/friendlies.service.ts:517-577`

---

## 8. Notificações

| Evento | Destinatário | Título | Tipo |
|--------|-------------|--------|------|
| Criação | Desafiado | "Nova Solicitacao de Amistoso" | `FRIENDLY_REQUEST` |
| Aceite | Solicitante | "Amistoso Aceito!" | `FRIENDLY_ACCEPTED` |

---

## 9. Status Lifecycle

```
PENDING ──→ ACCEPTED ──→ COMPLETED
  │             │
  ├─→ REJECTED  ├─→ CANCELLED
  │
  └─→ CANCELLED
```

### Match Status (vinculado ao friendly):
```
SCHEDULED → IN_PROGRESS → FINISHED
SCHEDULED → WALKOVER
```

---

## 10. Modelo de Dados

### Friendly
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID único |
| `title` | string? | Título |
| `description` | string? | Descrição |
| `requesterId` | uuid | Usuário solicitante |
| `requesterTeamId` | uuid? | Time solicitante |
| `challengedId` | uuid? | Usuário desafiado |
| `challengedTeamId` | uuid? | Time desafiado |
| `status` | FriendlyStatus | Status atual |
| `date` | DateTime | Data do amistoso |
| `startTime` | DateTime? | Horário de início |
| `address` / `addressNumber` | string? | Endereço |
| `city` / `state` | string? | Cidade / Estado |
| `latitude` / `longitude` | float? | Coordenadas |
| `regionRadius` | int? | Raio de região (km) |
| `scoreTeamA` / `scoreTeamB` | int? | Placar final |
| `modality` | string? | BEACH / COURT |
| `categoryFormat` | string? | PAIR / QUARTET / SEXTET |
| `matchId` | uuid? | Match vinculado |
| `refereeCode` | string? | Código do árbitro |
| `refereeCodeExpiresAt` | DateTime? | Expiração do código |

### FriendlyAthlete
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID único |
| `friendlyId` | uuid | Friendly vinculado |
| `teamMemberId` | uuid | Membro do time |
| `side` | string | `REQUESTER` ou `CHALLENGED` |
| `isCaptain` | boolean | Se é capitão |

---

## 11. Diferenças Chave: Amistoso vs Torneio

| Aspecto | Amistoso | Torneio |
|---------|----------|---------|
| Criação do match | No aceite | Na geração de chaves |
| Auto-finish do match | Não (manual) | Sim (sets definem vencedor) |
| Auto-finish do set | Sim (marca finalizado) | Sim (marca + avança) |
| Validação de horário | Sim (dia/horário agendado) | Não |
| Avanço na chave | Não há chave | Vencedor → nextMatch |
| Ranking | Atualiza stats | Atualiza stats |
| Árbitro via código | Capitães geram | Dono do torneio gera |
