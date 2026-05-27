import uuid from 'react-native-uuid';
import { agricultoresDb } from './index';

const seed = [
    { title: 'O que é o CAF', category: 'CAF' },
    { title: 'O que é o CAR', category: 'CAR' },
    { title: 'O que é o CCIR', category: 'CCIR' },
    { title: 'O que é o ITR', category: 'ITR' },
    { title: 'O que é a Nota Fiscal', category: 'NFA-e' },
];

export async function seedEducationalContentsIfEmpty(): Promise<void> {
    if (!agricultoresDb) return;

    const row = await agricultoresDb.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM educational_contents'
    );
    if ((row?.count ?? 0) > 0) return;

    const base = Date.now();
    for (let i = 0; i < seed.length; i++) {
        const item = seed[i];
        const id = String(uuid.v4());
        const ts = new Date(base + i).toISOString();
        await agricultoresDb.runAsync(
            'INSERT INTO educational_contents (id, title, body, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [id, item.title, '', item.category, ts, ts]
        );
    }
}
