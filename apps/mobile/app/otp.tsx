import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import auth from '@react-native-firebase/auth';
import { otpStyles as styles } from '../styles/authStyles';

export default function OtpScreen() {

    const [inputState, setInputState] = useState('');
    const { verificationId } = useLocalSearchParams();
    const router = useRouter();

    async function handleConfirm() {
        try {
            const cred = auth.PhoneAuthProvider.credential(verificationId as string, inputState)
            await auth().signInWithCredential(cred)
            await SecureStore.setItemAsync('last_active', Date.now().toString())
            router.replace('/home')
        } catch (error) {
            Alert.alert('Erro', "Não foi possível autenticar!")
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Digite o código recebido por SMS</Text>
            <TextInput
                style={styles.input}
                value={inputState}
                onChangeText={setInputState}
                keyboardType="number-pad"
                placeholder="000000"
                placeholderTextColor="#666666"
                maxLength={6}
            />
            <TouchableOpacity style={styles.botao} onPress={handleConfirm}>
                <Text style={styles.botaoTexto}>Confirmar</Text>
            </TouchableOpacity>
        </View>
    )
}

