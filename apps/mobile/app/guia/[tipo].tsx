import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, Linking, ScrollView } from 'react-native';
import { guiaScreenStyles as styles } from '../../styles/guiaScreenStyles';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GradientButton, TopBar } from '../../design/components';
import { colors } from '../../design/theme';

type ItemLevar = { icone: keyof typeof Ionicons.glyphMap; label: string };
type Passo = { numero: number; texto: string };
type Opcao = { titulo: string; icone: keyof typeof Ionicons.glyphMap; linhas: string[] };

type GuiaInfo = {
    onde: Opcao[];
    passos?: Passo[];
    levar: ItemLevar[];
    telefone?: string;
    horario?: string;
};

const EMATER_TEL = 'tel:+5591XXXXXXXX';
const INCRA_TEL = 'tel:+5500XXXXXXXX';
const HORARIO_PADRAO = 'Segunda a sexta, das 8h às 14h';

const GUIAS: Record<string, GuiaInfo> = {
    CAF: {
        onde: [
            {
                titulo: 'Presencial',
                icone: 'business',
                linhas: [
                    'A inscrição é feita pessoalmente na entidade cadastradora do CAF do seu município',
                    'Consulte a lista de entidades no site do CAF, filtrando pelo seu município',
                    'Tempo estimado: até 1 hora por etapa',
                ],
            },
        ],
        passos: [
            { numero: 1, texto: 'Reúna os documentos listados na seção abaixo antes de ir' },
            { numero: 2, texto: 'Vá pessoalmente à entidade cadastradora do CAF no seu município' },
            { numero: 3, texto: 'A entidade vai conferir seus documentos e verificar se você atende aos requisitos' },
            { numero: 4, texto: 'Informe os dados da sua família: todos os membros maiores de 16 anos, as áreas que vocês trabalham, a renda de cada um e os endereços da família e da propriedade' },
            { numero: 5, texto: 'Os documentos comprobatórios serão anexados no sistema pela entidade' },
        ],
        levar: [
            { icone: 'card', label: 'CPF de todos os membros com mais de 16 anos' },
            { icone: 'id-card', label: 'Documentos de identificação de todos os membros da família' },
            { icone: 'document', label: 'Prova de propriedade ou posse: matrícula, escritura, ITR, CCIR, contratos ou cessão' },
            { icone: 'home', label: 'Comprovante de endereço da residência da família' },
            { icone: 'map', label: 'Comprovante da área explorada pela família' },
            { icone: 'cash', label: 'Comprovante de renda de todos os membros (não precisa para benefícios do INSS)' },
            { icone: 'storefront', label: 'Comprovante de renda do estabelecimento rural (ex: Bloco do Produtor Rural)' },
        ],
        telefone: EMATER_TEL,
    },

    CAR: {
        onde: [
            {
                titulo: 'Online — SICAR/PA',
                icone: 'globe',
                linhas: ['Acesse o sistema SICAR/PA pelo computador para vetorizar e enviar o cadastro'],
            },
            {
                titulo: 'Presencial',
                icone: 'business',
                linhas: ['Escritório da EMATER em Moju pode orientar no processo', HORARIO_PADRAO],
            },
        ],
        passos: [
            { numero: 1, texto: 'Reúna os documentos listados na seção abaixo antes de começar' },
            { numero: 2, texto: 'No SICAR/PA, desenhe o contorno da sua propriedade usando a imagem de satélite como base' },
            { numero: 3, texto: 'Dentro da propriedade, marque as áreas protegidas: beiras de rio, nascentes, lagos, topos de morro (chamadas APPs), a Reserva Legal (no Pará é no mínimo 80% de mata nativa), e as áreas onde já se planta ou cria gado' },
            { numero: 4, texto: 'Finalize e envie o cadastro no SICAR/PA. Guarde bem o recibo que aparecer na tela' },
            { numero: 5, texto: 'Crie uma conta na Central do Proprietário no SICAR/PA. Por lá você recebe avisos, envia documentos e acompanha se o seu CAR está ativo, pendente ou suspenso' },
        ],
        levar: [
            { icone: 'document', label: 'CCIR válido e atualizado (emitido pelo INCRA)' },
            { icone: 'home', label: 'Escritura, contrato de cessão de posse ou título definitivo' },
            { icone: 'card', label: 'CPF ou CNPJ do proprietário/possuidor' },
            { icone: 'navigate', label: 'Coordenadas GPS da propriedade (latitude/longitude)' },
            { icone: 'map', label: 'Planta, croqui ou mapa da área (se disponível)' },
            { icone: 'people', label: 'Dados dos confrontantes (nome e informações dos vizinhos)' },
        ],
        telefone: EMATER_TEL,
    },

    CCIR: {
        onde: [
            {
                titulo: 'Online',
                icone: 'globe',
                linhas: ['Acesse o CCIR do seu imóvel rural pelo site do INCRA'],
            },
            {
                titulo: 'Presencial',
                icone: 'business',
                linhas: [
                    'Salas de Cidadania das unidades do INCRA',
                    'Unidades Municipais de Cadastramento',
                    'Consulte os contatos do INCRA mais próximo',
                ],
            },
        ],
        passos: [
            { numero: 1, texto: 'Baixe os formulários do INCRA' },
            { numero: 2, texto: 'Preencha os formulários com os dados do imóvel' },
            { numero: 3, texto: 'Reúna os documentos necessários' },
            { numero: 4, texto: 'Apresente presencialmente ou envie pelo site' },
        ],
        levar: [
            { icone: 'document', label: 'Escritura ou matrícula do imóvel' },
            { icone: 'calendar', label: 'Matrícula atualizada (validade de 30 dias)' },
            { icone: 'card', label: 'CPF' },
        ],
        telefone: INCRA_TEL,
    },

    ITR: {
        onde: [
            {
                titulo: 'Online — Receita Federal',
                icone: 'globe',
                linhas: [
                    'Acesse "Minhas Declarações do ITR" no site da Receita Federal',
                    'Ou baixe o programa PGD no site da Receita para fazer no computador',
                    'Atendimento imediato — sem espera',
                ],
            },
        ],
        passos: [
            { numero: 1, texto: 'Reúna os documentos listados na seção abaixo' },
            { numero: 2, texto: 'Preencha e envie a declaração pelo site da Receita Federal ou pelo programa PGD' },
            { numero: 3, texto: 'Acompanhe o processamento consultando o extrato da declaração no site da Receita' },
            { numero: 4, texto: 'Se aparecer a situação "retida em malha", corrija as informações erradas e envie uma declaração retificadora (nova versão corrigida)' },
        ],
        levar: [
            { icone: 'card', label: 'CPF' },
            { icone: 'document', label: 'CCIR atualizado' },
            { icone: 'home', label: 'Dados da propriedade: área total, município e uso do solo' },
        ],
        telefone: EMATER_TEL,
    },

    'NFA-e': {
        onde: [
            {
                titulo: 'Online',
                icone: 'globe',
                linhas: ['Portal da SEFA-PA (Secretaria da Fazenda do Pará)'],
            },
            {
                titulo: 'Presencial',
                icone: 'business',
                linhas: ['Escritório da EMATER em Moju pode orientar', HORARIO_PADRAO],
            },
        ],
        levar: [
            { icone: 'card', label: 'CPF' },
            { icone: 'document', label: 'CAF ou DAP' },
            { icone: 'storefront', label: 'Dados do comprador' },
        ],
        telefone: EMATER_TEL,
    },
};

