import { Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, buttonGradients } from '../theme';
import { gradientButtonStyles as styles } from './styles/gradientButtonStyles';

type Variant = 'teal' | 'gold' | 'red' | 'orange' | 'cream';

interface GradientButtonProps {
  label: string;
  variant?: Variant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  align?: 'center' | 'flex-start';
  disabled?: boolean;
}

export default function GradientButton({
  label,
  variant = 'teal',
  onPress,
  style,
  textStyle,
  align = 'center',
  disabled = false,
}: GradientButtonProps) {
  if (variant === 'cream') {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        disabled={disabled}
        style={[styles.btn, styles.cream, { alignItems: align === 'center' ? 'center' : 'flex-start', opacity: disabled ? 0.5 : 1 }, style]}
      >
        <Text style={[styles.txt, { color: colors.tealDark }, textStyle]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} disabled={disabled} style={[{ opacity: disabled ? 0.5 : 1 }, style]}>
      <LinearGradient
        colors={[...buttonGradients[variant]]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.btn, { alignItems: align === 'center' ? 'center' : 'flex-start' }]}
      >
        <Text style={[styles.txt, textStyle]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
