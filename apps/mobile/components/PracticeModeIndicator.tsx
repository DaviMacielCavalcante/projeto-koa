import { View, Text, TouchableOpacity } from 'react-native';
import { usePracticeMode } from '../src/hooks/usePracticeMode';
import { practiceModeStyles as styles } from '../styles/practiceModeStyles';

export default function PracticeModeIndicator() {
    const { isPracticeMode, exitPracticeMode } = usePracticeMode();

    if (!isPracticeMode) return null;

    return (
        <View style={styles.banner}>
            <Text style={styles.bannerTexto}>🔶 MODO PRÁTICA — nada será salvo</Text>
            <TouchableOpacity style={styles.botaoSair} onPress={exitPracticeMode}>
                <Text style={styles.botaoSairTexto}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}
