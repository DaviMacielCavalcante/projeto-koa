import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { ajudaStyles as styles } from '../../styles/ajudaStyles';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import auth from '@react-native-firebase/auth';
import { ScreenContainer, GradientButton, AudioCircle } from '../../design/components';
import { colors } from '../../design/theme';
import { agricultoresDb } from '../../src/db/index';
import { useTutorial } from '../../src/contexts/TutorialContext';

export default function Ajuda() {
    const { iniciar: iniciarTutorial } = useTutorial();
    const [confirmando, setConfirmando] = useState(false);
    const [contador, setContador] = useState(5);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    async function apagarTodosDados() {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();

            for (const tabela of ['documents', 'properties', 'users', 'educational_contents', 'user_content_progress', 'sync_queue']) {
                await agricultoresDb?.runAsync(`DELETE FROM ${tabela}`).catch(() => {});
            }

            for (const chave of ['last_active', 'onboarding_done', 'onboarding_progress']) {
                await SecureStore.deleteItemAsync(chave).catch(() => {});
            }

            await auth().signOut().catch(() => {});

            fecharModal();
            router.replace('/');
        } catch {
            Alert.alert('Erro', 'Não foi possível apagar todos os dados.');
            fecharModal();
        }
    }

    useEffect(() => {
        if (confirmando) {
            setContador(5);
            intervalRef.current = setInterval(() => {
                setContador((c) => {
                    if (c <= 1) { clearInterval(intervalRef.current!); return 0; }
                    return c - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current!);
        }
        return () => clearInterval(intervalRef.current!);
    }, [confirmando]);

    function fecharModal() {
        setConfirmando(false);
        setContador(5);
    }

    return (
        <ScreenContainer variant="cream">
            <Text style={styles.titulo}>Ajuda</Text>

            <View style={styles.content}>
                <GradientButton
                    label="Rever apresentação"
                    variant="teal"
                    onPress={() => router.push('/onboarding')}
                    style={styles.botao}
                />
                <GradientButton
                    label="Tutorial do app"
                    variant="teal"
                    onPress={() => { router.replace('/(tabs)'); iniciarTutorial(); }}
                    style={styles.botao}
                />
                <GradientButton
                    label="Apagar todos os meus dados"
                    variant="red"
                    onPress={() => setConfirmando(true)}
                    style={styles.botao}
                />
                <TouchableOpacity style={styles.botaoTeste} onPress={async () => {
                    await SecureStore.deleteItemAsync('onboarding_done');
                    await SecureStore.deleteItemAsync('onboarding_progress');
                    Alert.alert('Pronto', 'Onboarding resetado. Faça login novamente para ver.');
                }}>
                    <Text style={styles.botaoTesteTexto}>[TESTE] Resetar onboarding</Text>
                </TouchableOpacity>
                
            </View>

            <Modal visible={confirmando} transparent animationType="fade">
                <View style={styles.modalFundo}>
                    <View style={styles.modalCaixa}>
                        <AudioCircle icon="trash" size={80} iconColor={colors.redMid} />
                        <Text style={styles.modalTitulo}>Tem certeza?</Text>
                        <Text style={styles.modalTexto}>
                            Todos os seus dados, fotos e documentos serão apagados permanentemente.
                        </Text>
                        <GradientButton
                            label={contador > 0 ? `Apagar tudo (${contador})` : 'Apagar tudo'}
                            variant="red"
                            disabled={contador > 0}
                            onPress={fecharModal}
                            style={styles.botao}
                        />
                        <GradientButton
                            label="Não, voltar"
                            variant="cream"
                            onPress={fecharModal}
                            style={styles.botao}
                        />
                    </View>
                </View>
            </Modal>
        </ScreenContainer>
    );
}

