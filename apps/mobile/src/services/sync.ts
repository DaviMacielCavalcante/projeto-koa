import { agricultoresDb } from '../db/index';
import firestore from '@react-native-firebase/firestore';
import * as NetInfo from '@react-native-community/netinfo';
import storage from '@react-native-firebase/storage';

interface SyncItem {
    id: string
    tabela: string
    operacao: string
    payload: string
    created_at: string
}

async function syncQueue() {

    const netConn = await NetInfo.fetch();

    if (!netConn.isConnected) {
        return
    }

    const itens = await agricultoresDb?.getAllAsync<SyncItem>(`
        SELECT * FROM sync_queue    
    `)

    for (const item of itens ?? []) {
        const payload = JSON.parse(item.payload);

        try {
            if (item.operacao == "insert") {

            await firestore()
            .collection(item.tabela)
            .doc(payload.documentId)
            .set(payload)

            await agricultoresDb?.runAsync('DELETE FROM sync_queue WHERE id = ?', item.id)


            } else if (item.operacao == "update") {

                if (payload.file_url) {

                    const ref = storage().ref(`documents/${payload.documentId}`);

                    await ref.putFile(payload.file_url);

                    const downloadUrl = await ref.getDownloadURL();

                    await firestore()
                    .collection(item.tabela)
                    .doc(payload.documentId)
                    .update({ storage_url: downloadUrl })

                    await agricultoresDb?.runAsync(`
                        UPDATE documents
                        SET storage_url = ?,
                        sincronizado = 1
                        WHERE id = ?`, downloadUrl, payload.documentId)
                    
                } else {

                    await firestore()
                    .collection(item.tabela)
                    .doc(payload.documentId)
                    .update(payload)

                }               

                await agricultoresDb?.runAsync('DELETE FROM sync_queue WHERE id = ?', item.id)

                
            } else if (item.operacao == "delete") {

                await firestore()
                .collection(item.tabela)
                .doc(payload.documentId)
                .delete()

                await agricultoresDb?.runAsync('DELETE FROM sync_queue WHERE id = ?', item.id)

            }
        } catch (error) {
            
        }
        
    }
    
}

export {syncQueue};