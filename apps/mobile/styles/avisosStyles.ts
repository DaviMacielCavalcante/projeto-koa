import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

export const avisosStyles = StyleSheet.create({
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 12,
        alignItems: 'center',
    },
    titulo: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.lg,
        color: colors.tealDark,
    },
    subtitulo: {
        fontFamily: fonts.body,
        fontSize: sizes.micro,
        color: colors.inkMute,
        marginTop: 2,
    },
    lista: {
        paddingHorizontal: 16,
        gap: 10,
        paddingBottom: 100,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    cardIcone: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center', justifyContent: 'center',
    },
    cardTitulo: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.body,
        color: colors.white,
    },
    cardSub: {
        fontFamily: fonts.body,
        fontSize: sizes.tiny,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 2,
    },
    vazio: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        gap: 12,
    },
    vazioBadge: {
        width: 110, height: 110, borderRadius: 55,
        backgroundColor: 'rgba(31,122,122,0.12)',
        alignItems: 'center', justifyContent: 'center',
    },
    vazioTitulo: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.lg,
        color: colors.tealDark,
    },
    vazioTexto: {
        fontFamily: fonts.body,
        fontSize: sizes.body,
        color: colors.inkMute,
        textAlign: 'center',
        lineHeight: 22,
    },
});
