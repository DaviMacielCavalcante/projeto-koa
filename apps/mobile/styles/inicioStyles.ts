import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

export const inicioStyles = StyleSheet.create({
    greetCard: {
        backgroundColor: colors.tealDark,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 12,
        borderRadius: 22,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: colors.creamLight,
        alignItems: 'center', justifyContent: 'center',
    },
    greetLabel: {
        fontFamily: fonts.body,
        fontSize: sizes.tiny,
        color: colors.white,
        opacity: 0.85,
    },
    greetName: {
        fontFamily: fonts.display,
        fontSize: sizes.md,
        color: colors.white,
    },
    sectionTitle: {
        fontFamily: fonts.display,
        fontSize: sizes.md,
        color: colors.tealDark,
        textAlign: 'center',
        paddingBottom: 10,
    },
    educationalCard: {
        backgroundColor: colors.white,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 22,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: colors.creamDeep,
    },
    educationalIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.goldMid,
        alignItems: 'center',
        justifyContent: 'center',
    },
    educationalTitle: {
        fontFamily: fonts.display,
        fontSize: 15,
        color: colors.tealDark,
        fontWeight: '700',
    },
    educationalSub: {
        fontFamily: fonts.body,
        fontSize: sizes.tiny,
        color: colors.inkMute,
        marginTop: 2,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    grid: {
        flex: 1,
        paddingHorizontal: 16,
        gap: 10,
        paddingBottom: 100,
    },
    // Card de documento
    docCard: {
        backgroundColor: colors.white,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
    },
    // Destaque do cartão durante o tutorial (passos "docs"/"cores"): anel
    // roxo + brilho, sem pintar o fundo — o conteúdo continua legível.
    docCardDestaque: {
        borderWidth: 3,
        borderColor: colors.highlight,
        shadowColor: colors.highlight,
        shadowOpacity: 0.55,
        shadowRadius: 12,
        elevation: 12,
    },
    docCardBarra: {
        width: 6,
        alignSelf: 'stretch',
    },
    docCardConteudo: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 14,
    },
    docCardNome: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.md,
        color: colors.tealDark,
    },
    docCardSubtitulo: {
        fontFamily: fonts.body,
        fontSize: sizes.caption,
        color: colors.inkMute,
        marginTop: 2,
    },
    docCardBloqueado: {
        opacity: 0.55,
        backgroundColor: colors.creamDeep,
    },
    docCardDireita: {
        paddingHorizontal: 14,
        alignItems: 'center',
        gap: 4,
    },
    docCardStatus: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.caption,
    },
    audioBtn: {
        width: 90, height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerFixed: {
        position: 'absolute',
        bottom: 80,
        right: 24,
    },
});

export const inicioModalStyles = StyleSheet.create({
    fundo: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.94)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    titulo: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.xl,
        color: colors.white,
        marginBottom: 16,
        letterSpacing: 2,
    },
    imagem: {
        width: '100%',
        height: '70%',
    },
    fechar: {
        position: 'absolute',
        top: 52,
        right: 20,
    },
    botaoDetalhes: {
        marginTop: 20,
        paddingHorizontal: 28,
        paddingVertical: 12,
        backgroundColor: colors.tealDark,
        borderRadius: 30,
    },
    botaoDetalhesTexto: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.body,
        color: colors.white,
    },
});
