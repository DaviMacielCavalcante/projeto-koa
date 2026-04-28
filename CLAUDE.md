# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mobile app to assist family farmers in Jutaí with document regularization (CAF, CAR, CCIR, ITR, NFA-e). MVP deadline: 2026-05-18. See `todo_mvp.md` for the full task breakdown by phase.

## Stack

- **Platform**: React Native + TypeScript + Expo (managed workflow with development builds)
- **Backend**: Firebase — Firestore (remote sync target), Auth (phone OTP via SMS), Storage, Crashlytics
- **Local DB**: expo-sqlite (no pending-op limit; custom sync layer pushes to Firestore on reconnect)
- **Navigation**: React Navigation or Expo Router (decision pending in Phase 1)
- **Camera/Audio/Notifications**: expo-camera, expo-av, expo-notifications, expo-image-manipulator
- **Builds**: EAS Build + EAS Submit
- **OTA updates**: expo-updates
- **Tests**: Jest + Detox

## Critical Constraint: No Expo Go

`@react-native-firebase` requires native modules unavailable in Expo Go. Always use **development builds** (`expo-dev-client`) from the start. Never suggest or test with Expo Go.

## Build Commands

```bash
# Development build (Android)
eas build --profile development --platform android

# Preview build for testing
eas build --profile preview --platform android

# Production build
eas build --profile production --platform android

# Start dev server (after installing development build on device)
npx expo start --dev-client
```

## Key Architectural Decisions

**Authentication**: Firebase Auth with phone number OTP (SMS). Session tokens stored via `expo-secure-store`. Auto-lock timeout required (RNF18).

**Offline-first**: SQLite (`expo-sqlite`) is the source of truth for all local data. Every write goes to SQLite first and is also appended to a `sync_queue` table (with `sincronizado = 0`). A `SyncService` processes the queue against Firestore whenever connectivity is restored. Firestore is only used as the remote backend (auth, storage, and sync target) — not as the local cache.

**Photo pipeline**: expo-camera → expo-image-manipulator (resize + compress to 0.75, strip EXIF/GPS) → URI saved in SQLite `documentos` table with `sincronizado = 0` → upload to Firebase Storage on reconnect, then update `foto_storage_url` and `sincronizado = 1`. Always strip GPS metadata (LGPD/privacy requirement).

**Audio**: All instructions are narrated in Portuguese with a Paraense regional accent. Every screen has an `AudioPlayer` component (expo-av) in a fixed position, with autoPlay only on first visit (flag tracked in SQLite). Audio files are MP3 64kbps, bundled in `assets/`.

**Navigation pattern**: Wizard-style (one action per screen). No swipe-back gestures (`gestureEnabled: false`). Minimum touch target: 56dp (RNF05/RNF06).

**Document status colors**: cinza (no data) → vermelho (expired) → amarelo (expiring ≤30 days) → verde (valid).

**Practice mode**: Uses in-memory React state only — never touches SQLite or Firestore. Visually differentiated with a border/background indicator.

**LGPD compliance**: Consent requested via audio during onboarding and recorded in SQLite. Full data deletion (SQLite DB, Storage files, Firestore docs, Auth account, secure store, scheduled notifications) available from the help screen.

## Firebase Setup

- `google-services.json` configured in `app.json` under `expo.android.googleServicesFile`
- Each `@react-native-firebase` module requires its config plugin in `app.json`
- Firestore security rules: users can only read/write their own documents (`/agricultores/{userId}`)
- Storage rules: users can only access their own files

## Conventions

Full details in `conventions.md`. Summary:

**Branches**: `main` (stable), `feature/*` (new features), `fix/*` (bug fixes).

**Commits** — Conventional Commits format:
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
