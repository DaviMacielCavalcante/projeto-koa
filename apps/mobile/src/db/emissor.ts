import { agricultoresDb } from './index';

// Dados do emissor exigidos pela API de NFA-e (Focus NFe). Ficam na linha do usuário
// (tabela `users`, sempre a mais recente). Todos obrigatórios para liberar a emissão.
export type DadosEmissor = {
    cnpj_emitente: string;
    nome_emitente: string;
    logradouro_emitente: string;
    numero_emitente: string;
    bairro_emitente: string;
    municipio_emitente: string;
    uf_emitente: string;
    cep_emitente: string;
    inscricao_estadual_emitente: string;
    regime_tributario_emitente: string;
};

export const CAMPOS_EMISSOR: (keyof DadosEmissor)[] = [
    'cnpj_emitente',
    'nome_emitente',
    'logradouro_emitente',
    'numero_emitente',
    'bairro_emitente',
    'municipio_emitente',
    'uf_emitente',
    'cep_emitente',
    'inscricao_estadual_emitente',
    'regime_tributario_emitente',
];

const EMISSOR_VAZIO: DadosEmissor = {
    cnpj_emitente: '',
    nome_emitente: '',
    logradouro_emitente: '',
    numero_emitente: '',
    bairro_emitente: '',
    municipio_emitente: '',
    uf_emitente: '',
    cep_emitente: '',
    inscricao_estadual_emitente: '',
    regime_tributario_emitente: '',
};

// Campos de texto livres (renderizados como TextInput na tela de perfil). O regime
// tributário é tratado à parte (seletor de opções fixas), por isso não entra aqui.
export const CAMPOS_TEXTO_EMISSOR: {
    campo: keyof DadosEmissor;
    label: string;
    placeholder: string;
    keyboardType?: 'default' | 'numeric';
    autoCapitalize?: 'none' | 'words' | 'characters';
    maxLength?: number;
}[] = [
    { campo: 'cnpj_emitente', label: 'CNPJ', placeholder: '00.000.000/0000-00', keyboardType: 'numeric' },
    { campo: 'nome_emitente', label: 'Nome / Razão social', placeholder: 'Nome do emissor', autoCapitalize: 'words' },
    { campo: 'logradouro_emitente', label: 'Logradouro', placeholder: 'Rua, avenida...', autoCapitalize: 'words' },
    { campo: 'numero_emitente', label: 'Número', placeholder: '123', keyboardType: 'numeric' },
    { campo: 'bairro_emitente', label: 'Bairro', placeholder: 'Bairro', autoCapitalize: 'words' },
    { campo: 'municipio_emitente', label: 'Município', placeholder: 'Município', autoCapitalize: 'words' },
    { campo: 'uf_emitente', label: 'UF', placeholder: 'AM', autoCapitalize: 'characters', maxLength: 2 },
    { campo: 'cep_emitente', label: 'CEP', placeholder: '00000-000', keyboardType: 'numeric' },
    {
        campo: 'inscricao_estadual_emitente',
        label: 'Inscrição Estadual',
        placeholder: 'ISENTO, se não tiver',
        autoCapitalize: 'characters',
    },
];

// Valores aceitos pela NFA-e/Focus para o regime tributário do emissor.
export const REGIMES_TRIBUTARIOS: { valor: string; label: string }[] = [
    { valor: '1', label: 'Simples Nacional' },
    { valor: '2', label: 'Simples Nacional — excesso' },
    { valor: '3', label: 'Regime Normal' },
];

export async function obterEmissor(): Promise<DadosEmissor> {
    const row = await agricultoresDb?.getFirstAsync<Record<string, string | null>>(
        `SELECT ${CAMPOS_EMISSOR.join(', ')} FROM users ORDER BY created_at DESC LIMIT 1`
    );
    const dados = { ...EMISSOR_VAZIO };
    for (const campo of CAMPOS_EMISSOR) {
        dados[campo] = (row?.[campo] ?? '').toString();
    }
    return dados;
}

export async function salvarEmissor(dados: DadosEmissor): Promise<void> {
    const sets = CAMPOS_EMISSOR.map((c) => `${c} = ?`).join(', ');
    // Grava NULL para campos vazios (mantém a semântica "nullable" da coluna).
    const valores = CAMPOS_EMISSOR.map((c) => dados[c].trim() || null);
    await agricultoresDb
        ?.runAsync(
            `UPDATE users SET ${sets}, updated_at = ? WHERE id = (SELECT id FROM users ORDER BY created_at DESC LIMIT 1)`,
            [...valores, new Date().toISOString()]
        )
        .catch(() => {});
}

// Cadastro do emissor está completo quando NENHUM campo está vazio.
export function emissorCompleto(dados: DadosEmissor): boolean {
    return CAMPOS_EMISSOR.every((c) => dados[c].trim().length > 0);
}
