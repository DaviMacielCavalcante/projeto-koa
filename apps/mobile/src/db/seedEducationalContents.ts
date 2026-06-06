import { agricultoresDb } from './index';
import { roadmapContent } from '../data/roadmapContent';

// Ordem da trilha + metadados dos tópicos. `id` é determinístico e estável (mantém
// o progresso do usuário, content_id, entre reseeds). `categoria` é o selo exibido
// na tela de detalhe. `chapter` agrupa os tópicos; `position` (índice no array
// dentro do capítulo) = ordem dentro do capítulo. `audio` (opcional) referencia o
// áudio narrado: `key` é a chave do registro estático (src/data/audioRegistry.ts,
// resolve mp3 + avatar do narrador) e `narrador` é o nome exibido na bolha.
// O conteúdo rico (hero, seções, resumo) vem de roadmapContent[id]. Ajuste aqui.
type AudioMeta = { key: string; narrador: string };
const TOPICOS: { id: string; categoria: string; title: string; chapter: number; audio?: AudioMeta }[] = [
    { id: 'CAF', categoria: 'CAF', title: 'O que é o CAF', chapter: 1, audio: { key: 'caf', narrador: '@matheus' } },
    { id: 'CAR', categoria: 'CAR', title: 'O que é o CAR', chapter: 1, audio: { key: 'car', narrador: '@fugaprascolinas' } },
    { id: 'CCIR', categoria: 'CCIR', title: 'O que é o CCIR', chapter: 1, audio: { key: 'ccir', narrador: '@fugaprascolinas' } },
    { id: 'ITR', categoria: 'ITR', title: 'O que é o ITR', chapter: 1, audio: { key: 'itr', narrador: '@fugaprascolinas' } },
    { id: 'NF-introducao', categoria: 'Nota Fiscal', title: 'Introdução', chapter: 2, audio: { key: 'nf-introducao', narrador: '@matheus' } },
    { id: 'NF-documentos', categoria: 'Nota Fiscal', title: 'Separando documentos', chapter: 2, audio: { key: 'nf-separando-documentos', narrador: '@matheus' } },
    { id: 'NF-certificado', categoria: 'Nota Fiscal', title: 'Certificado digital', chapter: 2, audio: { key: 'nf-certificado-digital', narrador: '@matheus' } },
    { id: 'NF-emissao', categoria: 'Nota Fiscal', title: 'Emitindo a nota', chapter: 2, audio: { key: 'nf-emitindo-a-nota', narrador: '@matheus' } },
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
        const { id, categoria, title, chapter, audio } = TOPICOS[i];
        const ts = new Date(base + i).toISOString();
        const rich = roadmapContent[id] ?? null;
        const position = posPorCapitulo[chapter] ?? 0; // ordem dentro do capítulo
        posPorCapitulo[chapter] = position + 1;

        // Áudio do tópico (opcional). id determinístico = audio-<id>.
        let audioId: string | null = null;
        if (audio) {
            audioId = `audio-${id}`;
            await agricultoresDb.runAsync(
                `INSERT OR REPLACE INTO audios (id, name, file_key, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?)`,
                [audioId, audio.narrador, audio.key, ts, ts]
            );
        }

        await agricultoresDb.runAsync(
            `INSERT OR REPLACE INTO educational_contents
             (id, title, category, hero, resumo, chapter, position, audio_id, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, title, categoria, rich?.hero || null, rich?.resumo || null, chapter, position, audioId, ts, ts]
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

    // Remove tópicos que não estão mais no TOPICOS (ex.: o antigo 'NFA-e') e suas
    // seções, para não ficarem fantasmas na trilha. O progresso órfão é inofensivo
    // (a contagem de medalhas só considera tópicos existentes).
    const ids = TOPICOS.map((t) => t.id);
    const marcadores = ids.map(() => '?').join(', ');
    await agricultoresDb.runAsync(
        `DELETE FROM content_sections WHERE content_id NOT IN (${marcadores})`,
        ids
    );
    await agricultoresDb.runAsync(
        `DELETE FROM educational_contents WHERE id NOT IN (${marcadores})`,
        ids
    );
}
