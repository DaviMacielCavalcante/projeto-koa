import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, statusGradients } from '../theme';
import { docCircleStyles as styles } from './styles/docCircleStyles';
export type DocStatus = 'green' | 'yellow' | 'red' | 'grey';

interface DocCircleProps {
  name: string;
  subtitle?: string;
  status?: DocStatus;
  onPress?: () => void;
  size?: number;
}

function getDotColor(status: DocStatus): string {
  switch (status) {
    case 'green': return colors.tealLight;
    case 'yellow': return colors.goldLight;
    case 'red': return colors.redLight;
    default: return '#bbb';
  }
}

export default function DocCircle({ name, subtitle, status = 'grey', onPress, size = 90 }: DocCircleProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[...statusGradients[status]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <View style={[styles.dot, { backgroundColor: getDotColor(status) }]} />
        <Text style={styles.name}>{name}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </LinearGradient>
    </TouchableOpacity>
  );
}
