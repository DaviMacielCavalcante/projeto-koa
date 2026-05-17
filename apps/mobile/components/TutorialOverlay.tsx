import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTutorial } from '../src/contexts/TutorialContext';
import { TUTORIAL_STEPS } from '../src/tutorial/steps';
import { colors, fonts, sizes } from '../design/theme';

export default function TutorialOverlay() {
    const { ativo, etapa, total, proximo, pular } = useTutorial();
    const insets = useSafeAreaInsets();

    if (!ativo) return null;

    const step = TUTORIAL_STEPS[etapa];

    // O componente em foco se destaca sozinho (muda de cor). O callout só
    // precisa não cobrir esse componente: se ele está em cima da tela
    // (calloutPos 'below'), o callout vai pro rodapé; se está embaixo
    // ('above'), o callout vai pro topo. Sem medição, sem coordenadas.
    const noRodape = step.calloutPos === 'below';
    const posCallout = noRodape
        ? { bottom: insets.bottom + 20 }
        : { top: insets.top + 20 };

    return (
        <View style={[StyleSheet.absoluteFillObject, styles.root]}>
            <View style={[styles.callout, posCallout]}>
                <View style={styles.calloutHeader}>
                    <Text style={styles.calloutTitulo}>{step.titulo}</Text>
                    <Text style={styles.calloutContador}>{etapa + 1}/{total}</Text>
                </View>
                <Text style={styles.calloutTexto}>{step.texto}</Text>
                <View style={styles.calloutBotoes}>
                    <TouchableOpacity style={styles.btnPular} onPress={pular}>
                        <Text style={styles.btnPularTexto}>Pular</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnProximo} onPress={proximo}>
                        <Text style={styles.btnProximoTexto}>
                            {etapa + 1 === total ? 'Concluir' : 'Próximo'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { zIndex: 9999, elevation: 9999 },
    callout: {
        position: 'absolute',
        left: 16,
        right: 16,
        backgroundColor: colors.creamLight,
        borderRadius: 20,
        padding: 18,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
    },
    calloutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    calloutTitulo: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.md,
        color: colors.tealDark,
    },
    calloutContador: {
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.caption,
        color: colors.inkMute,
    },
    calloutTexto: {
        fontFamily: fonts.body,
        fontSize: sizes.body,
        color: colors.inkSoft,
        lineHeight: 22,
    },
    calloutBotoes: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    btnPular: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.creamDeep,
        alignItems: 'center',
    },
    btnPularTexto: {
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.body,
        color: colors.inkMute,
    },
    btnProximo: {
        flex: 2,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: colors.tealDark,
        alignItems: 'center',
    },
    btnProximoTexto: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.body,
        color: colors.white,
    },
});
