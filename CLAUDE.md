# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Project Overview

Mobile app to assist family farmers in Jutaí with document regularization (CAF, CAR, CCIR, ITR, NFA-e). MVP deadline: 2026-05-18. Full task breakdown by phase in `todo_mvp.md`.

## Repo Layout

pnpm monorepo (workspaces in `pnpm-workspace.yaml`). The only workspace is the mobile app:

- `apps/mobile/` — **the deliverable**. React Native + Expo app. Contains `App.tsx`, `index.ts` (Expo entry), `app.json`, `eas.json`, `google-services.json`, `assets/`, ESLint + Prettier config. Run all `expo`/`eas` commands from here (or via `pnpm --filter mobile`).

Root-only files: `todo_mvp.md` (phased task list), `conventions.md` (full coding/branch/PR rules), `DATABASE.md` (local SQLite schema), `CLAUDE.md`, `README.md`, `LICENSE`, `.gitmessage`, `.github/`.

## Package Manager

**pnpm only** — never npm or yarn. All dependencies are installed via pnpm at the root.

## Stack

- **Mobile**: React Native + TypeScript + Expo (managed workflow with development builds)
- **Cloud services (Firebase)**: Firestore (remote sync target), Auth (phone OTP via SMS), Storage, Crashlytics
- **Local DB**: expo-sqlite (no pending-op limit; custom sync layer pushes to Firestore on reconnect)
- **Navigation**: React Navigation or Expo Router (decision pending in Phase 1)
- **Camera/Audio/Notifications**: expo-camera, expo-av, expo-notifications, expo-image-manipulator
- **Builds**: EAS Build + EAS Submit
- **OTA updates**: expo-updates
- **Tests**: Jest + Detox

## Critical Constraint: No Expo Go

`@react-native-firebase` requires native modules unavailable in Expo Go. Always use **development builds** (`expo-dev-client`) from the start. Never suggest or test with Expo Go.

## Common Commands

Run from repo root using pnpm filters (or `cd` into the workspace):

```bash
# Install / update deps for the entire monorepo
pnpm install

# Mobile dev server (requires dev build installed on device)
pnpm --filter mobile start

# Mobile EAS builds
pnpm --filter mobile exec eas build --profile development --platform android
pnpm --filter mobile exec eas build --profile preview --platform android
pnpm --filter mobile exec eas build --profile production --platform android

# Mobile lint / format
pnpm --filter mobile lint
pnpm --filter mobile format
```

## Key Architectural Decisions

**Authentication**: Firebase Auth with phone number OTP (SMS). Session tokens stored via `expo-secure-store`. Auto-lock timeout required (RNF18).

**Offline-first**: SQLite (`expo-sqlite`) is the source of truth for all local data. Writes should go through `saveAndEnqueue` in `src/db/operations.ts`, which writes to the target table and appends to `sync_queue`. `src/services/sync.ts` consumes the queue on reconnect (NetInfo subscriber wired in `app/_layout.tsx`). Firestore is only the remote backend (auth, storage, sync target) — not a local cache. Heads-up: a couple of call sites (e.g. `app/camera/[tipo].tsx:78`) still insert directly without enqueueing — refactor through `saveAndEnqueue` when touching them.

**Photo pipeline**: expo-camera → expo-image-manipulator (resize to 800px width + JPEG compress 0.75; re-encode strips EXIF/GPS) → URI saved in SQLite `documents.file_url` with `sincronizado = 0` and an `update` row in `sync_queue` → on reconnect, `sync.ts` runs `storage().ref('documents/<id>').putFile(uri)`, then updates `documents.storage_url` and sets `sincronizado = 1`. Always strip GPS metadata (LGPD/privacy requirement).

**Audio**: All instructions are narrated in Portuguese with a Paraense regional accent. Every screen has an `AudioPlayer` component (expo-av) in a fixed position, with autoPlay only on first visit (flag tracked in SQLite). Audio files are MP3 64kbps, bundled in `apps/mobile/assets/`.

**Navigation pattern**: Wizard-style (one action per screen). No swipe-back gestures (`gestureEnabled: false`). Minimum touch target: 56dp (RNF05/RNF06).

**Document status colors**: cinza (no data) → vermelho (expired) → amarelo (expiring ≤30 days) → verde (valid).

**Practice mode**: Uses in-memory React state only — never touches SQLite or Firestore. Visually differentiated with a border/background indicator.

**LGPD compliance**: Consent requested via audio during onboarding and recorded in SQLite. Full data deletion (SQLite DB, Storage files, Firestore docs, Auth account, secure store, scheduled notifications) available from the help screen. Current state of this flow (audit 2026-05-19): the help-screen button exists and `apagarTodosDados` covers SQLite + SecureStore + signOut + cancel notifications, but (a) the modal confirm button at `app/(tabs)/ajuda.tsx:149` is wired to `fecharModal` instead of `apagarTodosDados`, and (b) Firestore docs, Storage files, and `auth().currentUser.delete()` are not yet covered. Consent itself is only persisted as `onboarding_done='1'` in SecureStore — the `users.consentimento_lgpd` column is currently never set.

