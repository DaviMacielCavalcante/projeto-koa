import { View, TextInput, Button, Alert } from "react-native";
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import auth from '@react-native-firebase/auth';

export default function OtpScreen() {

    const [inputState, setInputState] = useState('');

    const { verificationId } = useLocalSearchParams();

    const router = useRouter();

    async function handleConfirm() {

        try {
            const cred = auth.PhoneAuthProvider.credential(verificationId as string, inputState)

            await auth().signInWithCredential(cred)

            router.replace('/home')

            await SecureStore.setItemAsync('last_active', Date.now().toString())

        } catch (error) {
            Alert.alert('Erro', "Não foi possível autenticar!")
        }
        
    }

    return (
        <View>
            <TextInput value={inputState} onChangeText={setInputState} keyboardType="number-pad"></TextInput>
            <Button title="Digite o código" onPress={handleConfirm}></Button>
        </View>
    )
}