import { agricultoresDb } from './index';
import { roadmapContent } from '../data/roadmapContent';

// Ordem da trilha + títulos dos tópicos. O id é determinístico (= category),
// para que o progresso do usuário (content_id) permaneça estável entre reseeds.
// `chapter` = capítulo do tópico; `position` (índice no array dentro do capítulo)
// = ordem dentro do capítulo. `audioKey` (opcional) referencia o áudio narrado
// (chave do registro estático em src/data/audioRegistry.ts). Ajuste aqui.
const TOPICOS: { category: string; title: string; chapter: number; audioKey?: string }[] = [
    { category: 'CAF', title: 'O que é o CAF', chapter: 1 },
    { category: 'CAR', title: 'O que é o CAR', chapter: 1, audioKey: 'car' },
    { category: 'CCIR', title: 'O que é o CCIR', chapter: 1, audioKey: 'ccir' },
    { category: 'ITR', title: 'O que é o ITR', chapter: 2, audioKey: 'itr' },
    { category: 'NFA-e', title: 'O que é a Nota Fiscal', chapter: 2 },
];

/**
 * Popula `educational_contents` (tópicos) e `content_sections` (seções de cada
 * tópico) a partir de `roadmapContent.ts`, que é a fonte de autoria do conteúdo.
 * É idempotente: pode rodar a cada inicialização e reflete edições no conteúdo.
 */
export async function seedEducationalContents(): Promise<void> {
    if (!agricultoresDb) return;

    const base = Date.now();
    const posPorCapitulo: Record<number, number> = {};
    for (let i = 0; i < TOPICOS.length; i++) {
        const { category, title, chapter, audioKey } = TOPICOS[i];
        const id = category; // id determinístico
        const ts = new Date(base + i).toISOString();
        const rich = roadmapContent[category] ?? null;
        const position = posPorCapitulo[chapter] ?? 0; // ordem dentro do capítulo
        posPorCapitulo[chapter] = position + 1;

        // Áudio do tópico (opcional). id determinístico = audio-<category>.
        let audioId: string | null = null;
        if (audioKey) {
            audioId = `audio-${category}`;
            await agricultoresDb.runAsync(
                `INSERT OR REPLACE INTO audios (id, name, file_key, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?)`,
                [audioId, '@fugaprascolinas', audioKey, ts, ts]
            );
        }

        await agricultoresDb.runAsync(
            `INSERT OR REPLACE INTO educational_contents
             (id, title, category, hero, resumo, chapter, position, audio_id, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, title, category, rich?.hero ?? null, rich?.resumo ?? null, chapter, position, audioId, ts, ts]
        );

        // Reconstrói as seções do tópico (idempotente).
        await agricultoresDb.runAsync(
            'DELETE FROM content_sections WHERE content_id = ?',
            [id]
        );

        const sections = rich?.sections ?? [];
        for (let s = 0; s < sections.length; s++) {
            const sec = sections[s];
            await agricultoresDb.runAsync(
                `INSERT INTO content_sections
                 (id, content_id, icon, title, body, position, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [`${id}-${s}`, id, sec.icon, sec.title, sec.body, s, ts, ts]
            );
        }
    }
}
