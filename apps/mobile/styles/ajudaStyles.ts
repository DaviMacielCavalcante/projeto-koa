import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

export const ajudaStyles = StyleSheet.create({
    titulo: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.lg,
        color: colors.tealDark,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
        gap: 12,
        justifyContent: 'flex-end',
        paddingBottom: 32,
    },
    botao: { width: '100%' },
    botaoTeste: { alignItems: 'center', paddingVertical: 12 },
    botaoTesteTexto: { fontFamily: fonts.body, fontSize: sizes.caption, color: colors.inkMute },
    modalFundo: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCaixa: {
        backgroundColor: colors.creamLight,
        borderRadius: 24,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        gap: 14,
    },
    modalTitulo: { fontFamily: fonts.displayBlack, fontSize: sizes.lg, color: colors.redDark },
    modalTexto: { fontFamily: fonts.body, fontSize: sizes.body, color: colors.inkSoft, textAlign: 'center', lineHeight: 22 },
});
