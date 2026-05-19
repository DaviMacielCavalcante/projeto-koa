# TODO — MVP Aplicativo Facilitador para Agricultores Familiares de Jutaí

**Prazo de entrega**: 18 de maio de 2026
**Data de início**: 27 de abril de 2026
**Dias úteis disponíveis**: ~15 dias

**Stack definida**:
- Plataforma: React Native + TypeScript + Expo (managed workflow com development builds)
- Backend: Firebase (Firestore + Auth + Storage)
- Banco local: expo-sqlite
- Autenticação: Firebase Auth — phone OTP via SMS
- Câmera: expo-camera
- Áudio: expo-av
- Notificações locais: expo-notifications
- Compressão de imagem: expo-image-manipulator
- Navegação: React Navigation (ou Expo Router)
- Build e distribuição: EAS Build + EAS Submit
- Monitoramento: Firebase Crashlytics + Analytics (via @react-native-firebase)
- Testes: Jest + Detox
- Atualizações OTA: expo-updates (correções sem redistribuir APK)

**Observações importantes**:
- Expo Go NÃO pode ser usado neste projeto. O @react-native-firebase exige módulos nativos que não estão no Expo Go. Usar development builds (expo-dev-client) desde o início.
- O banco local SQLite (expo-sqlite) não tem limite de operações pendentes. A sync com Firestore é customizada: gravar localmente primeiro, depois subir para o Firestore quando houver conexão.
- O APK universal (compartilhado via WhatsApp) pode ultrapassar 20 MB. O download via Play Store será menor graças a App Bundles.

---

## Status atual da auditoria (varredura no código)

**Pronto e funcionando** (núcleo navegável):
- Auth phone OTP + timeout de sessão (30 min idle)
- SQLite com 7 tabelas (users, properties, documents, educational_contents, user_content_progress, sync_queue, nfae_rascunhos)
- Pipeline de fotos (resize 800px + JPEG compress 0.75 + sync queue → Storage)
- Notificações locais com deep linking pro detalhe do documento
- Tabs (Início, Outros, Avisos, Ajuda) + telas de detalhe, guia, FAQ, câmera, perfil, roadmap, NFA-e
- Onboarding com auto-save por etapa em SecureStore
- Modo prática isolado em memória
- Trilha do agricultor com progresso por usuário (`user_content_progress` + sync queue)
- Tutorial guiado (TutorialOverlay + TutorialGlow com efeito de brilho teal pulsante)
- Sync queue processada via NetInfo ao reconectar

**Bloqueios críticos pré-entrega**:
1. **Bug na exclusão LGPD** (`app/(tabs)/ajuda.tsx:149`) — o botão "Apagar tudo" do modal de confirmação chama `fecharModal` em vez de `apagarTodosDados`. Função existe, está desconectada. UC10 é requisito de compliance.
2. **Exclusão LGPD incompleta** — mesmo se conectada, a função só limpa SQLite + SecureStore. Falta Firestore (batch delete), Storage (fotos), `auth().currentUser.delete()`.
3. **Consentimento LGPD não persiste no SQLite** — `consentimento_lgpd` da tabela `users` nunca é preenchido; hoje só existe a flag `onboarding_done` no SecureStore.
4. **Áudios narrados não existem** — só há 1 MP3 placeholder de notificação (`829108__jamm__...mp3`). Toda a UX de narração em paraense (RNF16) está pendente: onboarding, LGPD, 5 documentos, 5 guias, 5 confirmações, alertas, modo prática, exclusão, auth.
5. **Telefones placeholder** — `EMATER_TEL = 'tel:+5591XXXXXXXX'` e `INCRA_TEL = 'tel:+5500XXXXXXXX'` em `app/guia/[tipo].tsx`. RF15 quebra ao clicar.
6. **Educational contents sem `body`** — o seed só insere título; o conteúdo rico vive em `src/data/roadmapContent.ts` (objeto JS), não migrado pra coluna `body`.

