import { StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../../theme';

export const docCircleStyles = StyleSheet.create({
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 5,
    },
    dot: {
        position: 'absolute',
        top: 8, right: 10,
        width: 10, height: 10, borderRadius: 5,
        borderWidth: 2,
        borderColor: colors.white,
    },
    name: { fontFamily: fonts.display, fontSize: sizes.bodySm, color: colors.white },
    subtitle: { fontFamily: fonts.body, fontSize: sizes.tiny, color: colors.white, opacity: 0.95, marginTop: 2 },
});
