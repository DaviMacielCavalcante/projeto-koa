import { mockFarmer, mockDocuments } from '../mocks/practiceData';
import { agricultoresDb } from './index';

export const practiceDataAccess = {
    async getFarmer(isPracticeMode: boolean) {
        if (isPracticeMode) return mockFarmer;
        const user = await agricultoresDb?.getFirstAsync<{ name: string }>('SELECT name FROM users ORDER BY created_at DESC LIMIT 1');
        return user ?? null;
    },

    async getDocuments(isPracticeMode: boolean) {
        if (isPracticeMode) return mockDocuments;
        const docs = await agricultoresDb?.getAllAsync<{ type: string; status: string | null; expiration_date: string | null }>(
            `SELECT type, status, expiration_date FROM documents
             WHERE type IN ('CAF','CAR','CCIR','ITR','NFA-e')
             GROUP BY type HAVING created_at = MAX(created_at)`
        );
        return docs ?? [];
    },

    async getDocumentByType(tipo: string, isPracticeMode: boolean) {
        if (isPracticeMode) return mockDocuments.find(d => d.type === tipo) ?? null;
        return await agricultoresDb?.getFirstAsync('SELECT * FROM documents WHERE type = ? ORDER BY created_at DESC LIMIT 1', [tipo]) ?? null;
    },
};
