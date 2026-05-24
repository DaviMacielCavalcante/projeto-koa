import * as NetInfo from '@react-native-community/netinfo';
import {
    listarPendentes,
    marcarComoEmitida,
    type DadosEmissao,
    type DadosNota,
    type NotaFiscal,
} from '../db/notasFiscais';

/** Tempo do delay simulado da "API" de emissão. */
const DELAY_SIMULADO_MS = 1500;

/** Gera um número de nota de 6 dígitos. */
function gerarNumeroNota(): string {
    return String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0');
}

/**
 * Gera uma chave de acesso de 44 dígitos no formato aproximado da NFA-e:
 * UF (15 = Pará) + ano/mês + CNPJ do produtor + preenchimento aleatório.
 */
function gerarChaveAcesso(cnpj: string): string {
    const agora = new Date();
    const aamm = `${String(agora.getFullYear()).slice(2)}${String(agora.getMonth() + 1).padStart(2, '0')}`;
    const cnpjDigitos = cnpj.replace(/\D/g, '').padEnd(14, '0').slice(0, 14);
    let chave = `15${aamm}${cnpjDigitos}`;
    while (chave.length < 44) {
        chave += Math.floor(Math.random() * 10);
    }
    return chave.slice(0, 44);
}

/**
 * MOCK da API de emissão de NFA-e.
 *
 * Quando a API real existir, basta trocar o corpo desta função pela chamada HTTP —
 * o resto do app não muda, desde que continue devolvendo um `DadosEmissao`.
 */
async function emitirNotaFiscal(dados: DadosNota): Promise<DadosEmissao> {
    await new Promise((resolve) => setTimeout(resolve, DELAY_SIMULADO_MS));
    return {
        numero_nota: gerarNumeroNota(),
        chave_acesso: gerarChaveAcesso(dados.produtor_cnpj),
        emitida_at: new Date().toISOString(),
    };
}

/**
 * Emite uma nota que está pendente: chama a API e marca como emitida.
 * Retorna `true` se deu certo, `false` se falhou (a nota segue pendente).
 */
async function emitirNotaPendente(nota: NotaFiscal): Promise<boolean> {
    try {
        const emissao = await emitirNotaFiscal(nota);
        await marcarComoEmitida(nota.id, emissao);
        return true;
    } catch {
        return false;
    }
}

/**
 * Processa a fila de notas pendentes.
 *
 * Sem internet, não faz nada — as notas continuam pendentes e serão
 * reprocessadas no próximo reconnect (listener em `app/_layout.tsx`).
 */
async function processarFilaEmissao(): Promise<void> {
    const conexao = await NetInfo.fetch();
    if (!conexao.isConnected) return;

    const pendentes = await listarPendentes();
    for (const nota of pendentes) {
        await emitirNotaPendente(nota);
    }
}

export { emitirNotaFiscal, emitirNotaPendente, processarFilaEmissao };
