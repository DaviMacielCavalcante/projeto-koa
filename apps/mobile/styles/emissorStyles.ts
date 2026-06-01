import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

// Estilos da seção "Dados para emissão de nota fiscal" (tela de perfil).
export const emissorStyles = StyleSheet.create({
    secao: {
        width: '100%',
        marginTop: 18,
    },
    secaoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 12,
    },
    secaoTitulo: {
        flex: 1,
        fontFamily: fonts.monoSemi,
        fontSize: sizes.bodySm,
        color: colors.ink,
    },
    statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    statusChipOk: {
        backgroundColor: 'rgba(31,122,122,0.12)',
    },
    statusChipPendente: {
        backgroundColor: 'rgba(232,117,60,0.14)',
    },
    statusChipTexto: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.micro,
    },
    campo: {
        width: '100%',
        marginBottom: 10,
    },
    label: {
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.micro,
        color: colors.inkSoft,
        marginBottom: 4,
        marginLeft: 4,
    },
    regimeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    regimeChip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: colors.creamDeep,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    regimeChipAtivo: {
        backgroundColor: colors.goldMid,
        borderColor: colors.goldDark,
    },
    regimeChipTexto: {
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.bodySm,
        color: colors.inkSoft,
    },
    regimeChipTextoAtivo: {
        color: colors.white,
        fontFamily: fonts.bodySemi,
    },
});
