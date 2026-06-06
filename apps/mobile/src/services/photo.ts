import uuid from 'react-native-uuid'
import { agricultoresDb } from '../db/index' 
import * as ImageManipulator from 'expo-image-manipulator'

async function processAndSavePhoto(uri: string, documentId: string): Promise<void> {
    
    const result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800}}], { format: ImageManipulator.SaveFormat.JPEG, compress: 0.75})

    const agora = new Date().toISOString();
    const novaValidade = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    await agricultoresDb?.runAsync(`
        UPDATE documents
        SET file_url = ?,
        status = 'active',
        expiration_date = ?,
        sincronizado = 0,
        updated_at = ?
        WHERE id = ?
    `, result.uri, novaValidade, agora, documentId)

    await agricultoresDb?.runAsync(`
        INSERT INTO sync_queue (id, tabela, operacao, payload, created_at)
        VALUES (?, 'documents', 'update', ?, ?)
    `, uuid.v4(), JSON.stringify({ id: documentId, file_url: result.uri, status: 'active', expiration_date: novaValidade, updated_at: agora }), agora)

}

export { processAndSavePhoto }