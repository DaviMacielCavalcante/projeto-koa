import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

export const practiceModeStyles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.goldDark,
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
    },
    bannerTexto: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.bodySm,
        color: colors.white,
        flex: 1,
        textAlign: 'center',
    },
    botaoSair: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    botaoSairTexto: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.caption,
        color: colors.white,
    },
});
