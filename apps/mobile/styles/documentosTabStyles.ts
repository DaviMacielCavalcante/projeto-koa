import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

export const documentosTabStyles = StyleSheet.create({
    titulo: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.lg,
        color: colors.tealDark,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    lista: { paddingHorizontal: 16, paddingBottom: 100, gap: 10 },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 18,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    itemIcone: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: colors.creamDeep,
        alignItems: 'center', justifyContent: 'center',
        marginRight: 12,
    },
    itemInfo: { flex: 1 },
    itemTipo: { fontFamily: fonts.bodySemi, fontSize: sizes.body, color: colors.ink },
    itemStatus: { fontFamily: fonts.body, fontSize: sizes.caption, color: colors.inkMute, marginTop: 2 },
    botaoVer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.tealDark,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    botaoVerTexto: { fontFamily: fonts.bodySemi, fontSize: sizes.caption, color: colors.white },
    modalFundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
    modalFoto: { width: '90%', height: '80%' },
    modalFechar: { position: 'absolute', top: 48, right: 20 },
    player: { position: 'absolute', bottom: 80, right: 24 },
});
