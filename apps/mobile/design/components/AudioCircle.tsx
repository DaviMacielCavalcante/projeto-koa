import { View, Animated } from 'react-native';
import { audioCircleStyles as styles } from './styles/audioCircleStyles';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { colors } from '../theme';

interface AudioCircleProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  size?: number;
}

export default function AudioCircle({ icon = 'volume-high', iconColor, size = 110 }: AudioCircleProps) {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;

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

  const ring = (val: Animated.Value, multiplier: number) => ({
    opacity: val.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
    transform: [{ scale: val.interpolate({ inputRange: [0, 1], outputRange: [1, multiplier] }) }],
  });

  return (
    <View style={[styles.wrap, { width: size + 80, height: size + 80 }]}>
      <Animated.View style={[styles.pulse, { width: size, height: size, borderRadius: size / 2 }, ring(pulse1, 1.6)]} />
      <Animated.View style={[styles.pulse, { width: size, height: size, borderRadius: size / 2 }, ring(pulse2, 1.9)]} />
      <View style={[styles.core, { width: size, height: size, borderRadius: size / 2 }]}>
        <Ionicons name={icon} size={size * 0.45} color={iconColor || colors.tealDark} />
      </View>
    </View>
  );
}

