import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../../theme';

export const gradientButtonStyles = StyleSheet.create({
    btn: {
        borderRadius: 30,
        paddingVertical: 14,
        paddingHorizontal: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    cream: { backgroundColor: colors.creamLight },
    txt: { color: colors.white, fontFamily: fonts.bodySemi, fontSize: sizes.body, letterSpacing: 0.3 },
});
