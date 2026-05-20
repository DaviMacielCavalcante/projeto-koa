import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

export const botaoConexaoStyles = StyleSheet.create({
    botao: {
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 22,
        minHeight: 56,
        paddingVertical: 14,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    botaoConectado: {
        backgroundColor: colors.tealDark,
    },
    botaoDesconectado: {
        backgroundColor: colors.redDark,
    },
    icone: {
        width: 26,
        height: 26,
        tintColor: colors.white,
    },
    texto: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.md,
        color: colors.white,
    },
});
