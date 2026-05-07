import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../design/theme';

export const inicioStyles = StyleSheet.create({
    greetCard: {
        backgroundColor: colors.tealDark,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 12,
        borderRadius: 22,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: colors.creamLight,
        alignItems: 'center', justifyContent: 'center',
    },
    greetLabel: {
        fontFamily: fonts.body,
        fontSize: sizes.tiny,
        color: colors.white,
        opacity: 0.85,
    },
    greetName: {
        fontFamily: fonts.display,
        fontSize: 16,
        color: colors.white,
        fontWeight: '700',
    },
    sectionTitle: {
        fontFamily: fonts.display,
        fontSize: 16,
        color: colors.tealDark,
        fontWeight: '700',
        textAlign: 'center',
        paddingBottom: 10,
    },
    grid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 16,
        gap: 12,
        paddingBottom: 100,
    },
    audioBtn: {
        width: 90, height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerFixed: {
        position: 'absolute',
        bottom: 80,
        right: 24,
    },
});
