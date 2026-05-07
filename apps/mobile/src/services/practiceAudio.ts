import { Audio } from 'expo-av';

let sound: Audio.Sound | null = null;

export const practiceAudioService = {
  async playPracticeModeWarning() {
    try {
      // Toca um som de aviso (bip simples para indicar entrada no modo prática)
      // TODO: Substituir por arquivo de áudio real quando disponível
      // "Você está no modo prática. Nada será salvo de verdade."
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });

      // Por enquanto, apenas um placeholder
      console.log('🔶 Entrando no Modo Prática - Nenhum dado será salvo');
    } catch (error) {
      console.error('Erro ao reproduzir aviso de modo prática:', error);
    }
  },

  async playExitWarning() {
    try {
      console.log('✅ Saindo do Modo Prática - Voltando ao app de verdade');
    } catch (error) {
      console.error('Erro ao reproduzir aviso de saída:', error);
    }
  },

  async cleanup() {
    if (sound) {
      await sound.unloadAsync();
      sound = null;
    }
  },
};