**Pontos de atenção (não bloqueiam, mas precisam decisão)**:
- Inserts em `camera/[tipo].tsx:78` e no botão de teste em `ajuda.tsx` criam linhas em `documents` direto via `runAsync` sem passar por `saveAndEnqueue` — escapam da sync_queue. Considerar refatorar.
- Reagendamento de notificações vencidas usa `TIME_INTERVAL` de 10 segundos (`repeats: true`) — útil pra desenvolvimento, mas em produção vira spam. Trocar pra DATE diário.
- Regras de segurança do Firestore/Storage não foram revisadas neste audit (estão fora do código fonte mobile).

---

## Fase 0 — Preparação (27/04 – 29/04)

- [x] Definir stack tecnológica com a equipe
- [x] Criar projeto Expo com TypeScript: npx create-expo-app@latest --template blank-typescript
- [x] Configurar repositório (README, .gitignore, estrutura de pastas)
- [x] Instalar expo-dev-client: npx expo install expo-dev-client
- [x] Configurar ESLint + Prettier com regras do projeto
- [x] Definir convenções do projeto (branching, commits, code review)
- [x] Configurar ambiente de desenvolvimento local de cada membro da equipe
- [x] Criar projeto Firebase (console.firebase.google.com)
- [x] Ativar Firebase Auth com provider Phone (SMS OTP)
- [x] Criar banco Firestore com regras de segurança iniciais
- [x] Ativar Firebase Storage (para fotos de documentos sincronizadas)
- [x] Ativar Firebase Crashlytics
- [x] Baixar google-services.json e configurar em app.json (expo.android.googleServicesFile)
- [x] Instalar módulos Firebase:
  - npx expo install @react-native-firebase/app
  - npx expo install @react-native-firebase/auth
  - npx expo install @react-native-firebase/firestore
  - npx expo install @react-native-firebase/storage
  - npx expo install @react-native-firebase/crashlytics
- [x] Configurar config plugins no app.json para cada módulo Firebase
- [x] Instalar expo-build-properties e configurar useFrameworks se necessário
- [x] Gerar primeiro development build via EAS Build: eas build --profile development --platform android
- [x] Instalar development build em dispositivo de teste e validar que o app abre
- [x] Instalar módulos Expo do MVP:
  - npx expo install expo-camera
  - npx expo install expo-av
  - npx expo install expo-notifications
  - npx expo install expo-image-manipulator
  - npx expo install expo-sqlite
  - npx expo install expo-file-system
  - npx expo install expo-linking
  - npx expo install expo-secure-store
- [x] Configurar EAS Build (eas.json com profiles: development, preview, production)
- [ ] Levantar e organizar os arquivos de áudio conforme necessário durante a implementação de cada tela
- [x] Decidir sobre RF08 no MVP: botão "Falar com a cooperativa" NÃO entra no MVP — UC02 terá apenas "Ligar pra EMATER"

---

## Fase 1 — Infraestrutura base (30/04 – 03/05)

### SQLite e armazenamento

- [x] Inicializar banco SQLite com expo-sqlite (SQLite.openDatabaseAsync('agricultores.db'))
- [x] Criar e migrar tabelas SQLite:
  - Tabela "users": id (UUID PK), name, phone (único), municipality, consentimento_lgpd (integer 0/1), onboarding_concluido (integer 0/1), created_at, updated_at
  - Tabela "properties": id (UUID PK), user_id (FK → users), name, area_hectares, location, created_at, updated_at
  - Tabela "documents": id (UUID PK), user_id (FK → users), property_id (FK → properties, nullable), type (ENUM: CAF/CAR/CCIR/ITR/NFA-e), number, issue_date, expiration_date, file_url (URI local), storage_url (URL Firebase Storage, nullable), status (active/expiring_soon/expired — renderizado como verde/amarelo/vermelho; cinza quando nulo), sincronizado (integer 0/1), created_at, updated_at
  - Tabela "educational_contents": id (UUID PK), title, body (texto narrado), category (ex: documentos, onboarding), created_at, updated_at
  - Tabela "user_content_progress": id (UUID PK), user_id (FK → users), content_id (FK → educational_contents), read_at, created_at, updated_at
  - Tabela "sync_queue": id (UUID PK), tabela, operacao (insert/update/delete), payload (JSON), created_at
