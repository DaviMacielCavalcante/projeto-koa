import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

export const certificadoStyles = StyleSheet.create({
    conteudo: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        gap: 16,
    },
    titulo: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.lg,
        color: colors.white,
    },
    subtitulo: {
        fontFamily: fonts.body,
        fontSize: sizes.bodySm,
        color: 'rgba(255,255,255,0.75)',
        lineHeight: 20,
        marginTop: -8,
    },

    infoCard: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    infoLinha: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    infoIcone: {
        width: 28,
        alignItems: 'center',
        paddingTop: 1,
    },
    infoTexto: {
        flex: 1,
        fontFamily: fonts.body,
        fontSize: sizes.bodySm,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 19,
    },

    campo: { gap: 6 },
    label: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.bodySm,
        color: 'rgba(255,255,255,0.9)',
    },

    seletor: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.35)',
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    seletorSelecionado: {
        borderStyle: 'solid',
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    seletorIcone: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    seletorInfo: { flex: 1, gap: 2 },
    seletorTitulo: {
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.body,
        color: colors.white,
    },
    seletorSub: {
        fontFamily: fonts.body,
        fontSize: sizes.micro,
        color: 'rgba(255,255,255,0.6)',
    },

    senhaWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 14,
    },
    senhaInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.body,
        color: colors.white,
    },
    senhaToggle: {
        paddingHorizontal: 14,
        paddingVertical: 12,
    },

    rodape: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 8,
    },
});