**Tutorial system**: `src/contexts/TutorialContext.tsx` drives a guided overlay (`components/TutorialOverlay.tsx`) that walks the user through home → tabs → document detail. Each highlighted region uses `<TutorialGlow>` (`components/TutorialGlow.tsx`) — a pulsing teal halo backed by `src/hooks/useGlowPulse.ts`. Entry points: onboarding final step, Ajuda tab ("Tutorial do app"), and the trilha ("Tutorial do app" button below the subtitle).

**Roadmap / Trilha do agricultor**: `app/roadmap/index.tsx` renders the path of 5 educational topics. Content is normalized across two tables: `educational_contents` (one row per topic — `title`, `category`, `hero`, `resumo`, `chapter`, `position`; id is deterministic = category, e.g. `'CAR'`; topics are grouped into chapters and ordered by `chapter` then `position`) and `content_sections` (1→N rows per topic — `icon`, `title`, `body`, `position`). `src/db/seedEducationalContents` populates both tables idempotently from the authoring source `src/data/roadmapContent.ts` (runs every launch, reflects content edits). `app/roadmap/[id].tsx` reads the topic + its sections from the DB. Narrated audio is normalized into the `audios` table (`file_key`, `name`); `educational_contents.audio_id` is a nullable FK to it. Since RN `require()` must be a static literal, the DB stores a `file_key` resolved via the static registry `src/data/audioRegistry.ts` (audios are bundled in `assets/audio/`); only CAR/CCIR/ITR have audio today. Per-user completion lives in `user_content_progress`, keyed by `content_id` (= the deterministic topic id) and filtered by `auth().currentUser.uid` (`src/services/progress.ts`); practice mode keeps a parallel in-memory `Set` via `PracticeModeContext`. CAF has a topic row but no sections yet (shows "Conteúdo em breve").

**NFA-e (electronic invoice) flow**: emission service in `src/services/emissaoNfae.ts` is currently a mock — `emitirNotaFiscal` has a 1.5s simulated delay and generates a 6-digit number + 44-digit access key. Replace the body of that function with the real HTTP call when the API exists; the rest of the app doesn't need to change. Notes are persisted in `notas_fiscais` (status `pendente` until emitted, `emitida` after). Pending notes are processed by `processarFilaEmissao`, triggered on NetInfo reconnect in `app/_layout.tsx` (same listener that calls `syncQueue`). The "Emitir nova nota" button on the Notas tab is **gated by `certificado_digital`** — without a registered A1 certificate the button is disabled. Certificate password is stored in `expo-secure-store` (key `certificado_senha`); the rest of the cert metadata (filename, validity) lives in the `certificado_digital` SQLite table (single-row: existing rows are deleted before insert). The cert itself is mocked today — there's no actual `.pfx` upload or NFA-e signing yet.

**Typography**: Two font families bundled via `@expo-google-fonts`: `Inter` (`fonts.body`, `bodyMedium`, `bodySemi`, `bodyBold`) for body/UI text, and `Inconsolata` (`fonts.mono`, `monoSemi`) for headings and emphasis. Defined in `apps/mobile/design/theme/typography.ts`, loaded in `app/_layout.tsx`. **Pitfall**: never combine `fontFamily` with `fontWeight` in styles — RN Google Fonts loads each weight as a separate font file (e.g. `Inter_700Bold`), so adding `fontWeight: '700'` to a style that already uses `fontFamily: fonts.mono` makes the OS look for a bold variant of *that exact filename*, fail, and silently fall back to the system default (Roboto on Android, SF on iOS). Pick the right named font instead (e.g. `fonts.monoSemi`, `fonts.bodyBold`). Playfair Display was removed in May 2026 — don't reintroduce serif fonts without a discussion.

**Local SQLite schema**: All app data lives in `expo-sqlite`, with tables created as raw SQL in `apps/mobile/src/db/index.ts`. See `DATABASE.md` for the documented table reference (users, properties, documents, buyers, sales, educational_contents, user_content_progress).

## Firebase Setup

- `apps/mobile/google-services.json` referenced via `apps/mobile/app.json` → `expo.android.googleServicesFile`
- Each `@react-native-firebase` module requires its config plugin declared in `apps/mobile/app.json`
- Firestore security rules: users can only read/write their own documents (`/agricultores/{userId}`)
- Storage rules: users can only access their own files

## Conventions

Full details in `conventions.md`. Summary:

**Branches**: `main` (stable), `dev` (active integration), `feature/*` (new features), `fix/*` (bug fixes).

**Commits** — Conventional Commits format (Portuguese, optional emoji prefix matching existing history):

```
feat: adicionar autenticação por telefone
fix: corrigir erro ao salvar documento
chore: ajustar configuração do EAS
refactor: simplificar lógica de sincronização
docs: atualizar README
```

**PRs**: minimum 1 approval, no self-approval, keep PRs under ~300 lines.

## Performance Targets

- App load: < 3 seconds on entry-level device (2 GB RAM, 32 GB storage, 6" screen)
- Interaction latency: < 300ms (RNF13)
- APK universal size: ≤ 20 MB (RNF02)