- [x] Configurar regras de segurança do Firestore (agricultor só acessa seus próprios dados — ainda usado para auth e storage)
- [x] Configurar Firebase Storage com regras de segurança (agricultor só acessa suas próprias fotos)
- [x] Implementar pipeline de foto:
  - Captura via expo-camera
  - Compressão via expo-image-manipulator (resize + compress) ✓ (serviço criado em src/services/photo.ts)
  - Remoção de metadados de localização via expo-image-manipulator ✓ (serviço criado em src/services/photo.ts)
  - Salvamento do URI local na coluna file_url da tabela "documents" do SQLite com sincronizado = 0 ✓ (serviço criado em src/services/photo.ts)
  - Upload ao Firebase Storage quando houver conexão; atualizar storage_url e sincronizado = 1 ✓ (implementado em src/services/sync.ts)
- [ ] Implementar auto-salvamento de progresso parcial via SQLite (RF14) — onboarding salva em SecureStore (não SQLite); câmera não tem auto-save durante captura

### Autenticação (Firebase Auth — SMS OTP)

- [x] Implementar tela de autenticação por número de telefone (campo numérico grande, máscara de telefone BR)
- [x] Implementar envio de código OTP via SMS (@react-native-firebase/auth verifyPhoneNumber)
- [x] Implementar tela de inserção do código recebido (campo numérico grande, 6 dígitos)
- [x] Implementar confirmação e criação de sessão
- [ ] Implementar tratamento de erros com áudio (número inválido, código expirado, sem sinal para receber SMS) — Alert implementado, falta áudio
- [x] Implementar timeout de sessão com auto-lock usando expo-secure-store para armazenar token (RNF18) — 30 min idle em `app/_layout.tsx`
- [ ] Testar fluxo completo de auth em dispositivo real via development build

### Sincronização (SQLite local + Firestore remoto)

- [x] Implementar SyncService: ao reconectar, percorrer sync_queue do SQLite e aplicar operações no Firestore — `src/services/sync.ts`
- [x] Implementar listener de estado de conexão (NetInfo ou firebase.database().ref('.info/connected')) — NetInfo subscriber em `app/_layout.tsx`
- [ ] Garantir que todas as escritas gravam no SQLite primeiro e enfileiram na sync_queue com sincronizado = 0 — `saveAndEnqueue` existe em `src/db/operations.ts`, mas inserts diretos em `camera/[tipo].tsx` (linha 78) e em `ajuda.tsx` (CAF de teste) ainda não passam pelo helper
- [ ] Implementar lógica de retry com backoff exponencial para itens da sync_queue que falharem — retry passivo implementado (itens ficam na fila), sem backoff real
- [ ] Implementar indicador visual discreto de status de conexão (opcional para o MVP)
- [ ] Testar cenário: criar dados offline → reconectar → verificar sync no console Firebase

---

## Fase 2 — Telas e navegação (04/05 – 08/05)

### Navegação geral

- [x] Instalar e configurar navegação (opções: React Navigation ou Expo Router)
  - Se React Navigation: npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack react-native-screens react-native-safe-area-context
  - Se Expo Router: já incluído no Expo, configurar app directory
- [x] Implementar barra de navegação inferior fixa (4 ícones: início, documentos, avisos, ajuda)
- [x] Implementar botão "Voltar" fixo no canto superior esquerdo em todas as telas — componente BackButton com router.back() padrão
- [x] Garantir que todos os alvos de toque tenham no mínimo 56dp (RNF05)
- [x] Garantir que nenhuma tela exija gestos além de toque simples (RNF06) — desativar swipe-back: screenOptions={{ gestureEnabled: false }}
- [x] Implementar navegação wizard (uma ação por tela → próximo) — onboarding e câmera usam etapas sequenciais

### Componente reutilizável de áudio (usado em todas as telas)

- [x] Criar componente AudioPlayer com expo-av:
  - Props: source (arquivo de áudio), autoPlay (boolean), onFinish (callback)
  - Estado: playing, paused, stopped
  - Botão de play (alto-falante) — posição fixa na tela, mesmo lugar em todas as telas
  - Botão de pular/parar (ícone avançar)
  - Carregamento do áudio via Audio.Sound.createAsync()
  - Liberação de recursos via sound.unloadAsync() no cleanup
