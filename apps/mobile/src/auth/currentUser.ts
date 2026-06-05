import * as SecureStore from 'expo-secure-store';

// Sessão local "fake" — substitui o Firebase Auth como fonte de identidade.
// O login não bate no Firebase: é só uma entrada de dados que gera/reusa um uid
// estável no dispositivo. Mantém o auto-lock de 30 min (RNF18) por tempo ocioso.

const UID_KEY = 'local_uid';
const PHONE_KEY = 'local_phone';
const ACTIVE_KEY = 'last_active';
const TIMEOUT_MS = 30 * 60 * 1000;

// Cache em memória pra getCurrentUserId() continuar síncrono (usado por progress.ts).
let uidCache: string | null = null;
let phoneCache: string | null = null;

/** Carrega a sessão local pro cache. Chamar no boot antes de renderizar as telas. */
export async function carregarSessaoLocal(): Promise<void> {
    uidCache = await SecureStore.getItemAsync(UID_KEY);
    phoneCache = await SecureStore.getItemAsync(PHONE_KEY);
}

/** "Login" local: gera (uma vez) ou reusa um uid estável e guarda o telefone digitado. */
export async function entrarLocal(telefone: string): Promise<void> {
    let uid = await SecureStore.getItemAsync(UID_KEY);
    if (!uid) {
        uid = `local-${Date.now()}`;
        await SecureStore.setItemAsync(UID_KEY, uid);
    }
    await SecureStore.setItemAsync(PHONE_KEY, telefone);
    await SecureStore.setItemAsync(ACTIVE_KEY, Date.now().toString());
    uidCache = uid;
    phoneCache = telefone;
}

/** Registra atividade agora (chamar ao sair/voltar do app, pra contar tempo ocioso). */
export async function marcarAtividade(): Promise<void> {
    await SecureStore.setItemAsync(ACTIVE_KEY, Date.now().toString());
}

/** true se passou do tempo de auto-lock desde a última atividade. */
export async function sessaoExpirada(): Promise<boolean> {
    const ultima = await SecureStore.getItemAsync(ACTIVE_KEY);
    if (!ultima) return false;
    return Date.now() - Number(ultima) > TIMEOUT_MS;
}

/** Limpa a sessão local por completo (usado no "apagar todos os dados"). */
export async function sairLocal(): Promise<void> {
    await SecureStore.deleteItemAsync(UID_KEY);
    await SecureStore.deleteItemAsync(PHONE_KEY);
    await SecureStore.deleteItemAsync(ACTIVE_KEY);
    uidCache = null;
    phoneCache = null;
}

export function getCurrentUserId(): string | null {
    return uidCache;
}

export function getTelefoneLocal(): string | null {
    return phoneCache;
}
