import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTutorial } from '../src/contexts/TutorialContext';
import { TUTORIAL_STEPS } from '../src/tutorial/steps';
import { colors, fonts, sizes } from '../design/theme';

const { width: W, height: H } = Dimensions.get('window');
const TAB_HEIGHT = 72;
const TAB_W = W / 4;

type Rect = { top: number; left: number; width: number; height: number };

function getZoneRect(zone: string): Rect {
    switch (zone) {
        case 'greet':
            return { top: 60, left: 16, width: W - 32, height: 74 };
        case 'docs':
            return { top: 155, left: 16, width: W - 32, height: H * 0.42 };
        case 'cores':
            return { top: 155, left: 16, width: W - 32, height: H * 0.42 };
        case 'tab-outros':
            return { top: H - TAB_HEIGHT, left: TAB_W, width: TAB_W, height: TAB_HEIGHT };
        case 'tab-avisos':
            return { top: H - TAB_HEIGHT, left: TAB_W * 2, width: TAB_W, height: TAB_HEIGHT };
        case 'tab-ajuda':
            return { top: H - TAB_HEIGHT, left: TAB_W * 3, width: TAB_W, height: TAB_HEIGHT };
        default:
            return { top: H / 2 - 40, left: 16, width: W - 32, height: 80 };
    }
}

export default function TutorialOverlay() {
    const { ativo, etapa, total, proximo, pular } = useTutorial();

    if (!ativo) return null;

    const step = TUTORIAL_STEPS[etapa];
    const rect = getZoneRect(step.zone);
    const isAbove = step.calloutPos === 'above';
    const calloutTop = isAbove ? rect.top - 180 : rect.top + rect.height + 12;

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
            {/* overlay escuro */}
            <View style={[StyleSheet.absoluteFillObject, styles.overlay]} pointerEvents="none" />

            {/* spotlight — borda dourada sobre a área destacada */}
            <View
                style={[styles.spotlight, { top: rect.top, left: rect.left, width: rect.width, height: rect.height }]}
                pointerEvents="none"
            />

            {/* seta */}
            {isAbove ? (
                <View style={[styles.setaBaixo, { top: rect.top - 12, left: rect.left + rect.width / 2 - 8 }]} pointerEvents="none" />
            ) : (
                <View style={[styles.setaCima, { top: rect.top + rect.height, left: rect.left + rect.width / 2 - 8 }]} pointerEvents="none" />
            )}

            {/* callout */}
            <View style={[styles.callout, { top: Math.max(8, Math.min(calloutTop, H - 200)) }]}>
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
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.72)',
    },
    spotlight: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: colors.goldLight,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    setaCima: {
        position: 'absolute',
        width: 0, height: 0,
        borderLeftWidth: 8, borderLeftColor: 'transparent',
        borderRightWidth: 8, borderRightColor: 'transparent',
        borderBottomWidth: 12, borderBottomColor: colors.goldLight,
    },
    setaBaixo: {
        position: 'absolute',
        width: 0, height: 0,
        borderLeftWidth: 8, borderLeftColor: 'transparent',
        borderRightWidth: 8, borderRightColor: 'transparent',
        borderTopWidth: 12, borderTopColor: colors.goldLight,
    },
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
