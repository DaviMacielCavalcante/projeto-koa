import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from 'react';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { colors } from '../constants/theme';
import { loginStyles as styles } from '../styles/authStyles';

export default function PhoneScreen() {

    const [inputState, setInputState] = useState('');
    const router = useRouter();

    async function handleSendCode() {
        try {
            const observer = auth().verifyPhoneNumber(inputState)
            observer.on('state_changed', (snapshot) => {
                if (snapshot.state === auth.PhoneAuthState.CODE_SENT) {
                    router.push({
                        pathname: '/otp',
                        params: { verificationId: snapshot.verificationId }
                    })
                }
            })
        }
        catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar o código!')
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Digite seu número de telefone</Text>
            <TextInput
                style={styles.input}
                value={inputState}
                onChangeText={setInputState}
                keyboardType="phone-pad"
                placeholder="+5591999999999"
                placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity
                style={[styles.botao, inputState.trim().length === 0 && styles.botaoDesabilitado]}
                onPress={handleSendCode}
                disabled={inputState.trim().length === 0}
            >
                <Text style={styles.botaoTexto}>Enviar código</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoTeste} onPress={() => router.push('/(tabs)')}>
                <Text style={styles.botaoTesteTexto}>[TESTE] Ir para tabs</Text>
            </TouchableOpacity>
        </View>
    )
}

