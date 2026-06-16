# OpenAPI Codegen — Setup Guide

> Versão: v1.0 · 2026-06-16
> Objetivo: gerar clientes TypeScript tipados a partir do `swagger.json` do backend,
> eliminando a duplicação de interfaces (atualmente mantidas à mão em `app/src/types` e `web/src/lib/types`).

## Status

**Não habilitado**. Este documento descreve como adotar. Sprint futura.

## Pré-requisitos

- Backend expõe Swagger em `/api/docs` (já configurado via `@nestjs/swagger` em `main.ts`).
- `swagger.json` recuperável em build time.

## Escolha da ferramenta

| Ferramenta | Pró | Contra |
|-----------|-----|--------|
| `orval` | Multi-target (React Query, SWR, fetch, axios, Vue). Mocks MSW. | Setup config `.ts`, less docs. |
| `@hey-api/openapi-ts` | Suporte oficial OpenAPI. Plugins TypeScript, Axios, React Query. | Mais jovem, breaking changes. |
| `openapi-typescript` | Apenas tipos (zero runtime). Simples. | Não gera clients, só tipos. |

**Recomendação ToquePlay**: **`orval`** — gera hooks React Query prontos (alinhado ao padrão do app/web).

## Setup proposto (orval)

### Passo 1: instalar
```bash
pnpm --filter app add -D orval
pnpm --filter web add -D orval
```

### Passo 2: `orval.config.ts` na raiz de cada pacote
```ts
import { defineConfig } from 'orval';

export default defineConfig({
  toqueplay: {
    input: {
      target: '../backend/swagger.json', // gerado pelo backend
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/generated',
      schemas: 'src/api/generated/schemas',
      client: 'react-query',
      httpClient: 'axios',
      mock: false,
      override: {
        mutator: {
          path: 'src/api/mutator.ts',
          name: 'apiClient',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
```

### Passo 3: mutator customizado (`src/api/mutator.ts`)
Para reaproveitar axios instance já configurada com interceptor de refresh token (no app) e proxy (no web):
```ts
import api from '../services/api'; // app
// import { api } from '../lib/api/client'; // web

export const apiClient = api;
```

### Passo 4: script package.json
```json
{
  "scripts": {
    "api:codegen": "orval --config ./orval.config.ts"
  }
}
```

### Passo 5: CI
Adicionar step em `.github/workflows/ci.yml`:
```yaml
- name: Generate API client
  run: pnpm --filter app run api:codegen && pnpm --filter web run api:codegen

- name: Check generated client is up-to-date
  run: git diff --exit-code || (echo "API client desatualizado. Rode pnpm api:codegen e commit." && exit 1)
```

### Passo 6: gerar swagger.json em CI
Backend precisa expor JSON em arquivo:
- `pnpm --filter backend exec ts-node -e "..."` para gerar via SwaggerModule.
- Ou rodar backend em staging e fazer fetch.
- Ou usar `@nestjs/swagger` plugin de build estático.

## Migração gradual

Não refatorar tudo de uma vez. Por módulo:

1. Escolher 1 recurso (ex: `users`).
2. Trocar types manuais por tipos gerados.
3. Trocar chamadas `api.get('users')` por hooks gerados `useGetUsers`.
4. Deletar código antigo.
5. Repetir para próximo módulo.

## Riscos

- **Breaking changes no Swagger**: mudanças no `@ApiProperty` do backend podem quebrar tipos gerados. CI gate (`git diff --exit-code`) força regenerar.
- **Tipos opcionais vs required**: garantir `@ApiProperty({ required: false })` coerente.
- **Schemas `any`**: endpoints que retornam `any` geram `unknown`. Refatorar para tipos concretos primeiro.

## Pendências

- [ ] Decidir ferramenta final (orval vs hey-api vs openapi-typescript).
- [ ] Gerar `swagger.json` estático em build backend.
- [ ] Configurar em 1 pacote piloto (recomendado: `web`, menor scope).
- [ ] Validar com 1 módulo antes de migrar tudo.
- [ ] Treinar time no padrão `useGetX` (React Query) gerado.
