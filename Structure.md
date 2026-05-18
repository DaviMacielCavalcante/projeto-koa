● Mapa do mobile

    Entry point e fluxo

    package.json declara "main": "expo-router/entry", então App.tsx e index.ts na raiz não são usados — o app inicia pelo app/_layout.tsx  (expo-router file-based).
    Bootstrap em app/_layout.tsx:38-76 faz, em sequência:
    1. initDb() → cria tabelas SQLite
    2. Checa last_active no SecureStore → faz logout se passou 30 min (auto-lock LGPD)
    3. Configura permissões e agenda notificações
    4. Listener NetInfo que dispara syncQueue() toda vez que volta a internet
    5. Bloqueia botão voltar do Android e desabilita gesto de swipe-back (gestureEnabled: false)

    Telas (todas em apps/mobile/app/)

    ┌────────────────────┬───────────────────────┬────────────────────────────────────────────────────────────────┐
    │        Rota        │        Arquivo        │                             Papel                              │
    ├────────────────────┼───────────────────────┼────────────────────────────────────────────────────────────────┤
    │ /                  │ index.tsx             │ Login telefone (Firebase Auth)                                 │
    ├────────────────────┼───────────────────────┼────────────────────────────────────────────────────────────────┤
    │ /otp               │ otp.tsx               │ Confirmação SMS                                                │
    ├────────────────────┼───────────────────────┼────────────────────────────────────────────────────────────────┤
    │ /onboarding        │ onboarding.tsx        │ Wizard 5 etapas (boas-vindas → LGPD → perfil → tour → prática) │
    ├────────────────────┼───────────────────────┼────────────────────────────────────────────────────────────────┤
    │ /(tabs)/           │ (tabs)/index.tsx      │ Home: 5 círculos de status dos documentos                      │
    ├────────────────────┼───────────────────────┼────────────────────────────────────────────────────────────────┤
    │ /(tabs)/documentos │ (tabs)/documentos.tsx │ Lista "Outros"                                                 │
    ├────────────────────┼───────────────────────┼────────────────────────────────────────────────────────────────┤
    │ /(tabs)/avisos     │ (tabs)/avisos.tsx     │ Notificações                                                   │
    ├────────────────────┼───────────────────────┼────────────────────────────────────────────────────────────────┤
    │ /(tabs)/ajuda      │ (tabs)/ajuda.tsx      │ Ajuda + LGPD delete                                            │
    ├────────────────────┼───────────────────────┼────────────────────────────────────────────────────────────────┤
    │ /documento/[tipo]  │ documento/[tipo].tsx  │ Detalhe (status, validade, ações)                              │
    ├────────────────────┼───────────────────────┼────────────────────────────────────────────────────────────────┤
    │ /camera/[tipo]     │ camera/[tipo].tsx     │ Wizard câmera (preparo → foto → preview → confirmação)         │
    ├────────────────────┼───────────────────────┼────────────────────────────────────────────────────────────────┤
    │ /guia/[tipo]       │ guia/[tipo].tsx       │ "Como consigo este documento"                                  │
    ├────────────────────┼───────────────────────┼────────────────────────────────────────────────────────────────┤
    │ /practice          │ practice.tsx          │ Tela do modo prática                                           │
    └────────────────────┴───────────────────────┴────────────────────────────────────────────────────────────────┘

    Estilos isolados em apps/mobile/styles/*Styles.ts (um arquivo por tela). Componentes visuais reusáveis em apps/mobile/design/components/ e
    apps/mobile/components/ (AudioPlayer, BackButton, PracticeModeIndicator).

    Conexão front ↔ SQLite

    A camada de dados está toda em apps/mobile/src/:

    - src/db/index.ts — abre agricultores.db e cria as tabelas (users, properties, documents, educational_contents, user_content_progress,
    sync_queue). Exporta o singleton agricultoresDb.
    - src/db/operations.ts — helper saveAndEnqueue(table, op, payload) que insere/atualiza/deleta e já enfileira na sync_queue. ⚠️  Na prática as
    telas não estão usando esse helper — escrevem direto, o que cria duplicação.
    - src/services/photo.ts — processAndSavePhoto: redimensiona/compacta foto (expo-image-manipulator) → UPDATE documents → INSERT sync_queue.
    - src/services/sync.ts — syncQueue: drena sync_queue, faz upload da foto pro Firebase Storage e replica no Firestore.
    - src/services/notificacoes.ts — agenda alertas locais 30/15/7 dias antes do vencimento.
    - src/contexts/PracticeMode.tsx + src/hooks/usePracticeMode.ts + src/mocks/practiceData.ts — modo prática puramente em memória, nunca toca
    SQLite.

    Quem escreve no SQLite (inputs do front → DB)

    ┌─────────────────────────────────────┬─────────────────────────────────────────────────┬──────────────────────────┐
    │                Input                │                  Arquivo:linha                  │          Tabela          │
    ├─────────────────────────────────────┼─────────────────────────────────────────────────┼──────────────────────────┤
    │ Nome do agricultor (onboarding)     │ app/onboarding.tsx:152 (INSERT) e :158 (UPDATE) │ users                    │
    ├─────────────────────────────────────┼─────────────────────────────────────────────────┼──────────────────────────┤
    │ Consentimento LGPD                  │ mesmo lugar                                     │ users.consentimento_lgpd │
    ├─────────────────────────────────────┼─────────────────────────────────────────────────┼──────────────────────────┤
    │ Foto de documento (criação inicial) │ app/camera/[tipo].tsx:77                        │ documents                │
    ├─────────────────────────────────────┼─────────────────────────────────────────────────┼──────────────────────────┤
    │ Foto processada + validade          │ src/services/photo.ts:12                        │ documents + sync_queue   │
    └─────────────────────────────────────┴─────────────────────────────────────────────────┴──────────────────────────┘

    Quem só lê do SQLite

    ┌─────────┬────────────────────────────────┬────────────────────────────────────────┐
    │  Tela   │         Arquivo:linha          │                 Query                  │
    ├─────────┼────────────────────────────────┼────────────────────────────────────────┤
    │ Home    │ app/(tabs)/index.tsx:59-69     │ nome do user + status dos 5 documentos │
    ├─────────┼────────────────────────────────┼────────────────────────────────────────┤
    │ Detalhe │ app/documento/[tipo].tsx:60-63 │ último doc daquele tipo                │
    └─────────┴────────────────────────────────┴────────────────────────────────────────┘

    Observações que podem virar tarefas

    1. Inconsistência: saveAndEnqueue existe mas ninguém chama — câmera e onboarding fazem SQL inline. Vale unificar.
    2. App.tsx morto — index.ts chama App.tsx, mas o main aponta pra expo-router/entry, então esse App.tsx nunca roda. Pode deletar.
    3. syncQueue engole erros (catch {} vazio em services/sync.ts:83) — falhas de upload somem silenciosamente.
    4. Telefone hardcoded em app/index.tsx:10 (+5591900000001) e OTP 123456 em app/otp.tsx:11 — provavelmente para testes, lembrar de remover.

    Me diz o que tu quer alterar que eu mexo no lugar certo.