import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

export const roadmapDetailStyles = StyleSheet.create({
    content: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 48,
    },
    audioBubble: {
        marginTop: 18,
        marginBottom: 4,
    },
    titulo: {
        fontFamily: fonts.monoSemi,
        fontSize: sizes.xxl,
        color: colors.tealDark,
        textAlign: 'center',
    },
    tituloConcluido: {
        color: colors.statusGreen,
    },
    categoriaBadge: {
        alignSelf: 'center',
        backgroundColor: colors.tealDark,
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 999,
        marginTop: 10,
    },
    categoriaBadgeText: {
        fontFamily: fonts.bodyBold,
        fontSize: sizes.bodySm,
        color: colors.white,
        letterSpacing: 0.5,
    },
    hero: {
        fontFamily: fonts.body,
        fontSize: sizes.md,
        color: colors.inkSoft,
        textAlign: 'center',
        marginTop: 14,
        marginBottom: 28,
        lineHeight: 24,
    },
    sectionCard: {
        backgroundColor: colors.white,
        borderRadius: 18,
        padding: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.creamDeep,
        flexDirection: 'row',
        gap: 14,
        shadowColor: colors.tealDark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 1,
    },
    sectionIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.creamLight,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    sectionTextWrap: {
        flex: 1,
    },
    sectionTitle: {
        fontFamily: fonts.monoSemi,
        fontSize: sizes.md,
        color: colors.tealDark,
        marginBottom: 4,
    },
    sectionBody: {
        fontFamily: fonts.body,
        fontSize: sizes.body,
        color: colors.inkSoft,
        lineHeight: 22,
    },
    sectionCardFeita: {
        borderColor: colors.statusGreen,
        backgroundColor: colors.creamLight,
    },
    sectionCheck: {
        alignSelf: 'center',
        flexShrink: 0,
    },
    contador: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.bodySm,
        color: colors.inkMute,
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 12,
    },
    resumoCard: {
        backgroundColor: colors.tealDark,
        borderRadius: 22,
        padding: 22,
        marginTop: 18,
        marginBottom: 24,
        flexDirection: 'row',
        gap: 14,
        alignItems: 'center',
    },
    resumoIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.goldMid,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    resumoText: {
        flex: 1,
        fontFamily: fonts.monoSemi,
        fontSize: sizes.md,
        color: colors.white,
        lineHeight: 24,
    },
    botao: {
        marginTop: 4,
    },
    // Botão "Coletar a sua medalha" (um pouco maior que o GradientButton padrão).
    coletarBtn: {
        marginTop: 4,
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    coletarBtnOff: {
        opacity: 0.5,
    },
    coletarGrad: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 18,
        paddingHorizontal: 26,
    },
    coletarMedal: {
        width: 34,
        height: 34,
    },
    coletarLabel: {
        color: colors.white,
        fontFamily: fonts.bodyBold,
        fontSize: sizes.md,
        letterSpacing: 0.3,
    },
    // Estado concluído: medalha grande centralizada (toque pra desfazer).
    medalhaColetada: {
        marginTop: 8,
        alignItems: 'center',
        gap: 8,
    },
    medalhaImg: {
        width: 96,
        height: 96,
    },
    medalhaLabel: {
        fontFamily: fonts.monoSemi,
        fontSize: sizes.md,
        color: colors.statusGreen,
    },
    // Trilha fixa no rodapé: estrada ocupa a largura e o fazendeiro caminha sobre ela.
    scroll: {
        flex: 1,
    },
    // Barra flutuante no rodapé (acima da navbar): estrada de tamanho fixo, centralizada.
    trilhaBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    // Wrapper do tamanho exato da estrada; o fazendeiro é absoluto em relação a ele.
    trilhaRoadWrap: {
        justifyContent: 'flex-end',
    },
    trilhaFarmer: {
        position: 'absolute',
        left: 0,
        bottom: 25,
    },
    placeholder: {
        marginTop: 24,
        marginBottom: 24,
        padding: 28,
        borderRadius: 18,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.creamDeep,
        alignItems: 'center',
    },
    placeholderText: {
        fontFamily: fonts.body,
        fontSize: sizes.body,
        color: colors.inkMute,
        textAlign: 'center',
    },
});
