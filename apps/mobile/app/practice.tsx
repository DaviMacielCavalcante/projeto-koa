import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { usePracticeMode } from '../src/hooks/usePracticeMode';
import { practiceAudioService } from '../src/services/practiceAudio';
import { colors } from '../constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: colors.primary,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  warningBox: {
    borderWidth: 2,
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  warningText: {
    fontSize: 14,
    color: '#E65100',
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  enterButton: {
    backgroundColor: '#FF9800',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default function Practice() {
  const { enterPracticeMode } = usePracticeMode();

  const handleEnterPracticeMode = async () => {
    try {
      await practiceAudioService.playPracticeModeWarning();
      enterPracticeMode();
      Alert.alert('Sucesso', 'Você entrou no Modo Prática. Todos os dados serão fictícios.', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível entrar no modo prática');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔶 Modo Prática</Text>

      <Text style={styles.description}>
        No Modo Prática, você pode explorar o aplicativo sem se preocupar em salvar dados reais.
      </Text>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Nada do que você fazer aqui será salvo ou sincronizado com seus dados reais.
        </Text>
      </View>

      <Text style={styles.description}>
        Você poderá fotografar documentos fictícios, explorar todas as funcionalidades e, ao final, voltar ao app de verdade sem nenhuma alteração.
      </Text>

      <TouchableOpacity style={[styles.button, styles.enterButton]} onPress={handleEnterPracticeMode}>
        <Text style={styles.buttonText}>Entrar no Modo Prática</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}