- [ ] Testar reprodução em dispositivo de entrada (volume, latência)

### UC07 — Onboarding inicial (RF13, RF13.1, RF13.2, RF12)

- [x] Implementar tela de boas-vindas com narração via componente AudioPlayer (autoPlay: true) — AudioCircle animado com placeholder de áudio
- [x] Implementar criação de avatar/identificação (nome por voz ou digitação) — etapa de perfil com TextInput
- [x] Implementar apresentação de funcionalidades uma a uma com narração e ilustrações — 4 slides com ilustrações visuais compostas
- [x] Implementar convite para modo prática ao final do onboarding
- [x] Implementar solicitação de consentimento LGPD em áudio (RNF08) — etapa LGPD com card de consentimento
- [x] Implementar botão "Avançar" para pular etapa individual (RF13.1)
- [x] Implementar botão "Pular tudo" para encerrar onboarding (RF13.1)
- [x] Implementar auto-salvamento se o agricultor for interrompido durante o onboarding (RF14) — progresso salvo em SecureStore a cada etapa
- [x] Implementar re-acesso ao onboarding via botão de ajuda na tela inicial (RF13.2)
- [ ] Implementar seleção de etapa específica para re-assistir (RF13.2)
- [x] Salvar flag de onboarding concluído na coluna onboarding_concluido da tabela "users" no SQLite

### UC08 parcial — Modo prática (RF12)

- [x] Implementar modo prática com dados fictícios (estado em memória via React state, sem tocar no Firestore)
- [x] Implementar identidade visual diferenciada (banner dourado no topo indicando modo prática)
- [ ] Implementar áudio explicando que nada será salvo de verdade — `src/services/practiceAudio.ts` é placeholder com `console.log`, sem áudio real
- [x] Implementar botão "Voltar pro app de verdade" — botão "Sair" no banner
- [x] Garantir que nenhum dado real é afetado pelo modo prática — mockDocuments em memória, SQLite não é tocado

### UC01 — Painel de regularização (RF01, RF02, RF02.1, RF02.2)

- [x] Implementar tela inicial com saudação e avatar do agricultor (dados da tabela "users" no SQLite)
- [x] Implementar cinco indicadores visuais (círculos) para CAF, CAR, CCIR, ITR, NFA-e
- [x] Implementar lógica de cores dos indicadores baseada em documents.status e documents.expiration_date do SQLite (active→verde, expiring_soon→amarelo, expired→vermelho, nulo→cinza)
- [x] Implementar navegação do indicador para tela de detalhe do documento ao toque
- [x] Implementar tela de detalhe do documento com ilustração e status
- [x] Implementar AudioPlayer para explicação em áudio (RF02)
- [ ] Implementar reprodução automática do áudio apenas na primeira visita — registrar em user_content_progress (RF02)
- [x] Implementar botão de pular/interromper áudio via AudioPlayer (RF02.1)
- [x] Implementar botão de play permanente e na mesma posição via AudioPlayer (RF02.2)
- [x] Implementar três botões na tela de detalhe: "Como consigo?", "Tenho dúvida", "Já tenho, quero guardar"

### UC02 — Guia passo a passo (RF03, RF15)

- [ ] Implementar tela do guia com imagem estática do escritório da EMATER em Moju
- [x] Implementar exibição de horário de funcionamento — `HORARIO_PADRAO` ('Segunda a sexta, das 8h às 14h') em `app/guia/[tipo].tsx`
- [x] Implementar lista visual do que levar (ícones + rótulo curto para RG, CPF, conta de luz) — objeto `GUIAS` em `app/guia/[tipo].tsx`
- [x] Implementar botão "Ligar pra EMATER" com Linking.openURL('tel:NUMERO') via expo-linking (RF15) — número pendente de confirmação (placeholders `+5591XXXXXXXX` / `+5500XXXXXXXX`)
- [ ] Implementar AudioPlayer para instruções narradas — `app/guia/[tipo].tsx` não importa nem renderiza AudioPlayer

### UC03 — Fotografar e armazenar documento (RF04, RF05, RF14)

