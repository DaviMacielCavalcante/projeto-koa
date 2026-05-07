import { View, SafeAreaView, StatusBar, StyleProp, ViewStyle } from 'react-native';
import { screenContainerStyles as styles } from './styles/screenContainerStyles';
import { colors, screenGradients } from '../theme';

const USE_GRADIENTS = false; // mude para true após o rebuild com expo-linear-gradient

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
    <View style={[styles.container, { backgroundColor: screenGradients[variant][0] }, style]}>
      <StatusBar barStyle="light-content" backgroundColor={screenGradients[variant][0]} />
      <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
    </View>
  );
}

