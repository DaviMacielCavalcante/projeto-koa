import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

export type RoadmapSection = {
    icon: IconName;
    title: string;
    body: string;
};

export type RoadmapTopicContent = {
    category: string;
    hero: string;
    sections: RoadmapSection[];
    resumo: string;
};

export const roadmapContent: Record<string, RoadmapTopicContent> = {
    CAF: {
        category: 'CAF',
        hero: 'O documento que prova que você é agricultor familiar',
        sections: [
            {
                icon: 'information-circle',
                title: 'O que é',
                body:
                    'É o papel que o governo usa pra reconhecer você como agricultor familiar. ' +
                    'Substituiu a DAP (Declaração de Aptidão ao Pronaf) desde 2023.',
            },
            {
                icon: 'ribbon',
                title: 'Pra que serve',
                body:
                    'Com o CAF você consegue empréstimo do Pronaf, vende pra merenda escolar (PNAE), ' +
                    'entra no PAA e tem direito à aposentadoria rural.',
            },
            {
                icon: 'location',
                title: 'Onde tirar',
                body:
                    'Procure a EMATER, o sindicato dos trabalhadores rurais ou uma cooperativa ' +
                    'do seu município. Não tem custo.',
            },
            {
                icon: 'document-text',
                title: 'O que precisa levar',
                body:
                    'RG, CPF, comprovante de moradia, documento da terra (escritura, posse ou contrato) ' +
                    'e dados da sua produção.',
            },
            {
                icon: 'time',
                title: 'Validade',
                body: 'O CAF vale por 2 anos. Depois você renova com os mesmos documentos.',
            },
        ],
        resumo: 'Sem CAF, nada de Pronaf nem de venda pro governo.',
    },

    CAR: {
        category: 'CAR',
        hero: 'O registro ambiental da sua terra',
        sections: [
            {
                icon: 'information-circle',
                title: 'O que é',
                body:
                    'É um cadastro feito pela internet que mostra como sua terra está dividida: ' +
                    'mata, plantação, rio, pastagem.',
            },
            {
                icon: 'ribbon',
                title: 'Pra que serve',
                body:
                    'É obrigatório por lei. Sem CAR você não consegue financiamento, não vende a terra ' +
                    'e pode receber multa do órgão ambiental.',
            },
            {
                icon: 'location',
                title: 'Onde tirar',
                body:
                    'No site car.gov.br, na SEMA do Amazonas ou pedindo ajuda na EMATER. ' +
                    'Não paga nada.',
            },
            {
                icon: 'document-text',
                title: 'O que precisa levar',
                body:
                    'CPF, documento da terra e o mapa da propriedade. A EMATER ou um técnico ' +
                    'agrícola pode te ajudar a fazer o mapa.',
            },
            {
                icon: 'time',
                title: 'Validade',
                body:
                    'Não vence. Mas se mudar alguma coisa na terra (novo plantio, desmate, ' +
                    'venda de parte), tem que atualizar.',
            },
        ],
        resumo: 'Cadastrou uma vez, fica valendo. Não esquece de atualizar quando mudar a terra.',
    },

    CCIR: {
        category: 'CCIR',
        hero: 'O documento do INCRA pra sua terra',
        sections: [
            {
                icon: 'information-circle',
                title: 'O que é',
                body: 'É o papel do INCRA que comprova o cadastro do seu imóvel rural.',
            },
            {
                icon: 'ribbon',
                title: 'Pra que serve',
                body:
                    'Você precisa dele pra vender, doar, trocar ou hipotecar a terra. ' +
                    'Também é exigido em financiamento e em inventário.',
            },
            {
                icon: 'location',
                title: 'Onde tirar',
                body:
                    'Pelo site do INCRA (sncr.serpro.gov.br) ou indo no escritório do INCRA ' +
                    'mais próximo da sua cidade.',
            },
            {
                icon: 'document-text',
                title: 'O que precisa levar',
                body: 'Número do imóvel no INCRA e CPF do dono da terra.',
            },
            {
                icon: 'time',
                title: 'Validade',
                body: 'Vale por 1 ano. Você renova pagando a taxa anual do INCRA.',
            },
        ],
        resumo: 'Sem CCIR em dia, você não vende nem passa a terra pra ninguém.',
    },

    ITR: {
        category: 'ITR',
        hero: 'O imposto anual da terra',
        sections: [
            {
                icon: 'information-circle',
                title: 'O que é',
                body: 'É um imposto que o dono da terra paga todo ano pra Receita Federal.',
            },
            {
                icon: 'ribbon',
                title: 'Pra que serve',
                body:
                    'Pra cumprir a lei. Quem não declara fica em débito com a Receita ' +
                    'e pode perder direito a benefícios.',
            },
            {
                icon: 'calendar',
                title: 'Quando declarar',
                body: 'A declaração é entregue todo ano, de agosto a setembro.',
            },
            {
                icon: 'location',
                title: 'Onde declarar',
                body:
                    'Pelo programa do ITR no site da Receita Federal (gov.br/receitafederal) ' +
                    'ou com a ajuda de um contador.',
            },
            {
                icon: 'help-circle',
                title: 'Pode ter isenção',
                body:
                    'Pequena propriedade familiar com até 4 módulos fiscais pode ser isenta de pagar. ' +
                    'Mas mesmo isento, você precisa declarar.',
            },
        ],
        resumo: 'Mesmo isento, declare todo ano pra ficar regular com a Receita.',
    },

    'NFA-e': {
        category: 'NFA-e',
        hero: 'A nota fiscal do agricultor familiar',
        sections: [
            {
                icon: 'information-circle',
                title: 'O que é',
                body:
                    'É a nota fiscal eletrônica que o pequeno produtor usa cada vez ' +
                    'que vende a produção.',
            },
            {
                icon: 'ribbon',
                title: 'Pra que serve',
                body:
                    'Pra vender legalmente pra feiras, mercados, governo e outras pessoas. ' +
                    'É o que comprova a sua renda como agricultor.',
            },
            {
                icon: 'location',
                title: 'Onde tirar',
                body:
                    'Pelo site da SEFAZ do Amazonas (sefaz.am.gov.br) ou indo numa agência ' +
                    'de atendimento da SEFAZ.',
            },
            {
                icon: 'document-text',
                title: 'O que precisa ter',
                body:
                    'Inscrição estadual de produtor rural, CPF e os dados de cada venda: ' +
                    'o que vendeu, pra quem, quanto pesou e por quanto.',
            },
            {
                icon: 'alert-circle',
                title: 'Atenção',
                body:
                    'Você precisa preencher uma NFA-e pra cada venda. Guarde o número da nota ' +
                    'pra comprovar depois.',
            },
        ],
        resumo: 'Sem NFA-e, a venda não conta como produção legal.',
    },
};

export function getRoadmapContent(category: string | null | undefined): RoadmapTopicContent | null {
    if (!category) return null;
    return roadmapContent[category] ?? null;
}
