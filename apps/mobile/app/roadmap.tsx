import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer, TopBar } from '../design/components';
import { colors, fonts, sizes } from '../design/theme';

export default function Roadmap() {
    return (
        <ScreenContainer variant="cream">
            <TopBar leftIcon="arrow-back" dark />
            <View style={styles.container}>
                <Text style={styles.titulo}>Roadmap</Text>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 24,
    },
    titulo: {
        fontFamily: fonts.display,
        fontSize: sizes.xxl,
        color: colors.tealDark,
        fontWeight: '700',
    },
});