export default function GuiaDocumento() {
    const { tipo } = useLocalSearchParams<{ tipo: string }>();
    const guia = GUIAS[tipo];

    if (!guia) return null;

    return (
        <ScreenContainer variant="teal">
            <TopBar leftIcon="arrow-back" rightIcon="volume-high" />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <Text style={styles.titulo}>Como conseguir o {tipo}</Text>

                {/* Onde ir */}
                {guia.onde.map((opcao) => (
                    <View key={opcao.titulo} style={styles.card}>
                        <View style={styles.cardCabecalho}>
                            <View style={styles.itemIcone}>
                                <Ionicons name={opcao.icone} size={20} color={colors.tealDark} />
                            </View>
                            <Text style={styles.cardTitulo}>{opcao.titulo}</Text>
                        </View>
                        {opcao.linhas.map((linha, i) => (
                            <Text key={i} style={styles.cardTexto}>{linha}</Text>
                        ))}
                    </View>
                ))}

                {/* Passos (opcional) */}
                {guia.passos && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitulo}>Passo a passo</Text>
                        {guia.passos.map((passo) => (
                            <View key={passo.numero} style={styles.passoItem}>
                                <View style={styles.passoNumero}>
                                    <Text style={styles.passoNumeroTexto}>{passo.numero}</Text>
                                </View>
                                <Text style={styles.passoTexto}>{passo.texto}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* O que levar */}
                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>O que levar</Text>
                    {guia.levar.map((item, i) => (
                        <View key={item.label} style={[styles.item, i === guia.levar.length - 1 && { borderBottomWidth: 0 }]}>
                            <View style={styles.itemIcone}>
                                <Ionicons name={item.icone} size={22} color={colors.tealDark} />
                            </View>
                            <Text style={styles.itemTexto}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                {guia.telefone && (
                    <GradientButton
                        label="Ligar para o órgão responsável"
                        variant="teal"
                        onPress={() => Linking.openURL(guia.telefone!)}
                        style={styles.botao}
                    />
                )}
                <GradientButton
                    label="Já tenho, quero guardar"
                    variant="gold"
                    onPress={() => router.push(`/camera/${tipo}`)}
                    style={styles.botao}
                />
            </ScrollView>
        </ScreenContainer>
    );
}
