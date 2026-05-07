import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const audioCircleStyles = StyleSheet.create({
    wrap: { alignItems: 'center', justifyContent: 'center' },
    pulse: { position: 'absolute', borderWidth: 2, borderColor: 'rgba(255,255,255,0.55)' },
    core: {
        backgroundColor: colors.creamLight,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
});
