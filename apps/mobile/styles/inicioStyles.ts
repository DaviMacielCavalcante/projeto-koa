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
        fontFamily: fonts.monoSemi,
        fontSize: sizes.md,
        color: colors.white,
    },
    sectionTitle: {
        fontFamily: fonts.monoSemi,
        fontSize: sizes.md,
        color: colors.tealDark,
        textAlign: 'center',
        paddingTop: 15,
        paddingBottom: 10,
        textShadowColor: 'rgb(255, 255, 255)',
        textShadowOffset: { width: 0.5, height: 0.5 },
        textShadowRadius: 8,
    },
    educationalCardWrap: {
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 22,
        shadowColor: colors.tealDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 4,
    },
    educationalCard: {
        borderRadius: 22,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    educationalIcon: {
        width: 64,
        height: 64,
    },
    educationalTitle: {
        fontFamily: fonts.monoSemi,
        fontSize: 16,
        color: colors.tealDark,
    },
    educationalSub: {
        fontFamily: fonts.mono,
        fontSize: sizes.caption,
        color: colors.inkMute,
        marginTop: 2,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    grid: {
        flexGrow: 1,
        gap: 10,
        paddingBottom: 100,
    },
    // Background absoluto da tela inteira
    screenBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    // Carrossel horizontal de documentos
    carouselContent: {
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    carouselItem: {
        marginRight: 12,
    },
    // Card de documento (quadrado)
    docCardSquare: {
        width: 140,
        height: 160,
        backgroundColor: colors.white,
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
    },
    docCardSquareBody: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    docCardSquareNome: {
        fontFamily: fonts.monoSemi,
        fontSize: 22,
        color: colors.tealDark,
        textAlign: 'center',
        letterSpacing: 1,
    },
    docCardSquareSub: {
        fontFamily: fonts.body,
        fontSize: sizes.caption,
        color: colors.inkMute,
        marginTop: 4,
        textAlign: 'center',
    },
    docCardStatusBar: {
        height: 12,
        width: '100%',
    },
    docCardEye: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 2,
    },
    fotoModalFundo: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.92)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fotoModalImagem: {
        width: '90%',
        height: '80%',
    },
    fotoModalFechar: {
        position: 'absolute',
        top: 48,
        right: 20,
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
        fontFamily: fonts.monoSemi,
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
