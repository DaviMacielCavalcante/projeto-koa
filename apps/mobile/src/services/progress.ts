import uuid from 'react-native-uuid';
import { getCurrentUserId } from '../auth/currentUser';
import { agricultoresDb } from '../db/index';

export async function marcarComoConcluido(contentId: string): Promise<boolean> {
    const userId = getCurrentUserId();
    if (!userId || !agricultoresDb) return false;

    const existente = await agricultoresDb.getFirstAsync<{ id: string }>(
        'SELECT id FROM user_content_progress WHERE user_id = ? AND content_id = ?',
        [userId, contentId]
    );
    if (existente) return true;

    const agora = new Date().toISOString();
    const progressId = String(uuid.v4());

    await agricultoresDb.runAsync(
        `INSERT INTO user_content_progress
         (id, user_id, content_id, read_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [progressId, userId, contentId, agora, agora, agora]
    );

    await agricultoresDb.runAsync(
        `INSERT INTO sync_queue (id, tabela, operacao, payload, created_at)
         VALUES (?, 'user_content_progress', 'insert', ?, ?)`,
        [
            String(uuid.v4()),
            JSON.stringify({
                documentId: progressId,
                user_id: userId,
                content_id: contentId,
                read_at: agora,
            }),
            agora,
        ]
    );

    return true;
}

export async function desmarcarConcluido(contentId: string): Promise<boolean> {
    const userId = getCurrentUserId();
    if (!userId || !agricultoresDb) return false;

    const existente = await agricultoresDb.getFirstAsync<{ id: string }>(
        'SELECT id FROM user_content_progress WHERE user_id = ? AND content_id = ?',
        [userId, contentId]
    );
    if (!existente) return true;

    await agricultoresDb.runAsync(
        'DELETE FROM user_content_progress WHERE id = ?',
        [existente.id]
    );

    const agora = new Date().toISOString();
    await agricultoresDb.runAsync(
        `INSERT INTO sync_queue (id, tabela, operacao, payload, created_at)
         VALUES (?, 'user_content_progress', 'delete', ?, ?)`,
        [String(uuid.v4()), JSON.stringify({ documentId: existente.id }), agora]
    );

    return true;
}

export async function listarConcluidosDoUsuario(): Promise<Set<string>> {
    const userId = getCurrentUserId();
    if (!userId || !agricultoresDb) return new Set();

    const rows = await agricultoresDb.getAllAsync<{ content_id: string }>(
        `SELECT content_id FROM user_content_progress
         WHERE user_id = ? AND read_at IS NOT NULL`,
        [userId]
    );
    return new Set(rows.map((r) => r.content_id));
}

export async function isConcluido(contentId: string): Promise<boolean> {
    const userId = getCurrentUserId();
    if (!userId || !agricultoresDb) return false;

    const row = await agricultoresDb.getFirstAsync<{ id: string }>(
        `SELECT id FROM user_content_progress
         WHERE user_id = ? AND content_id = ? AND read_at IS NOT NULL`,
        [userId, contentId]
    );
    return !!row;
}

// --- Progresso por seção (subtópico) ---
// section_id é único globalmente (ex: 'CAR-0'), então basta (user_id, section_id).
// content_id é guardado para agrupar/sincronizar por tópico.

export async function listarSecoesConcluidas(contentId: string): Promise<Set<string>> {
    const userId = getCurrentUserId();
    if (!userId || !agricultoresDb) return new Set();

    const rows = await agricultoresDb.getAllAsync<{ section_id: string }>(
        `SELECT section_id FROM user_section_progress
         WHERE user_id = ? AND content_id = ? AND read_at IS NOT NULL`,
        [userId, contentId]
    );
    return new Set(rows.map((r) => r.section_id));
}

export async function marcarSecaoConcluida(contentId: string, sectionId: string): Promise<boolean> {
    const userId = getCurrentUserId();
    if (!userId || !agricultoresDb) return false;

    const existente = await agricultoresDb.getFirstAsync<{ id: string }>(
        'SELECT id FROM user_section_progress WHERE user_id = ? AND section_id = ?',
        [userId, sectionId]
    );
    if (existente) return true;

    const agora = new Date().toISOString();
    const progressId = String(uuid.v4());

    await agricultoresDb.runAsync(
        `INSERT INTO user_section_progress
         (id, user_id, content_id, section_id, read_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [progressId, userId, contentId, sectionId, agora, agora, agora]
    );

    await agricultoresDb.runAsync(
        `INSERT INTO sync_queue (id, tabela, operacao, payload, created_at)
         VALUES (?, 'user_section_progress', 'insert', ?, ?)`,
        [
            String(uuid.v4()),
            JSON.stringify({
                documentId: progressId,
                user_id: userId,
                content_id: contentId,
                section_id: sectionId,
                read_at: agora,
            }),
            agora,
        ]
    );

    return true;
}

export async function desmarcarSecao(contentId: string, sectionId: string): Promise<boolean> {
    const userId = getCurrentUserId();
    if (!userId || !agricultoresDb) return false;

    const existente = await agricultoresDb.getFirstAsync<{ id: string }>(
        'SELECT id FROM user_section_progress WHERE user_id = ? AND section_id = ?',
        [userId, sectionId]
    );
    if (!existente) return true;

    await agricultoresDb.runAsync(
        'DELETE FROM user_section_progress WHERE id = ?',
        [existente.id]
    );

    const agora = new Date().toISOString();
    await agricultoresDb.runAsync(
        `INSERT INTO sync_queue (id, tabela, operacao, payload, created_at)
         VALUES (?, 'user_section_progress', 'delete', ?, ?)`,
        [String(uuid.v4()), JSON.stringify({ documentId: existente.id }), agora]
    );

    return true;
}
