import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { usePracticeMode } from '../../src/hooks/usePracticeMode';
import PracticeModeIndicator from '../../components/PracticeModeIndicator';
import { colors } from '../../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.primary,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  practiceButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    color: colors.textPrimary,
  },
});

export default function ajuda() {
  const router = useRouter();
  const { isPracticeMode, exitPracticeMode } = usePracticeMode();

  const handleExitPracticeMode = () => {
    Alert.alert('Sair do Modo Prática', 'Tem certeza que deseja voltar ao app de verdade?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          exitPracticeMode();
          Alert.alert('Sucesso', 'Você saiu do modo prática. Seus dados reais estão intactos.');
        },
      },
    ]);
  };

  const handleEnterPracticeMode = () => {
    router.push('/practice');
  };

  return (
    <View style={styles.container}>
      <PracticeModeIndicator />
      <Text style={styles.title}>Ajuda</Text>

      {isPracticeMode ? (
        <>
          <Text style={styles.sectionTitle}>Modo Prática</Text>
          <TouchableOpacity style={styles.button} onPress={handleExitPracticeMode}>
            <Text style={styles.buttonText}>← Voltar pro App de Verdade</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Testar Aplicativo</Text>
          <TouchableOpacity style={[styles.button, styles.practiceButton]} onPress={handleEnterPracticeMode}>
            <Text style={styles.buttonText}>🔶 Entrar no Modo Prática</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.sectionTitle}>Informações</Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8 }}>
        Este aplicativo ajuda você a organizar seus documentos e certificados agrícolas.
      </Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary }}>
        Para mais informações, entre em contato com a EMATER.
      </Text>
    </View>
  );
}
