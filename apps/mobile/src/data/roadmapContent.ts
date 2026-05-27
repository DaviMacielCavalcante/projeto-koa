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
    CAR: {
        category: 'CAR',
        hero: 'O registro ambiental da sua terra',
        sections: [
            {
                icon: 'information-circle',
                title: 'O que é',
                body:
                    'É o registro qualitativo da terra. Verifica como a área total está sendo usada: ' +
                    'área produtiva, área de preservação permanente, área de vegetação nativa, ' +
                    'área doméstica e outras.',
            },
            {
                icon: 'ribbon',
                title: 'Para que serve',
                body:
                    'Garante ao agricultor o direito de requerer benefícios e serviços, como ' +
                    'financiamento rural, venda, doação ou transferência da titularidade do imóvel, ' +
                    'e redução de taxas no Imposto sobre a Propriedade Territorial Rural (ITR).',
            },
            {
                icon: 'location',
                title: 'Como tirar',
                body: 'O registro é feito online no site da SEMAS/PA.',
            },
            {
                icon: 'document-text',
                title: 'O que precisa',
                body:
                    'CCIR válido e atualizado (emitido pelo INCRA), documento de propriedade ' +
                    '(escritura, contrato de cessão de posse ou título definitivo), CPF ou CNPJ ' +
                    'do proprietário, coordenadas GPS da propriedade (latitude/longitude), planta, ' +
                    'croqui ou mapa da área (se disponível) e dados dos confrontantes ' +
                    '(nome e informações dos vizinhos).',
            },
            {
                icon: 'time',
                title: 'Prazos',
                body:
                    'Após o registro, envie os dados requisitados pelo site em até 30 dias e ' +
                    'acompanhe a análise até que seja deferido.',
            },
            {
                icon: 'alert-circle',
                title: 'Observação',
                body:
                    'Normalmente contrata-se uma empresa de consultoria ambiental para fazer ' +
                    'o CAR, pois são necessários vários procedimentos técnicos.',
            },
        ],
        resumo: 'Sem CAR não há financiamento, venda da terra nem redução de ITR.',
    },

    CCIR: {
        category: 'CCIR',
        hero: 'A identidade do seu imóvel rural',
        sections: [
            {
                icon: 'information-circle',
                title: 'O que é',
                body:
                    'É o Certificado de Cadastro do Imóvel Rural. Funciona como a identidade ' +
                    'do imóvel.',
            },
            {
                icon: 'ribbon',
                title: 'Para que serve',
                body:
                    'Traz segurança jurídica, permite calcular corretamente o ITR, possibilita ' +
                    'a venda ou transferência da terra e dá acesso a créditos rurais.',
            },
            {
                icon: 'location',
                title: 'Como tirar',
                body:
                    'É emitido online no site sncr.serpro.gov.br. São necessários apenas: código ' +
                    'do imóvel rural, estado e município onde se encontra o imóvel, e CPF do titular.',
            },
            {
                icon: 'time',
                title: 'Atualização',
                body:
                    'Precisa ser atualizado anualmente pelo mesmo site de emissão, com a ' +
                    'atualização dos dados cadastrais e pagamento de uma taxa.',
            },
            {
                icon: 'alert-circle',
                title: 'Observação',
                body:
                    'Datas, prazos e valores são informados pelo próprio site no ato da ' +
                    'emissão ou atualização.',
            },
        ],
        resumo: 'CCIR é a identidade da sua terra — atualize todo ano.',
    },

    ITR: {
        category: 'ITR',
        hero: 'O imposto anual da terra',
        sections: [
            {
                icon: 'information-circle',
                title: 'O que é',
                body:
                    'É o imposto que o produtor rural paga uma vez ao ano, conforme o calendário ' +
                    'da Receita Federal. Não é um documento de registro, apenas o imposto sobre ' +
                    'o imóvel.',
            },
            {
                icon: 'ribbon',
                title: 'Para que serve',
                body:
                    'Pagar o ITR mantém a propriedade regularizada, pois é um imposto federal ' +
                    'obrigatório.',
            },
            {
                icon: 'location',
                title: 'Como pagar',
                body:
                    'Acesse o site da Receita Federal e procure o serviço de declaração do ITR ' +
                    '(DITR). Preencha os documentos DIAC e DIAT para apuração da terra e cálculo ' +
                    'do imposto. Envie a documentação pelo mesmo site e aguarde o boleto, que ' +
                    'pode ser pago à vista ou parcelado.',
            },
            {
                icon: 'help-circle',
                title: 'Como é calculado',
                body:
                    'O imposto não incide sobre a área total da propriedade, mas sobre o valor ' +
                    'da terra nua tributável (VTN), que corresponde à área produtiva e de moradia. ' +
                    'O valor varia progressivamente conforme a área e o grau de utilização da terra.',
            },
            {
                icon: 'alert-circle',
                title: 'Isenção',
                body: 'No Pará, propriedades com menos de 50 hectares são isentas do ITR.',
            },
        ],
        resumo: 'Pagar o ITR todo ano mantém sua terra regular com a Receita.',
    },

    'NFA-e': {
        category: 'Nota Fiscal',
        hero: 'O registro oficial das suas vendas e despesas',
        sections: [
            {
                icon: 'information-circle',
                title: 'O que é',
                body: 'É o registro oficial de cada receita e despesa do agricultor.',
            },
            {
                icon: 'ribbon',
                title: 'Para que serve',
                body:
                    'Serve como registro e comprovante das movimentações financeiras do ' +
                    'agricultor, dando respaldo legal para declaração de imposto de renda e ' +
                    'outras atividades comprobatórias.',
            },
            {
                icon: 'document-text',
                title: 'Certificado digital',
                body:
                    'Para emitir a NFP-e, o produtor precisa de um certificado digital pago, ' +
                    'que garante a validação da nota fiscal eletrônica pelas autoridades fiscais. ' +
                    'Existem tipos diferentes de certificado, variando em validade e forma de ' +
                    'armazenamento. Para comprar, acesse o site gov.br e pesquise por ' +
                    '"certificado digital".',
            },
            {
                icon: 'location',
                title: 'Como emitir',
                body:
                    'O produtor precisa estar registrado no site da SEFA. Inicie a emissão, ' +
                    'preencha as informações da nota e assine com o certificado digital. Envie ' +
                    'a nota assinada para o site da SEFA, que devolverá a nota emitida ao produtor.',
            },
            {
                icon: 'alert-circle',
                title: 'Observação',
                body:
                    'Guarde todas as notas emitidas por pelo menos 5 anos, em caso de pedido de ' +
                    'comprovação dos dados apresentados no imposto de renda pela Receita Federal.',
            },
        ],
        resumo: 'Sem certificado digital, sem nota fiscal — guarde tudo por 5 anos.',
    },
};

export function getRoadmapContent(category: string | null | undefined): RoadmapTopicContent | null {
    if (!category) return null;
    return roadmapContent[category] ?? null;
}
