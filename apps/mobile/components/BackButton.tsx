import { TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';

interface BackButtonProps {
    onPress?: () => void;
    label?: string;
}

export default function BackButton({ onPress, label = 'Voltar' }: BackButtonProps) {
    return (
        <TouchableOpacity style={{ minHeight: 56, justifyContent: 'center' }} onPress={onPress ?? router.back}>
            <Text>{label}</Text>
        </TouchableOpacity>
    )
}