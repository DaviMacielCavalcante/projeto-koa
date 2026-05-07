import { View, TouchableOpacity } from 'react-native';
import { topBarStyles as styles } from './styles/topBarStyles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../theme';

interface TopBarProps {
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  dark?: boolean;
}

export default function TopBar({
  leftIcon = 'arrow-back',
  rightIcon,
  onLeftPress,
  onRightPress,
  dark = false,
}: TopBarProps) {
  const iconColor = dark ? colors.tealDark : colors.white;

  return (
    <View style={styles.bar}>
      <TouchableOpacity
        style={styles.btn}
        onPress={onLeftPress ?? router.back}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name={leftIcon} size={24} color={iconColor} />
      </TouchableOpacity>

      {rightIcon && (
        <TouchableOpacity
          style={styles.btn}
          onPress={onRightPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name={rightIcon} size={24} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

