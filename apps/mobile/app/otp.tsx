import { View, Text, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { otpStyles as styles } from '../styles/authStyles';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { entrarLocal } from '../src/auth/currentUser';
import { ScreenContainer, GradientButton, AudioCircle } from '../design/components';
import { colors } from '../design/theme';

export default function OtpScreen() {
    const [inputState, setInputState] = useState('123456');
    const { telefone } = useLocalSearchParams();
    const router = useRouter();

    // Login fake: não valida o código no Firebase, só registra a sessão local e segue.
    async function handleConfirm() {
        await entrarLocal(typeof telefone === 'string' ? telefone : '');
        const onboardingDone = await SecureStore.getItemAsync('onboarding_done');
        router.replace(onboardingDone === '1' ? '/(tabs)' : '/onboarding');
    }

    return (
        <ScreenContainer variant="teal">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={-80}
            >
            <View style={styles.container}>
                <AudioCircle icon="chatbubble-ellipses" size={90} iconColor={colors.tealDark} />

                <Text style={styles.titulo}>Código SMS</Text>
                <Text style={styles.subtitulo}>Digite os 6 dígitos recebidos por mensagem</Text>

                <TextInput
                    style={styles.input}
                    value={inputState}
                    onChangeText={setInputState}
                    keyboardType="number-pad"
                    placeholder="000000"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    maxLength={6}
                />

                <GradientButton
                    label="Confirmar"
                    variant="cream"
                    onPress={handleConfirm}
                    disabled={inputState.trim().length < 6}
                    style={styles.botao}
                />
            </View>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}
