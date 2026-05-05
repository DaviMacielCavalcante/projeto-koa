import uuid from 'react-native-uuid'
import { agricultoresDb } from '../db/index' 
import * as ImageManipulator from 'expo-image-manipulator'

async function processAndSavePhoto(uri: string, documentId: string): Promise<void> {
    
    const result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800}}], { format: ImageManipulator.SaveFormat.JPEG, compress: 0.75})

    await agricultoresDb?.runAsync(`
        UPDATE documents
        SET file_url = ? , 
        sincronizado = 0
        WHERE id = ?
    `, result.uri, documentId)

    await agricultoresDb?.runAsync(`
        INSERT INTO sync_queue (id, tabela, operacao, payload, created_at)
        VALUES (?, 'documents', 'update',
        ?, ?)   
    `, uuid.v4(), JSON.stringify({ documentId, file_url: result.uri }), new Date().toISOString())

}

export { processAndSavePhoto }