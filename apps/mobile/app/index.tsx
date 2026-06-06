import { View, Text, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { loginStyles as styles } from '../styles/authStyles';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer, GradientButton, AudioCircle } from '../design/components';
import { colors } from '../design/theme';

export default function PhoneScreen() {
    const [inputState, setInputState] = useState('+5591900000001');
    const router = useRouter();

    // Login fake: não chama o Firebase, só leva o telefone digitado pra tela do código.
    function handleSendCode() {
        router.push({ pathname: '/otp', params: { telefone: inputState.trim() } });
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
            </View>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}
