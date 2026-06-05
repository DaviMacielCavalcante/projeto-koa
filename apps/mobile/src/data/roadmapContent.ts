import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

export type RoadmapSection = {
    icon: IconName;
    title: string;
    body: string;
};

export type RoadmapTopicContent = {
    hero: string;
    sections: RoadmapSection[];
    resumo: string;
};

// Conteúdo rico de cada tópico, indexado pelo `id` do tópico (ver TOPICOS em
// src/db/seedEducationalContents.ts). O título, a categoria (selo), o capítulo e a
// ordem ficam lá; aqui mora o hero, as seções e o resumo.
export const roadmapContent: Record<string, RoadmapTopicContent> = {
    CAR: {
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

    // ─── Capítulo 2: Nota Fiscal ────────────────────────────────────────────────
    // TODO: hero e resumo dos 4 tópicos abaixo serão enviados pelo usuário.

    'NF-introducao': {
        hero: '',
        sections: [
            {
                icon: 'information-circle',
                title: 'O que é a nota fiscal',
                body: 'É o registro oficial de cada receita e despesa do agricultor.',
            },
            {
                icon: 'ribbon',
                title: 'Para que serve',
                body:
                    'Serve como registro e comprovante das movimentações financeiras do ' +
                    'agricultor, possibilitando respaldo legal sobre elas para fins de declaração ' +
                    'de imposto de renda ou outras atividades comprobatórias.',
            },
        ],
        resumo: '',
    },

    'NF-documentos': {
        hero: '',
        sections: [
            {
                icon: 'document-text',
                title: 'Para emitir a nota',
                body:
                    'Você vai precisar de: cadastro no site da SEFA, certificado digital e um ' +
                    'programa de preenchimento de nota fiscal.',
            },
            {
                icon: 'cart',
                title: 'Dados da compra',
                body: 'Data, produto, quantidade, valor unitário, valor total e forma de pagamento.',
            },
            {
                icon: 'person',
                title: 'Dados do vendedor',
                body: 'Nome e CPF ou CNPJ.',
            },
            {
                icon: 'people',
                title: 'Dados do cliente',
                body: 'Nome e CPF ou CNPJ.',
            },
            {
                icon: 'alert-circle',
                title: 'Recomendação',
                body:
                    'Certifique-se de que terá acesso a todos esses documentos e informações. ' +
                    'No momento de cada venda, esteja pronto para preencher os dados da nota ' +
                    'corretamente.',
            },
        ],
        resumo: '',
    },

    'NF-certificado': {
        hero: '',
        sections: [
            {
                icon: 'information-circle',
                title: 'Por que é necessário',
                body:
                    'Para emitir a NFP-e, o produtor precisa de um certificado digital pago, que ' +
                    'garante que a nota fiscal eletrônica seja validada pelas autoridades fiscais. ' +
                    'Existem tipos diferentes, que variam no tempo de validade e na forma de ' +
                    'armazenamento. Para comprar, acesse o site gov.br e pesquise por ' +
                    '"certificado digital".',
            },
            {
                icon: 'document',
                title: 'Tipo A1',
                body:
                    'Tem validade de 1 ano e, por ser um arquivo, pode ser instalado facilmente ' +
                    'em vários computadores mediante cópia de segurança (backup) do arquivo.',
            },
            {
                icon: 'key',
                title: 'Tipo A3',
                body:
                    'Tem validade de até 5 anos e é usado por meio de mídia criptográfica (token ' +
                    'ou cartão USB) que precisa estar conectada ao computador a cada uso. O ' +
                    'certificado só pode ser baixado no token uma única vez; em caso de perda da ' +
                    'mídia, perde-se também o certificado digital.',
            },
            {
                icon: 'cloud',
                title: 'Certificado em nuvem (SerproID)',
                body:
                    'Diminui o risco dessa perda, por ficar armazenado na nuvem do Serpro e ser ' +
                    'usado no smartphone. Pode ser instalado em vários computadores e celulares, ' +
                    'mas, a cada uso, é enviado um pedido de autorização para o celular.',
            },
            {
                icon: 'checkmark-circle',
                title: 'Recomendado para o agricultor',
                body:
                    'O "e-CNPJ | A1 - 1 ano", para pessoa jurídica. Custa R$ 218,00, está ' +
                    'disponível no site gov.br, pode ser baixado para celular ou computador e ' +
                    'tem validade de 1 ano.',
            },
        ],
        resumo: '',
    },

    'NF-emissao': {
        hero: '',
        sections: [
            {
                icon: 'create',
                title: 'Como preencher e emitir',
                body:
                    'Use a funcionalidade de criação de nota no aplicativo para preencher as ' +
                    'informações necessárias e salvar o arquivo. Depois, assine a nota com o ' +
                    'certificado digital. Feito isso, envie a nota assinada para o site da SEFA, ' +
                    'que a retornará emitida ao produtor.',
            },
            {
                icon: 'alert-circle',
                title: 'Observação',
                body:
                    'Guarde todas as notas emitidas por pelo menos 5 anos, em caso de pedido de ' +
                    'comprovação dos dados apresentados no imposto de renda pela Receita Federal.',
            },
        ],
        resumo: '',
    },
};