- [x] Implementar botão "Já tenho, quero guardar" na tela de detalhe do documento
- [x] Implementar abertura da câmera via expo-camera com instrução simples no topo ("Tire uma foto do seu documento")
- [x] Implementar botão de captura grande e circular (CameraCapturedPicture via takePictureAsync())
- [x] Implementar tela de pré-visualização com botões "Ficou bom" e "Tirar de novo"
- [x] Implementar pipeline pós-captura:
  - Compressão via ImageManipulator.manipulateAsync() (resize + compress 0.75)
  - Remoção de EXIF/GPS via ImageManipulator
  - Salvamento local do URI na coluna file_url da tabela "documents" no SQLite
  - Upload ao Firebase Storage quando houver conexão (reference.putFile()); atualizar storage_url e sincronizado = 1
- [x] Implementar atualização do status do documento no Firestore para "verde" após salvar
- [ ] Implementar confirmação em áudio via AudioPlayer ("Pronto, seu [documento] tá guardado")
- [x] Implementar organização por categoria: agricultor acessa documento em no máximo 2 toques (RF05)
- [ ] Implementar auto-salvamento se interrompido durante captura (RF14)
- [ ] Implementar aviso em áudio se armazenamento estiver cheio (FileSystem.getFreeDiskStorageAsync() via expo-file-system)

### UC05 — Alertas de prazo (RF06)

- [x] Configurar expo-notifications:
  - Solicitar permissão: Notifications.requestPermissionsAsync()
  - Configurar canal de notificação Android: Notifications.setNotificationChannelAsync()
- [x] Implementar agendamento de notificações locais baseado em documents.expiration_date do SQLite:
  - Notifications.scheduleNotificationAsync() com trigger de data
  - Reagendar quando o agricultor abrir o app (recalcular prazos)
  - Reagendar ao salvar foto (câmera chama agendarAlertas após confirmar)
- [x] Implementar mudança automática de cor do indicador (verde → amarelo → vermelho) baseada na data atual vs. data de vencimento
- [x] Implementar conteúdo da notificação com nome do agricultor + nome do documento
- [x] Implementar deep linking: toque na notificação abre tela de detalhe do documento correspondente
- [x] Implementar reemissão diária do alerta enquanto o documento permanecer vencido
- [x] Implementar antecedência padrão de 30 dias

---

## Fase 3 — LGPD e segurança (09/05 – 10/05)

### UC10 — Excluir dados pessoais (RNF08)

- [x] Implementar botão "Apagar meus dados" na tela de ajuda (ícone de lixeira) — botão "Apagar todos os meus dados" em `app/(tabs)/ajuda.tsx`
- [ ] Implementar explicação em áudio via AudioPlayer sobre o que será apagado — modal só tem texto + ícone, sem áudio
- [x] Implementar confirmação com botões "Sim, apagar tudo" e "Não, voltar" — modal com countdown de 5s
- [ ] **BUG**: botão "Apagar tudo" do modal chama `fecharModal` em vez de `apagarTodosDados` (`app/(tabs)/ajuda.tsx:149`) — a função existe mas está desconectada
- [ ] Implementar exclusão de dados no Firestore (document delete por batch) — `apagarTodosDados` só deleta SQLite + SecureStore, não toca em Firestore
- [ ] Implementar exclusão de fotos no Firebase Storage — não implementado
- [ ] Implementar exclusão de conta no Firebase Auth (user.delete()) — apenas `signOut()`, sem `delete()`
- [x] Implementar exclusão do banco SQLite local — `DELETE FROM` para cada tabela (`ajuda.tsx:29-31`); não usa `SQLite.deleteDatabaseAsync` mas o efeito é equivalente
- [x] Implementar cancelamento de todas as notificações agendadas (Notifications.cancelAllScheduledNotificationsAsync())
- [x] Implementar limpeza de dados locais no expo-secure-store — `last_active`, `onboarding_done`, `onboarding_progress`
- [x] Implementar retorno ao estado inicial (tela de autenticação) após exclusão — `router.replace('/')`

### Revisão de segurança

