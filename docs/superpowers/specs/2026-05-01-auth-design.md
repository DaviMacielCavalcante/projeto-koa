# Design: Autenticação por SMS OTP

**Data:** 2026-05-01
**Fase:** 1 — Infraestrutura base
**Status:** aprovado

---

## Contexto

Implementar autenticação via Firebase Auth (phone OTP/SMS) no app React Native + Expo. As dependências já estão instaladas (`@react-native-firebase/auth`, `expo-secure-store`). O app está no estado inicial (App.tsx padrão, sem navegação).

Decisões tomadas durante o brainstorming:

- Instalar **React Navigation** agora (adiantando Fase 2), pois auth já precisa de 2 telas com transição entre elas.
- **AuthContext** para centralizar estado de auth e lógica de session timeout.
- **Áudio omitido** por ora (arquivos não gravados ainda); comentários marcam os pontos de integração futura.

---

## Arquitetura

### Estrutura de arquivos

```text
apps/mobile/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx        # estado de auth + session timeout
│   ├── navigation/
│   │   ├── AuthStack.tsx          # stack pré-login (Phone → OTP)
│   │   └── AppStack.tsx           # placeholder para a Fase 2
│   ├── screens/
│   │   └── auth/
│   │       ├── PhoneScreen.tsx    # entrada do número + envio do OTP
│   │       └── OtpScreen.tsx      # entrada do código de 6 dígitos
│   └── hooks/
│       └── useAuth.ts             # atalho para useContext(AuthContext)
└── App.tsx                        # monta NavigationContainer + decide qual stack
```

### Fluxo geral

```text
App.tsx
 └── AuthContext.Provider
      └── NavigationContainer
           ├── [user == null] AuthStack
           │    ├── PhoneScreen  →  OtpScreen
           │    └── OtpScreen   →  (onAuthStateChanged detecta usuário → App troca para AppStack)
           └── [user != null] AppStack (placeholder)
```

---

## AuthContext

### Estado exposto

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `user` | `FirebaseAuthTypes.User \| null` | Usuário autenticado atual |
| `isLoading` | `boolean` | `true` enquanto verifica estado inicial de auth |
| `signOut` | `() => Promise<void>` | Limpa token e chama `auth().signOut()` |

### Ciclo de vida do token

1. Login bem-sucedido → salva timestamp em `expo-secure-store` (chave: `auth_timestamp`).
2. `onAuthStateChanged` detecta usuário → inicia timers de timeout.
3. Logout (manual ou timeout) → chama `auth().signOut()` e apaga `auth_timestamp`.

### Session timeout (RNF18)

**Background — 1 hora:**
- `AppState` listener monitora transições `active ↔ background`.
- Ao entrar em background: salva `background_timestamp` no `expo-secure-store`.
- Ao voltar ao foreground: calcula `agora - background_timestamp`. Se > 1h → `signOut()`.

**Inatividade — 3 horas:**
- Um ref `lastActivityRef` é atualizado com `Date.now()` a cada toque via `TouchableWithoutFeedback` wrapper no `AppStack`.
- `setTimeout` de 3h iniciado após login e resetado a cada toque.
- Ao entrar em background: cancela o timer ativo (para não conflitar com a regra de 1h).
- Ao voltar ao foreground (após passar a checagem de 1h): calcula `elapsed = agora - lastActivityRef.current`. Se `elapsed >= 3h` → `signOut()`. Caso contrário, inicia novo timer com `3h - elapsed`.
- Se o timer disparar com app em foreground → `signOut()`.

### O que o AuthContext NÃO faz

- Não chama APIs de auth diretamente — isso fica nas telas.
- Não acessa SQLite — virá na integração com a Fase 1 (SQLite).

---

## Telas

### PhoneScreen

**Objetivo:** coletar o número de telefone e disparar o envio do SMS OTP.

**UI:**
- Campo numérico grande com máscara `(XX) XXXXX-XXXX`, teclado numérico.
- Botão "Receber código" (mínimo 56dp — RNF05).
- Spinner no botão enquanto aguarda resposta do Firebase (botão desabilitado para evitar duplo envio).
- Mensagem de erro em texto abaixo do campo.

**Erros tratados:**
| Condição | Mensagem exibida |
| --- | --- |
| Número inválido | "Número de telefone inválido" |
| Sem sinal / timeout | "Não foi possível enviar o SMS. Verifique sua conexão." |
| Erro genérico | "Erro ao enviar o código. Tente novamente." |

**Integração de áudio (futura — Fase 4):**
- `// TODO audio: phone_instructions.mp3 (autoPlay na primeira visita)`
- `// TODO audio: error_invalid_number.mp3`
- `// TODO audio: error_no_signal.mp3`

**Navegação:** ao receber o `verificationId` do Firebase, navega para `OtpScreen` passando `verificationId` como parâmetro de rota.

---

### OtpScreen

**Objetivo:** coletar o código de 6 dígitos e confirmar a autenticação.

**UI:**
- 6 inputs numéricos individuais (foco avança automaticamente dígito a dígito).
- Botão "Confirmar" (mínimo 56dp — RNF05).
- Contador regressivo de 60s; botão "Reenviar código" habilitado após expirar.
- Mensagem de erro em texto abaixo dos inputs.

**Erros tratados:**
| Condição | Mensagem exibida |
| --- | --- |
| Código incorreto | "Código incorreto. Tente novamente." |
| Código expirado | "O código expirou. Volte e peça um novo." |
| Erro genérico | "Erro ao confirmar. Tente novamente." |

**Integração de áudio (futura — Fase 4):**
- `// TODO audio: otp_instructions.mp3 (autoPlay na primeira visita)`
- `// TODO audio: error_wrong_code.mp3`
- `// TODO audio: error_expired_code.mp3`

**Navegação:** ao confirmar com sucesso, `onAuthStateChanged` no `AuthContext` detecta o usuário e `App.tsx` troca automaticamente para `AppStack` — sem navegação explícita na tela.

---

## Navegação

### AuthStack

Stack Navigator com `gestureEnabled: false` em todas as telas (RNF06). Rotas:

| Nome | Tela | Parâmetros |
| --- | --- | --- |
| `Phone` | `PhoneScreen` | — |
| `Otp` | `OtpScreen` | `verificationId: string` |

### AppStack

Placeholder por enquanto — uma tela simples "Autenticado com sucesso". Será substituído na Fase 2 com a navegação principal (bottom tabs + stacks de documentos).

---

## Dependências novas (a instalar)

```bash
pnpm --filter mobile exec expo install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context
```

O `@react-navigation/bottom-tabs` será instalado na Fase 2 junto com a navegação principal.

---

## Fora de escopo (este design)

- Integração com SQLite (salvar agricultor localmente após login) — Fase 1 SQLite.
- Navegação principal (bottom tabs, telas de documentos) — Fase 2.
- Componente AudioPlayer — Fase 2/4.
- Regras de segurança do Firestore/Storage — item separado da Fase 1.
