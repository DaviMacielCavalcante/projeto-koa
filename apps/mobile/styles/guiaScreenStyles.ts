import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

export const guiaScreenStyles = StyleSheet.create({
    content: { paddingHorizontal: 16, paddingBottom: 32, gap: 14 },
    titulo: { fontFamily: fonts.displayBlack, fontSize: sizes.lg, color: colors.white, fontWeight: '900', marginBottom: 4 },
    card: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 18, padding: 16, gap: 4 },
    cardTitulo: { fontFamily: fonts.bodySemi, fontSize: sizes.body, color: colors.white, marginBottom: 8 },
    cardTexto: { fontFamily: fonts.body, fontSize: sizes.bodySm, color: 'rgba(255,255,255,0.85)' },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.15)',
    },
    itemIcone: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: colors.creamLight,
        alignItems: 'center', justifyContent: 'center',
    },
    itemTexto: { fontFamily: fonts.bodyMedium, fontSize: sizes.body, color: colors.white, flex: 1 },
    botao: { width: '100%' },
    itemCritico: {
        backgroundColor: 'rgba(200,95,46,0.12)',
        borderRadius: 10,
        marginHorizontal: -4,
        paddingHorizontal: 4,
        borderBottomWidth: 0,
        marginBottom: 4,
    },
    itemIconeCritico: {
        backgroundColor: 'rgba(200,95,46,0.18)',
    },
    itemTextoCritico: {
        color: colors.white,
        fontFamily: fonts.bodySemi,
    },
    itemTagCritico: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.micro,
        color: colors.orangeLight,
        marginTop: 2,
        letterSpacing: 0.3,
        textTransform: 'uppercase' as const,
    },
    cardCabecalho: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    passoItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.15)',
    },
    passoNumero: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    passoNumeroTexto: {
        fontFamily: fonts.bodyBold,
        fontSize: sizes.bodySm,
        color: colors.white,
    },
    passoTexto: {
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.body,
        color: 'rgba(255,255,255,0.9)',
        flex: 1,
        lineHeight: 22,
    },
});