- [ ] Revisar regras de segurança do Firestore (agricultor só lê/escreve seus próprios dados)
- [ ] Revisar regras de segurança do Firebase Storage (agricultor só acessa suas próprias fotos)
- [x] Verificar que toda comunicação usa HTTPS (Firebase SDK faz isso por padrão) (RNF09)
- [ ] Verificar que metadados GPS são removidos de todas as fotos via expo-image-manipulator (RNF08) — re-encode JPEG remove EXIF na prática, mas falta teste explícito
- [ ] Verificar que o consentimento LGPD é solicitado em áudio e registrado na coluna consentimento_lgpd da tabela "users" no SQLite — hoje a flag só é salva como `onboarding_done='1'` no SecureStore; a coluna `consentimento_lgpd` da tabela `users` nunca é preenchida
- [x] Verificar que o timeout de sessão está funcionando via expo-secure-store (RNF18) — 30 min idle implementado em `app/_layout.tsx:44-50`

---

## Fase 4 — Áudio e conteúdo (07/05 – 12/05, paralelo às fases 2-3)

### Produção de áudio

- [ ] Escrever roteiro de todos os áudios do MVP:
  - Onboarding: boas-vindas, explicação de cada funcionalidade, convite pro modo prática, consentimento LGPD
  - Documentos: explicação do CAF, CAR, CCIR, ITR, NFA-e (5 áudios de ~30s cada)
  - Guias: instruções de como obter cada documento (5 áudios)
  - Confirmações: "Pronto, seu [documento] tá guardado" (5 variações)
  - Alertas: "[Nome], seu [documento] precisa ser renovado em [X] dias"
  - Modo prática: "Você está no modo prática, nada será salvo de verdade"
  - Exclusão: "Todos os seus dados serão apagados permanentemente"
  - Auth: "Digite seu número de telefone", "Digite o código que você recebeu por mensagem"
- [ ] Gravar áudios em português com sotaque regional paraense (RNF16)
- [ ] Comprimir áudios para formato leve (MP3 64kbps, ~240 KB por áudio de 30s)
- [ ] Colocar áudios na pasta assets/ do projeto (embutidos no bundle)
- [ ] Testar carregamento e reprodução via expo-av em dispositivo de entrada
- [ ] Popular tabela "educational_contents" no SQLite com os roteiros de cada áudio (title, body, category) — `src/db/seedEducationalContents.ts` semeia 5 títulos (CAF/CAR/CCIR/ITR/NFA-e) com `body` vazio; o conteúdo rico vive em `src/data/roadmapContent.ts` e ainda não foi migrado pra `body`
- [x] Garantir que user_content_progress é registrado ao concluir cada conteúdo (read_at preenchido no SQLite) — `src/services/progress.ts:marcarComoConcluido` insere com `read_at` e enfileira em `sync_queue`

### Conteúdo dos guias

- [ ] Pesquisar e confirmar endereço e horário do escritório da EMATER em Moju
- [ ] Pesquisar e confirmar telefone da EMATER em Moju
- [ ] Criar imagem estática da localização do escritório
- [ ] Documentar lista correta do que levar para cada documento (CAF, CAR, CCIR, ITR, NFA-e)
- [ ] Definir prazos de vencimento padrão para cada documento

### Ícones e ilustrações

- [x] Criar ou selecionar ícones semi-realistas para os 5 documentos — `assets/docs/CAF.png`, `car.png`, `CCIR.png`, `ITR.png` (NFA-e ainda pendente)
- [x] Criar ou selecionar ícones de navegação (casa, caderno, sino, interrogação) — Ionicons (`home-outline`, `book-outline`, `notifications-outline`, `help-circle-outline`) em `app/(tabs)/_layout.tsx`
- [x] Criar ou selecionar ilustrações para as telas de detalhe de cada documento — reutiliza os PNGs de `assets/docs/` na hero da tela de detalhe
- [x] Criar ou selecionar ícones para a lista do que levar (RG, CPF, conta de luz) — Ionicons mapeados no objeto `GUIAS` (`card`, `id-card`, `document`, `home`, `map`, `cash`, `storefront`, `navigate`, `people`)
- [ ] Validar ícones com pelo menos 2-3 pessoas fora da equipe para testar compreensão

---

## Fase 5 — Testes (13/05 – 15/05)

### Testes funcionais

