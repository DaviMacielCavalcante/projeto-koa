import { StyleSheet } from 'react-native';

export const topBarStyles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4,
        minHeight: 56,
    },
    btn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
