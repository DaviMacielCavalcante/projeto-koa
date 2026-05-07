import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { otpStyles as styles } from '../styles/authStyles';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import auth from '@react-native-firebase/auth';
import { ScreenContainer, GradientButton, AudioCircle } from '../design/components';
import { colors } from '../design/theme';

export default function OtpScreen() {
    const [inputState, setInputState] = useState('123456');
    const { verificationId } = useLocalSearchParams();
    const router = useRouter();

    async function handleConfirm() {
        try {
            const cred = auth.PhoneAuthProvider.credential(verificationId as string, inputState);
            await auth().signInWithCredential(cred);
            await SecureStore.setItemAsync('last_active', Date.now().toString());
            const onboardingDone = await SecureStore.getItemAsync('onboarding_done');
            router.replace(onboardingDone === '1' ? '/(tabs)' : '/onboarding');
        } catch {
            Alert.alert('Erro', 'Não foi possível autenticar!');
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

