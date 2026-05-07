import { View, SafeAreaView, StatusBar, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { screenContainerStyles as styles } from './styles/screenContainerStyles';
import { colors, screenGradients } from '../theme';

type Variant = 'teal' | 'gold' | 'red' | 'orange' | 'cream';

interface ScreenContainerProps {
  variant?: Variant;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function ScreenContainer({ variant = 'teal', children, style }: ScreenContainerProps) {
  if (variant === 'cream') {
    return (
      <View style={[styles.container, { backgroundColor: colors.creamLight }, style]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.creamLight} />
        <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[...screenGradients[variant]]}
      style={[styles.container, style]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor={screenGradients[variant][0]} />
      <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
    </LinearGradient>
  );
}