- [ ] Gerar build de preview via EAS: eas build --profile preview --platform android
- [ ] Testar fluxo completo: auth SMS → onboarding → painel → detalhe → guia → fotografar → confirmar → indicador verde
- [ ] Testar pular onboarding e verificar que todas as funcionalidades estão acessíveis
- [ ] Testar re-acesso ao onboarding via botão de ajuda
- [ ] Testar todos os áudios (play, pular, reprodução sob demanda) via componente AudioPlayer
- [ ] Testar fotografar documento, confirmar e verificar armazenamento
- [ ] Testar tirar foto de novo (fluxo "Tirar de novo")
- [ ] Testar alertas de prazo (simular documento com vencimento próximo e vencido)
- [ ] Testar exclusão de dados pessoais e retorno à tela de autenticação
- [ ] Testar modo prática (nenhum dado real afetado)
- [ ] Testar auto-salvamento (forçar interrupção durante captura de foto e durante onboarding)

### Testes de sincronização (SQLite + Firestore)

- [ ] Testar criação de dados em modo avião → verificar gravação no SQLite → reconectar → verificar sync_queue processada e dados no console Firebase
- [ ] Testar edição de dados offline → reconectar → verificar atualização no Firestore
- [ ] Testar captura de foto offline → verificar file_url salvo na tabela documents do SQLite → reconectar → verificar upload no Firebase Storage e storage_url atualizada
- [ ] Testar exclusão de dados offline → reconectar → verificar exclusão no Firestore
- [ ] Testar autenticação com SMS em área com sinal fraco

### Testes em dispositivo real

- [ ] Testar em smartphone de entrada (2 GB RAM, 32 GB armazenamento, tela 6")
- [ ] Verificar que o app carrega em menos de 3 segundos
- [ ] Verificar que nenhuma interação tem latência superior a 300ms (RNF13)
- [ ] Verificar tamanho do APK universal e do download via Play Store (meta: 20 MB ou menos) (RNF02)
- [ ] Testar com alguém fora da equipe de desenvolvimento (teste de usabilidade básico)

### Testes de acessibilidade

- [ ] Verificar que todas as telas são navegáveis apenas com toque simples
- [ ] Verificar que todos os botões têm pelo menos 56dp
- [ ] Verificar que os áudios são audíveis em ambiente externo (volume)
- [ ] Verificar contraste de cores (indicadores verde/amarelo/vermelho sobre fundo claro)

---

## Fase 6 — Ajustes finais e entrega (16/05 – 18/05)

- [ ] Corrigir bugs identificados nos testes
- [ ] Revisar todos os textos e áudios (ortografia, clareza)
- [ ] Gerar build de produção via EAS: eas build --profile production --platform android
- [ ] Testar build de produção em dispositivo real
- [ ] Configurar expo-updates para OTA updates pós-entrega
- [ ] Preparar documentação de entrega (README atualizado, instruções de instalação)
- [ ] Preparar apresentação do MVP para os colegas
- [ ] Disponibilizar pacote de instalação para download (link compartilhável via EAS ou direto)
- [ ] Entregar MVP

---

## Fora do MVP (backlog para versões futuras)

- [ ] RF07 — Caderneta digital de vendas e compras (UC04)
- [ ] RF08 — Contato direto com a cooperativa (UC11)
- [ ] RF09 — Módulo "Caminho da Cooperativa" (UC06)
- [ ] RF10 — Painel comunitário agregado (UC06)
- [ ] Autenticação via WhatsApp OTP (requer Twilio ou MessageBird + WhatsApp Business API)
- [ ] Mapas interativos offline (substituir imagem estática)
- [ ] Entrada por voz em campos de texto (expo-speech ou reconhecimento de fala)
- [ ] OCR offline para leitura automática de dados de documentos fotografados
- [ ] Criptografia local com SQLCipher (expo-sqlite não criptografa o banco local por padrão)
- [ ] Suporte a múltiplos idiomas regionais
- [ ] Co-design de ícones com agricultores reais de Jutaí
- [ ] Testes de usabilidade presenciais na comunidade de Jutaí
- [ ] Publicação na Google Play Store via EAS Submit
- [ ] Migrar para Expo Router se estiver usando React Navigation (simplificação)
