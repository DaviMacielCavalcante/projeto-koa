import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, LayoutAnimation } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, TopBar } from '../../design/components';
import { colors, fonts, sizes } from '../../design/theme';

type PerguntaItem = { pergunta: string; resposta: string };

const FAQ: Record<string, PerguntaItem[]> = {
    ITR: [
        {
            pergunta: 'O que é o ITR?',
            resposta: 'É o Imposto Territorial Rural — um imposto que você paga todo ano por ter uma propriedade rural. É cobrado pela Receita Federal.',
        },
        {
            pergunta: 'Quando preciso declarar?',
            resposta: 'Uma vez por ano. O prazo costuma ser até setembro. Se você atrasar, pode ter multa e juros.',
        },
        {
            pergunta: 'Preciso de contador para declarar?',
            resposta: 'Não é obrigatório, mas pode ajudar. Pequenos produtores com imunidade (propriedades menores que 1 módulo fiscal usadas para subsistência) ficam isentos do pagamento.',
        },
        {
            pergunta: 'O que acontece se eu não declarar?',
            resposta: 'Você pode ter problemas para tirar o CCIR, financiar a propriedade ou vender. Além disso, pode receber multa.',
        },
    ],
    CCIR: [
        {
            pergunta: 'O que é o CCIR?',
            resposta: 'É o Certificado de Cadastro de Imóvel Rural, emitido pelo INCRA. Ele prova que sua propriedade está registrada no sistema federal.',
        },
        {
            pergunta: 'Ele tem prazo de validade?',
            resposta: 'Sim. Sempre peça com validade mínima de 30 dias, pois muitos órgãos recusam certidões antigas.',
        },
        {
            pergunta: 'Para que serve o CCIR?',
            resposta: 'É exigido para tirar o CAR, fazer financiamentos rurais, vender a propriedade e regularizar outros documentos.',
        },
        {
            pergunta: 'Preciso pagar algo para tirar?',
            resposta: 'Depende da situação do seu imóvel. Em alguns casos há taxas. Consulte a unidade do INCRA mais próxima.',
        },
    ],
    CAF: [
        {
            pergunta: 'Quem pode ter o CAF?',
            resposta: 'Agricultores familiares que exploram área de até 4 módulos fiscais com mão de obra predominantemente familiar.',
        },
        {
            pergunta: 'Para que serve o CAF?',
            resposta: 'Dá acesso a crédito rural pelo PRONAF, participação no PAA, PNAE e outras políticas públicas voltadas ao agricultor familiar.',
        },
        {
            pergunta: 'O CAF tem validade?',
            resposta: 'Precisa ser atualizado sempre que houver mudança na família, na área explorada ou na renda.',
        },
        {
            pergunta: 'Substitui a DAP?',
            resposta: 'Sim. O CAF substituiu a DAP (Declaração de Aptidão ao Pronaf) a partir de 2023.',
        },
    ],
    CAR: [
        {
            pergunta: 'O CAR é obrigatório?',
            resposta: 'Sim, para qualquer propriedade rural no Brasil. É exigido pelo Código Florestal.',
        },
        {
            pergunta: 'Tem algum custo?',
            resposta: 'Não. O cadastro no SICAR é gratuito.',
        },
        {
            pergunta: 'O que acontece se eu não tiver?',
            resposta: 'Você pode ter dificuldades para acessar crédito rural, vender a propriedade ou participar de programas governamentais.',
        },
        {
            pergunta: 'O CAR precisa ser renovado?',
            resposta: 'Não precisa de renovação periódica, mas pode ser necessário retificá-lo se a análise indicar inconsistências.',
        },
    ],
    'NFA-e': [
        {
            pergunta: 'Para que serve a NFA-e?',
            resposta: 'Para emitir nota fiscal na venda dos seus produtos rurais. Muitos compradores, prefeituras e programas governamentais exigem a nota.',
        },
        {
            pergunta: 'É difícil emitir?',
            resposta: 'Precisa ter os dados do comprador, descrição do produto e valor. Neste app você organiza esses dados antes de ir ao sistema da SEFA-PA.',
        },
        {
            pergunta: 'Preciso da NFA-e para toda venda?',
            resposta: 'Depende do comprador. Para PAA, PNAE, supermercados e empresas geralmente é exigida.',
        },
        {
            pergunta: 'Preciso ter o CAF para emitir?',
            resposta: 'Sim. Você precisa estar cadastrado como produtor rural e ter o CAF ou DAP para emitir a nota fiscal avulsa.',
        },
    ],
};

function ItemFaq({ item }: { item: PerguntaItem }) {
    const [aberto, setAberto] = useState(false);

    function toggle() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setAberto(a => !a);
    }

    return (
        <TouchableOpacity style={styles.item} onPress={toggle} activeOpacity={0.85}>
            <View style={styles.itemHeader}>
                <Text style={styles.pergunta}>{item.pergunta}</Text>
                <Ionicons
                    name={aberto ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.tealDark}
                />
            </View>
            {aberto && (
                <Text style={styles.resposta}>{item.resposta}</Text>
            )}
        </TouchableOpacity>
    );
}

export default function FaqDocumento() {
    const { tipo } = useLocalSearchParams<{ tipo: string }>();
    const perguntas = FAQ[tipo] ?? [];

    return (
        <ScreenContainer variant="teal">
            <TopBar leftIcon="arrow-back" />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.titulo}>Dúvidas sobre o {tipo}</Text>
                <Text style={styles.subtitulo}>
                    Toque em uma pergunta para ver a resposta.
                </Text>
                <View style={styles.lista}>
                    {perguntas.map((item, i) => (
                        <ItemFaq key={i} item={item} />
                    ))}
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 16,
        paddingBottom: 32,
        gap: 12,
    },
    titulo: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.lg,
        color: colors.white,
        marginBottom: 4,
    },
    subtitulo: {
        fontFamily: fonts.body,
        fontSize: sizes.bodySm,
        color: 'rgba(255,255,255,0.75)',
        marginBottom: 8,
        lineHeight: 20,
    },
    lista: { gap: 10 },
    item: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: 16,
        gap: 10,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    pergunta: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.body,
        color: colors.white,
        flex: 1,
        lineHeight: 22,
    },
    resposta: {
        fontFamily: fonts.body,
        fontSize: sizes.bodySm,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 22,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.15)',
    },
});
