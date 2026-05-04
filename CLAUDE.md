# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Project Overview

Mobile app to assist family farmers in Jutaí with document regularization (CAF, CAR, CCIR, ITR, NFA-e). MVP deadline: 2026-05-18. Full task breakdown by phase in `todo_mvp.md`.

## Repo Layout

pnpm monorepo (workspaces in `pnpm-workspace.yaml`). Don't look elsewhere — every source file lives in one of these:

- `apps/mobile/` — **the deliverable**. React Native + Expo app. Contains `App.tsx`, `index.ts` (Expo entry), `app.json`, `eas.json`, `google-services.json`, `assets/`, ESLint + Prettier config. Run all `expo`/`eas` commands from here (or via `pnpm --filter mobile`).
- `apps/backend/` — Bun + Elysia HTTP server. Drizzle ORM over Postgres. Modular architecture under `src/modules/<name>/{domain,application,infra}` (see Backend Architecture below). Not deployed yet.
- `packages/shared/` — `@agri-docs/shared`. Cross-workspace TypeScript types (e.g. `Farmer`). Source-only, no build step — consumed directly via `src/index.ts`.

Root-only files: `todo_mvp.md` (phased task list), `conventions.md` (full coding/branch/PR rules), `CLAUDE.md`, `README.md`, `LICENSE`, `.gitmessage`, `.github/`.

## Package Manager

**pnpm only** — never npm or yarn. `apps/backend` uses `bun` as its runtime, but dependencies are still installed via pnpm at the root.

Internal packages are referenced as `"@agri-docs/shared": "workspace:*"` and already wired into both `apps/mobile` and `apps/backend`.

## Stack

- **Mobile**: React Native + TypeScript + Expo (managed workflow with development builds)
- **Cloud services (Firebase)**: Firestore (remote sync target), Auth (phone OTP via SMS), Storage, Crashlytics
- **API server**: Bun runtime + Elysia framework + Drizzle ORM + Postgres (driver: `postgres`). Password hashing via `Bun.password` (bcrypt, no native dep)
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

# Backend dev server (Bun, hot reload, http://localhost:3000)
pnpm --filter backend dev

# Backend Drizzle migrations (requires DATABASE_URL in apps/backend/.env)
pnpm --filter backend db:generate    # generate SQL from schemas
pnpm --filter backend db:migrate     # apply pending migrations
pnpm --filter backend db:studio      # open Drizzle Studio

# Backend type-check
pnpm --filter backend typecheck
```

## Key Architectural Decisions

**Authentication**: Firebase Auth with phone number OTP (SMS). Session tokens stored via `expo-secure-store`. Auto-lock timeout required (RNF18).

**Offline-first**: SQLite (`expo-sqlite`) is the source of truth for all local data. Every write goes to SQLite first and is also appended to a `sync_queue` table (with `sincronizado = 0`). A `SyncService` processes the queue against Firestore whenever connectivity is restored. Firestore is only used as the remote backend (auth, storage, and sync target) — not as the local cache.

**Photo pipeline**: expo-camera → expo-image-manipulator (resize + compress to 0.75, strip EXIF/GPS) → URI saved in SQLite `documentos` table with `sincronizado = 0` → upload to Firebase Storage on reconnect, then update `foto_storage_url` and `sincronizado = 1`. Always strip GPS metadata (LGPD/privacy requirement).

**Audio**: All instructions are narrated in Portuguese with a Paraense regional accent. Every screen has an `AudioPlayer` component (expo-av) in a fixed position, with autoPlay only on first visit (flag tracked in SQLite). Audio files are MP3 64kbps, bundled in `apps/mobile/assets/`.

**Navigation pattern**: Wizard-style (one action per screen). No swipe-back gestures (`gestureEnabled: false`). Minimum touch target: 56dp (RNF05/RNF06).

**Document status colors**: cinza (no data) → vermelho (expired) → amarelo (expiring ≤30 days) → verde (valid).

**Practice mode**: Uses in-memory React state only — never touches SQLite or Firestore. Visually differentiated with a border/background indicator.

**LGPD compliance**: Consent requested via audio during onboarding and recorded in SQLite. Full data deletion (SQLite DB, Storage files, Firestore docs, Auth account, secure store, scheduled notifications) available from the help screen.

**Shared types**: Domain types reused between mobile and backend (e.g. `Farmer`) live in `packages/shared/src/index.ts`. Import as `import type { Farmer } from '@agri-docs/shared'`. Add new shared types here instead of redefining per workspace.

## Backend Architecture (`apps/backend`)

Entry chain: `index.ts` (root) → `src/app.ts` (Elysia setup + error mapper + listen) → `src/app.routes.ts` (Elysia with `prefix: '/v1'` registering each module's controller). Add new controllers via `.use(NewController)` in `src/app.routes.ts`. All app routes live under `/v1`.

Modular clean architecture. Each domain lives in `src/modules/<name>/` split into:

- `domain/` — Drizzle table schemas (`*.schema.ts`) and Elysia type schemas (`*.types.ts`).
- `application/` — one usecase per file (`<verb>-<entity>.usecase.ts`). Pure business logic; throws domain errors.
- `infra/` — `<entity>.repository.ts` (Drizzle queries) and `<entity>.controller.ts` (Elysia routes).

Shared infrastructure in `src/shared/infra/`:

- `databases/postgres.ts` — Drizzle `db` instance and `Transaction` type.
- `generate-id.ts` — cuid2-based id generator (24 chars, see `ID_LENGHT`).
- `import.schema.ts` — shared pgEnums (e.g. `userPlanEnum`) and constants.
- `errors/{not-found,unauthorized,conflict}-error.ts` — typed exceptions mapped to HTTP codes by `src/app.ts` `onError`.
- `base.controller.ts` — `createController({ prefix, tags })` decorates each Elysia controller with `validateToken`. **Stub** today (always returns admin); replace once a real auth module exists.

Conventions:

- Path alias `@/*` → `src/*` (configured in `tsconfig.json`). Always use `@/...` for cross-module imports.
- Repositories return `*Public` types (without `password_hash` / sensitive fields). Never expose hashes in responses.
- Use `Bun.password.hash(value, { algorithm: 'bcrypt', cost: 10 })` for password hashing — no `bcrypt` npm dep needed.
- Drizzle migrations live in `apps/backend/drizzle/` (gitignored on first run; commit them once stable). Generate with `db:generate`, apply with `db:migrate`.
- Reference `apps/backend/DATABASE.md` for the canonical table schema (users, properties, documents, buyers, sales, educational_contents, user_content_progress).
- Existing reference module: `src/modules/exemplo/` (template copied from another project; ignore the Redis bits — this stack is **not** using Redis).

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
