import { View, Text, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { loginStyles as styles } from '../styles/authStyles';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { ScreenContainer, GradientButton, AudioCircle } from '../design/components';
import { colors } from '../design/theme';

export default function PhoneScreen() {
    const [inputState, setInputState] = useState('+5591900000001');
    const router = useRouter();

    async function handleSendCode() {
        try {
            const observer = auth().verifyPhoneNumber(inputState);
            observer.on('state_changed', (snapshot) => {
                if (snapshot.state === auth.PhoneAuthState.CODE_SENT) {
                    router.push({ pathname: '/otp', params: { verificationId: snapshot.verificationId } });
                }
            });
        } catch {
            // Alert já tratado na versão anterior
        }
    }

    return (
        <ScreenContainer variant="teal">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={-80}
            >
            <View style={styles.container}>
                <AudioCircle icon="phone-portrait" size={90} iconColor={colors.tealDark} />

                <Text style={styles.titulo}>Facilitador Jutaí</Text>
                <Text style={styles.subtitulo}>Digite seu número de telefone</Text>

                <TextInput
                    style={styles.input}
                    value={inputState}
                    onChangeText={setInputState}
                    keyboardType="phone-pad"
                    placeholder="+5591999999999"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                />

                <GradientButton
                    label="Enviar código"
                    variant="cream"
                    onPress={handleSendCode}
                    disabled={inputState.trim().length === 0}
                    style={styles.botao}
                />

                <GradientButton
                    label="[TESTE] Ir para tabs"
                    variant="cream"
                    onPress={() => router.push('/(tabs)')}
                    style={[styles.botao, { marginTop: 8, opacity: 0.6 }]}
                />
            </View>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}

