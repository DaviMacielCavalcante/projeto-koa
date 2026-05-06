import { View, TextInput, Button, Alert } from "react-native";
import { useState } from 'react';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';


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
                        params: {
                            verificationId: snapshot.verificationId
                        }
                    })
                }
            })
        }
        catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar o código!')
        }

    }

    return (
        <View>
            <TextInput value={inputState} onChangeText={setInputState} keyboardType="phone-pad"></TextInput>
            <Button title="Enviar código" onPress={handleSendCode}></Button>
        </View>
    )
}