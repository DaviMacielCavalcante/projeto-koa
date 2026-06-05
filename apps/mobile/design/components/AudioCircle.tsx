import { View, Animated, TouchableOpacity } from 'react-native';
import { audioCircleStyles as styles } from './styles/audioCircleStyles';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { colors } from '../theme';

interface AudioCircleProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  size?: number;
  /** Quando informado, o círculo passa a tocar/pausar este áudio ao toque. */
  source?: any;
  onFinish?: () => void;
}

export default function AudioCircle({ icon = 'volume-high', iconColor, size = 110, source, onFinish }: AudioCircleProps) {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loop = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 1800, useNativeDriver: true }),
        ])
      );
    loop(pulse1, 0).start();
    loop(pulse2, 600).start();
  }, [pulse1, pulse2]);

  useEffect(() => {
    return () => {
      const sound = soundRef.current;
      if (!sound) return;
      soundRef.current = null;
      sound.setOnPlaybackStatusUpdate(null);
      sound.stopAsync()
        .catch(() => {})
        .finally(() => sound.unloadAsync().catch(() => {}));
    };
  }, []);

  async function descarregar() {
    const sound = soundRef.current;
    if (!sound) return;
    soundRef.current = null;
    sound.setOnPlaybackStatusUpdate(null);
    try { await sound.stopAsync(); } catch {}
    try { await sound.unloadAsync(); } catch {}
  }

  async function handlePress() {
    if (!source) return;
    try {
      if (isPlaying) {
        await soundRef.current?.pauseAsync();
        setIsPlaying(false);
        return;
      }
      if (!soundRef.current) {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false });
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            onFinish?.();
            descarregar();
          }
        });
      }
      await soundRef.current?.playAsync();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  const ring = (val: Animated.Value, multiplier: number) => ({
    opacity: val.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
    transform: [{ scale: val.interpolate({ inputRange: [0, 1], outputRange: [1, multiplier] }) }],
  });

  const iconeAtual = source && isPlaying ? 'pause' : icon;

  return (
    <View style={[styles.wrap, { width: size + 80, height: size + 80 }]}>
      <Animated.View style={[styles.pulse, { width: size, height: size, borderRadius: size / 2 }, ring(pulse1, 1.6)]} />
      <Animated.View style={[styles.pulse, { width: size, height: size, borderRadius: size / 2 }, ring(pulse2, 1.9)]} />
      <TouchableOpacity
        activeOpacity={source ? 0.85 : 1}
        disabled={!source}
        onPress={handlePress}
        accessibilityLabel={source ? (isPlaying ? 'Pausar áudio' : 'Tocar áudio') : undefined}
        style={[styles.core, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Ionicons name={iconeAtual} size={size * 0.45} color={iconColor || colors.tealDark} />
      </TouchableOpacity>
    </View>
  );
}
