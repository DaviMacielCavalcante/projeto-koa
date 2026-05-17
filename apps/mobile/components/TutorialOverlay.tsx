import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, InteractionManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useTutorial } from '../src/contexts/TutorialContext';
import { TUTORIAL_STEPS } from '../src/tutorial/steps';
import { colors, fonts, sizes } from '../design/theme';

const { width: W, height: H } = Dimensions.get('window');
const TAB_W = W / 4;

type Rect = { top: number; left: number; width: number; height: number };

export default function TutorialOverlay() {
    const { ativo, etapa, total, rects, medirTudo, proximo, pular } = useTutorial();
    const insets = useSafeAreaInsets();
    const TAB_HEIGHT = 72 + insets.bottom;
    const [pronto, setPronto] = useState(false);

    useEffect(() => {
        if (!ativo) { setPronto(false); return; }
        setPronto(false);
        const task = InteractionManager.runAfterInteractions(() => {
            requestAnimationFrame(() => {
                medirTudo().then(() => setPronto(true));
            });
        });
        return () => task.cancel();
    }, [ativo, etapa]);

    if (!ativo) return null;

    const step = TUTORIAL_STEPS[etapa];

    function getRect(): Rect {
        if (rects[step.zone]) return rects[step.zone];

        switch (step.zone) {
            case 'tab-outros':
                return { top: H - TAB_HEIGHT, left: TAB_W, width: TAB_W, height: TAB_HEIGHT };
            case 'tab-avisos':
                return { top: H - TAB_HEIGHT, left: TAB_W * 2, width: TAB_W, height: TAB_HEIGHT };
            case 'tab-ajuda':
                return { top: H - TAB_HEIGHT, left: TAB_W * 3, width: TAB_W, height: TAB_HEIGHT };
            case 'doc-hero':
                return { top: insets.top + 56, left: 16, width: W - 32, height: 160 };
            case 'doc-status':
                return { top: insets.top + 220, left: W / 2 - 70, width: 140, height: 140 };
            case 'doc-acoes':
                return { top: H - TAB_HEIGHT - 200, left: 16, width: W - 32, height: 180 };
            default:
                return { top: H / 2 - 40, left: 16, width: W - 32, height: 80 };
        }
    }

    const rawRect = getRect();
    const rect = { ...rawRect, width: Math.min(rawRect.width, W - rawRect.left) };
    const isAbove = step.calloutPos === 'above';
    const calloutTop = isAbove ? rect.top - 250 : rect.top + rect.height + 14;
    const calloutTopClamped = Math.max(insets.top + 8, Math.min(calloutTop, H - 220));

    return (
        <Modal visible transparent animationType="fade" statusBarTranslucent>
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'transparent' }]} pointerEvents="box-none">
                <View style={[StyleSheet.absoluteFillObject, styles.overlay]} pointerEvents="none" />

                {pronto && <>
                    <View
                        style={[styles.spotlight, {
                            top: rect.top,
                            left: rect.left,
                            width: rect.width,
                            height: rect.height,
                        }]}
                        pointerEvents="none"
                    />

                    {isAbove ? (
                        <View style={[styles.setaBaixo, { top: rect.top - 13, left: rect.left + rect.width / 2 - 8 }]} pointerEvents="none" />
                    ) : (
                        <View style={[styles.setaCima, { top: rect.top + rect.height, left: rect.left + rect.width / 2 - 8 }]} pointerEvents="none" />
                    )}

                    <View style={[styles.callout, { top: calloutTopClamped }]}>
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
                </>}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { backgroundColor: 'rgba(0,0,0,0.72)' },
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
        borderBottomWidth: 13, borderBottomColor: colors.goldLight,
    },
    setaBaixo: {
        position: 'absolute',
        width: 0, height: 0,
        borderLeftWidth: 8, borderLeftColor: 'transparent',
        borderRightWidth: 8, borderRightColor: 'transparent',
        borderTopWidth: 13, borderTopColor: colors.goldLight,
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
