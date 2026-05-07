import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        gap: 16,
    },
    titulo: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.xl,
        color: colors.white,
        letterSpacing: 1,
    },
    subtitulo: {
        fontFamily: fonts.body,
        fontSize: sizes.body,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        borderRadius: 30,
        paddingHorizontal: 22,
        paddingVertical: 14,
        fontSize: 18,
        color: colors.white,
        textAlign: 'center',
        fontFamily: fonts.bodyMedium,
    },
    botao: { width: '100%' },
});

export const otpStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        gap: 16,
    },
    titulo: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.xl,
        color: colors.white,
        letterSpacing: 1,
    },
    subtitulo: {
        fontFamily: fonts.body,
        fontSize: sizes.body,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        borderRadius: 30,
        paddingHorizontal: 22,
        paddingVertical: 14,
        fontSize: 32,
        color: colors.white,
        textAlign: 'center',
        fontFamily: fonts.bodyBold,
        letterSpacing: 12,
    },
    botao: { width: '100%' },
});
