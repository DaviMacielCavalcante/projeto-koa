import { TouchableOpacity, Text } from 'react-native';      

interface BackButtonProps {
    onPress: () => void;
    label?: string;
}

export default function BackButton({ onPress, label = 'Voltar' }: BackButtonProps) {
    return (
        <TouchableOpacity style={{  minHeight: 56, justifyContent: 'center' }} onPress={onPress}>
            <Text>{label}</Text>
        </TouchableOpacity>
    )
}