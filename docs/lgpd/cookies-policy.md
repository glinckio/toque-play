# Política de Cookies

> **Versão**: v1.0 · **Data**: 2026-06-16

Esta Política descreve como a ToquePlay utiliza cookies e mecanismos de armazenamento local no navegador e no aplicativo móvel.

---

## 1. O que são cookies e storage local

**Cookies** são pequenos arquivos de texto que o servidor web envia ao navegador para manter estado entre requisições (ex.: sessão de login). **Storage local** (AsyncStorage no React Native, SecureStore no iOS/Android, localStorage no navegador) são mecanismos do dispositivo que guardam dados entre sessões.

---

## 2. Cookies utilizados (web admin)

A área administrativa (`painel.toqueplay.com` ou equivalente) utiliza **3 cookies**, **todos httpOnly** (não acessíveis via JavaScript, protegidos contra roubo por XSS):

| Cookie | Conteúdo | Finalidade | Duração do cookie | Secure | SameSite |
|--------|----------|------------|-------------------|--------|----------|
| `tp_access` | JWT de acesso | Manter sessão autenticada | 7 dias (cookie; JWT expira em 15 min e é renovado silenciosamente pelo `tp_refresh`) | Sim (prod) | Lax |
| `tp_refresh` | Refresh token | Renovar access token sem novo login | 7 dias | Sim (prod) | Lax |
| `tp_user` | JSON mínimo (id, nome, email, role) | Renderizar UI server-side sem nova chamada API | 7 dias | Sim (prod) | Lax |

### Características técnicas
- **httpOnly**: `true` — proteção contra leitura por scripts.
- **Secure**: `true` em produção (`NODE_ENV=production`) — só trafega por HTTPS.
- **SameSite**: `Lax` — mitiga CSRF na maioria dos navegadores modernos.
- **Path**: `/`.
- **maxAge**: 7 dias para os três cookies (`COOKIE_MAX_AGE` em `web/src/lib/auth/constants.ts`). O JWT embutido em `tp_access` expira em 15 minutos; o cliente renova silenciosamente via `tp_refresh` antes que o usuário perceba.

Não utilizamos cookies de terceiros para rastreamento (Google Analytics, Facebook Pixel, etc.).

---

## 3. Storage local (app móvel)

O aplicativo ToquePlay utiliza:

| Mecanismo | Conteúdo | Plataforma | Finalidade |
|-----------|----------|------------|------------|
| `expo-secure-store` | tokens de autenticação (auth-storage) | iOS Keychain / Android Keystore | Persistir sessão com criptografia nativa |
| `AsyncStorage` | preferências de UI (ex.: última aba, tema) | ambos | Configurações locais não-sensíveis |

**Não** armazenamos senhas, dados de cartão ou CPF em storage local. Todos os tokens estão protegidos por enclave do sistema operacional.

---

## 4. Cookies de terceiros

Os seguintes serviços externos, integrados opcionalmente, podem setar seus próprios cookies quando você interage com eles:

| Serviço | Quando | Política |
|---------|--------|----------|
| **Stripe** | Quando você abre o checkout de pagamento | https://stripe.com/cookies-policy/legal |
| **Google OAuth** | Quando você escolhe "Entrar com Google" | https://policies.google.com/technologies/cookies |

**Sentry** (monitoramento de erros): configurado com `sendDefaultPii=false` e `beforeSend` que remove headers sensíveis. Não seta cookies de rastreamento no contexto ToquePlay.

A ToquePlay não controla cookies de terceiros. Consulte as políticas acima para exercer opt-out.

---

## 5. Como gerenciar

### No navegador
- **Chrome**: Configurações → Privacidade e segurança → Cookies.
- **Firefox**: Preferências → Privacidade e segurança → Cookies.
- **Safari**: Preferências → Privacidade → Cookies.

Bloquear todos os cookies quebra o login no painel admin — recomendamos manter `tp_access` e `tp_refresh`.

### No app
- **iOS**: Ajustes → ToquePlay → Limpar dados.
- **Android**: Configurações → Aplicativos → ToquePlay → Armazenamento → Limpar.
- Ou dentro do app: **Privacidade e consentimentos → Excluir minha conta** (anonimiza dados).

### Logout
Ao fazer logout (`POST /auth/logout`), todos os 3 cookies são expirados (`maxAge=0`) e o refresh token é invalidado no banco. O token de acesso (ainda válido por até 15 min) é adicionado a uma blacklist Redis (`revoked:jwt:${jti}`, TTL 15 min) até expirar naturalmente.

---

## 6. Consentimento (LGPD art. 8)

Os cookies essenciais (`tp_access`, `tp_refresh`, `tp_user`) são necessários para a execução do contrato de uso (art. 7º, V) e **não exigem consentimento separado** — estão cobertos pelo aceite dos Termos de Uso.

Cookies opcionais (marketing, analytics de terceiros) seriam implementados somente mediante consentimento granular explícito no primeiro acesso. Atualmente **não utilizamos** cookies dessa categoria.

---

## 7. Atualizações

| Versão | Data | Mudança |
|--------|------|---------|
| v1.0 | 2026-06-16 | Versão inicial. |
| v1.1 | 2026-06-18 | Corrigida duração do cookie `tp_access` (cookie=7d, JWT=15min). Removido Sentry da lista de cookies de terceiros (`sendDefaultPii=false`). |

Em caso de adição de novos cookies, esta Política será atualizada com pelo menos 30 dias de antecedência.
