import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

export const detalheDocumentoStyles = StyleSheet.create({
    top: { paddingHorizontal: 22, alignItems: 'center', paddingTop: 4 },
    titulo: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.xl,
        color: colors.white,
        fontWeight: '900',
        letterSpacing: 1,
    },
    subtitulo: {
        fontFamily: fonts.body,
        fontSize: sizes.caption,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
        textAlign: 'center',
    },
    statusCircle: {
        width: 120, height: 120, borderRadius: 60,
        alignItems: 'center', justifyContent: 'center',
        marginVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    statusBig: { fontFamily: fonts.display, fontSize: sizes.lg, color: colors.white, fontWeight: '800' },
    statusSub: {
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.tiny,
        color: colors.white,
        opacity: 0.95,
        marginTop: 4,
        letterSpacing: 0.5,
    },
    descricao: {
        fontFamily: fonts.body,
        fontSize: sizes.bodySm,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        paddingHorizontal: 12,
        lineHeight: 20,
    },
    validade: { fontFamily: fonts.bodyMedium, fontSize: sizes.caption, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
    acoes: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        paddingTop: 18,
        gap: 10,
        marginTop: 'auto' as const,
    },
    player: { position: 'absolute', bottom: 24, right: 24 },
});
