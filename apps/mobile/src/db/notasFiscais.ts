import uuid from 'react-native-uuid';
import { agricultoresDb } from './index';

/** Estado de uma nota: aguardando emissão (offline) ou já emitida pela API. */
export type StatusNota = 'pendente' | 'emitida';

/** Linha completa da tabela notas_fiscais. */
export type NotaFiscal = {
    id: string;
    produtor_cnpj: string;
    produtor_endereco: string;
    comprador_nome: string;
    comprador_doc: string;
    descricao: string;
    valor: string;
    natureza: string;
    status: StatusNota;
    numero_nota: string | null;
    chave_acesso: string | null;
    emitida_at: string | null;
    created_at: string;
    updated_at: string;
};

/** Dados preenchidos pelo agricultor no formulário, antes da emissão. */
export type DadosNota = {
    produtor_cnpj: string;
    produtor_endereco: string;
    comprador_nome: string;
    comprador_doc: string;
    descricao: string;
    valor: string;
    natureza: string;
};

/** Dados devolvidos pela API de emissão. */
export type DadosEmissao = {
    numero_nota: string;
    chave_acesso: string;
    emitida_at: string;
};

/** Cria uma nota com status 'pendente' (ainda não emitida). Retorna o id gerado. */
async function criarNotaPendente(dados: DadosNota): Promise<string> {
    const id = uuid.v4() as string;
    const agora = new Date().toISOString();
    await agricultoresDb?.runAsync(
        `INSERT INTO notas_fiscais
         (id, produtor_cnpj, produtor_endereco, comprador_nome, comprador_doc,
          descricao, valor, natureza, status, numero_nota, chave_acesso, emitida_at,
          created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendente', NULL, NULL, NULL, ?, ?)`,
        [
            id,
            dados.produtor_cnpj,
            dados.produtor_endereco,
            dados.comprador_nome,
            dados.comprador_doc,
            dados.descricao,
            dados.valor,
            dados.natureza,
            agora,
            agora,
        ]
    );
    return id;
}

/** Marca uma nota pendente como emitida, gravando os dados devolvidos pela API. */
async function marcarComoEmitida(id: string, emissao: DadosEmissao): Promise<void> {
    await agricultoresDb?.runAsync(
        `UPDATE notas_fiscais
         SET status = 'emitida', numero_nota = ?, chave_acesso = ?, emitida_at = ?, updated_at = ?
         WHERE id = ?`,
        [emissao.numero_nota, emissao.chave_acesso, emissao.emitida_at, new Date().toISOString(), id]
    );
}

/** Lista todas as notas, mais recentes primeiro (emitidas pela data de emissão, pendentes pela criação). */
async function listarNotas(): Promise<NotaFiscal[]> {
    const rows = await agricultoresDb?.getAllAsync<NotaFiscal>(
        `SELECT * FROM notas_fiscais
         ORDER BY COALESCE(emitida_at, created_at) DESC`
    );
    return rows ?? [];
}

/** Lista só as notas pendentes, mais antigas primeiro (usado pela fila de emissão). */
async function listarPendentes(): Promise<NotaFiscal[]> {
    const rows = await agricultoresDb?.getAllAsync<NotaFiscal>(
        `SELECT * FROM notas_fiscais WHERE status = 'pendente' ORDER BY created_at ASC`
    );
    return rows ?? [];
}

/** Busca uma nota pelo id. */
async function obterNota(id: string): Promise<NotaFiscal | null> {
    const row = await agricultoresDb?.getFirstAsync<NotaFiscal>(
        'SELECT * FROM notas_fiscais WHERE id = ? LIMIT 1',
        [id]
    );
    return row ?? null;
}

/** Remove uma nota. */
async function excluirNota(id: string): Promise<void> {
    await agricultoresDb?.runAsync('DELETE FROM notas_fiscais WHERE id = ?', [id]);
}

export {
    criarNotaPendente,
    marcarComoEmitida,
    listarNotas,
    listarPendentes,
    obterNota,
    excluirNota,
};
