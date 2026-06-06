import uuid from 'react-native-uuid';
import * as SecureStore from 'expo-secure-store';
import { agricultoresDb } from './index';

/** Chave do expo-secure-store onde a senha do .pfx é guardada (nunca vai para o SQLite). */
const CHAVE_SENHA = 'certificado_senha';

/** Validade padrão do Certificado Digital A1: 1 ano a partir do envio. */
const VALIDADE_MESES = 12;

/** Linha da tabela certificado_digital. O app guarda no máximo um certificado por vez. */
export type Certificado = {
    id: string;
    arquivo_nome: string;
    validade: string;
    enviado_at: string;
    created_at: string;
    updated_at: string;
};

/** Dados informados pelo agricultor na tela de envio do certificado. */
export type DadosCertificado = {
    arquivo_nome: string;
    senha: string;
};

/** Calcula a data de validade (envio + 1 ano), em ISO. */
function calcularValidade(base: Date): string {
    const validade = new Date(base);
    validade.setMonth(validade.getMonth() + VALIDADE_MESES);
    return validade.toISOString();
}

/** Retorna o certificado salvo, ou null se ainda não houver. */
async function obterCertificado(): Promise<Certificado | null> {
    const row = await agricultoresDb?.getFirstAsync<Certificado>(
        'SELECT * FROM certificado_digital ORDER BY enviado_at DESC LIMIT 1'
    );
    return row ?? null;
}

/**
 * Salva (ou substitui) o certificado. A senha vai para o expo-secure-store;
 * o nome do arquivo e a validade ficam no SQLite. Retorna o certificado gravado.
 */
async function salvarCertificado(dados: DadosCertificado): Promise<Certificado> {
    const agora = new Date();
    const iso = agora.toISOString();
    const certificado: Certificado = {
        id: uuid.v4() as string,
        arquivo_nome: dados.arquivo_nome,
        validade: calcularValidade(agora),
        enviado_at: iso,
        created_at: iso,
        updated_at: iso,
    };

    // Só um certificado por vez: limpa o anterior antes de inserir.
    await agricultoresDb?.runAsync('DELETE FROM certificado_digital');
    await agricultoresDb?.runAsync(
        `INSERT INTO certificado_digital
         (id, arquivo_nome, validade, enviado_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            certificado.id,
            certificado.arquivo_nome,
            certificado.validade,
            certificado.enviado_at,
            certificado.created_at,
            certificado.updated_at,
        ]
    );
    await SecureStore.setItemAsync(CHAVE_SENHA, dados.senha);
    return certificado;
}

/** Remove o certificado salvo e apaga a senha do secure-store. */
async function removerCertificado(): Promise<void> {
    await agricultoresDb?.runAsync('DELETE FROM certificado_digital');
    await SecureStore.deleteItemAsync(CHAVE_SENHA).catch(() => {});
}

export { obterCertificado, salvarCertificado, removerCertificado };
