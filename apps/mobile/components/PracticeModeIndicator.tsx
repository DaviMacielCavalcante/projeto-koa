import { View, Text, StyleSheet } from 'react-native';
import { usePracticeMode } from '../src/hooks/usePracticeMode';

const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    textAlign: 'center',
  },
});

export default function PracticeModeIndicator() {
  const { isPracticeMode } = usePracticeMode();

  if (!isPracticeMode) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🔶 MODO PRÁTICA - Nada será salvo</Text>
    </View>
  );
}
