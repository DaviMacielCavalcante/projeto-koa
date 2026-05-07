import { mockFarmer, mockDocuments } from '../mocks/practiceData';
import { agricultoresDb } from './index';

export const practiceDataAccess = {
  async getFarmer(isPracticeMode: boolean) {
    if (isPracticeMode) {
      return mockFarmer;
    }
    // Implementar: retornar farmer real do banco
    // const users = await agricultoresDb?.getAllAsync('SELECT * FROM users LIMIT 1');
    // return users?.[0] || null;
    return null;
  },

  async getDocuments(isPracticeMode: boolean) {
    if (isPracticeMode) {
      return mockDocuments;
    }
    // Implementar: retornar documentos reais do banco
    // const docs = await agricultoresDb?.getAllAsync(
    //   `SELECT * FROM documents WHERE type IN ('CAF','CAR','CCIR','ITR','NFA-e') GROUP BY type HAVING created_at = MAX(created_at)`
    // );
    // return docs || [];
    return [];
  },

  async getDocumentByType(type: string, isPracticeMode: boolean) {
    if (isPracticeMode) {
      return mockDocuments.find((d) => d.type === type) || null;
    }
    // Implementar: retornar documento real do banco
    // const docs = await agricultoresDb?.getAllAsync(
    //   `SELECT * FROM documents WHERE type = ? ORDER BY created_at DESC LIMIT 1`,
    //   [type]
    // );
    // return docs?.[0] || null;
    return null;
  },

  async savePhoto(
    documentType: string,
    photoUri: string,
    isPracticeMode: boolean
  ) {
    if (isPracticeMode) {
      // Apenas atualizar mock em memória, não toca no banco
      const doc = mockDocuments.find((d) => d.type === documentType);
      if (doc) {
        doc.file_url = photoUri;
        doc.updated_at = new Date().toISOString();
      }
      return;
    }
    // Implementar: salvar foto real no banco e Firebase Storage
    // await photoService.save(documentType, photoUri);
  },

  async updateDocumentStatus(
    documentType: string,
    status: string,
    isPracticeMode: boolean
  ) {
    if (isPracticeMode) {
      // Apenas atualizar mock em memória
      const doc = mockDocuments.find((d) => d.type === documentType);
      if (doc) {
        doc.status = status;
        doc.updated_at = new Date().toISOString();
      }
      return;
    }
    // Implementar: atualizar status real no banco
    // await agricultoresDb?.runAsync(
    //   `UPDATE documents SET status = ?, updated_at = ? WHERE type = ?`,
    //   [status, new Date().toISOString(), documentType]
    // );
  },
};
