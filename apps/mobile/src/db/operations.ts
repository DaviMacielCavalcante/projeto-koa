import { agricultoresDb } from './index';
import uuid from 'react-native-uuid';

async function saveAndEnqueue(table: string, operation: string, payload: Record<string, any>) {

    const keys = Object.keys(payload);

    const placeholders = keys.map(() => '?').join(', ');

    const values = Object.values(payload);

    if (operation === "insert") {

        await agricultoresDb?.runAsync(`
            INSERT INTO ${table} (${keys.join(', ')}) 
            VALUES (${placeholders})    
        `, values)

    } else if (operation === "update") {

        await agricultoresDb?.runAsync(`
            UPDATE ${table} SET ${keys.map(k => `${k} = ?`).join(', ')}
            WHERE id = ?
        `, [...values, payload.id])

    } else if (operation === "delete") {

        await agricultoresDb?.runAsync(`
            DELETE FROM ${table} 
            WHERE id = ?
        `, [payload.id])

    }

    await agricultoresDb?.runAsync(
        `INSERT INTO sync_queue (id, tabela, operacao, payload, created_at) VALUES (?, ?, ?, ?, ?)`,
        [uuid.v4(), table, operation, JSON.stringify(payload), new Date().toISOString()]
    )

}

export { saveAndEnqueue };