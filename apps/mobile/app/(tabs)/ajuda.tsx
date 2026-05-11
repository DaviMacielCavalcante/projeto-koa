import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { ajudaStyles as styles } from '../../styles/ajudaStyles';
import uuid from 'react-native-uuid';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { ScreenContainer, GradientButton, AudioCircle } from '../../design/components';
import { colors } from '../../design/theme';
import { agricultoresDb } from '../../src/db/index';
import { usePracticeMode } from '../../src/hooks/usePracticeMode';
import { agendarAlertas } from '../../src/services/notificacoes';

export default function Ajuda() {
    const { isPracticeMode, enterPracticeMode, exitPracticeMode } = usePracticeMode();
    const [confirmando, setConfirmando] = useState(false);
    const [contador, setContador] = useState(5);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

    async function testarNotificacaoDireta() {
        await Notifications.scheduleNotificationAsync({
            content: { title: 'Teste direto', body: 'Se aparecer, notificações funcionam.', data: { tipo: 'CAF' } },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5, repeats: false },
        });
        Alert.alert('Aguarde', 'Notificação agendada para 5 segundos.');
    }

    async function inserirDocumentoTeste() {
        const agora = new Date().toISOString();
        const venceEm5Dias = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
        await agricultoresDb?.runAsync(
            `INSERT OR REPLACE INTO documents (id, type, status, expiration_date, sincronizado, created_at, updated_at) VALUES (?, 'CAF', 'expiring_soon', ?, 0, ?, ?)`,
            [uuid.v4() as string, venceEm5Dias, agora, agora]
        );
        await agendarAlertas();
        Alert.alert('Teste', 'CAF inserido (vence em 5 dias). Notificação agendada para 10s.');
    }

    return (
        <ScreenContainer variant="cream">
            <Text style={styles.titulo}>Ajuda</Text>

            <View style={styles.content}>
                {isPracticeMode ? (
                    <GradientButton
                        label="Sair do modo prática"
                        variant="gold"
                        onPress={exitPracticeMode}
                        style={styles.botao}
                    />
                ) : (
                    <GradientButton
                        label="Rever apresentação"
                        variant="teal"
                        onPress={() => router.push('/onboarding')}
                        style={styles.botao}
                    />
                )}
                {!isPracticeMode && (
                    <GradientButton
                        label="Modo Prática"
                        variant="gold"
                        onPress={enterPracticeMode}
                        style={styles.botao}
                    />
                )}
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
                <TouchableOpacity style={styles.botaoTeste} onPress={testarNotificacaoDireta}>
                    <Text style={styles.botaoTesteTexto}>[TESTE] Notificação direta (5s)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoTeste} onPress={inserirDocumentoTeste}>
                    <Text style={styles.botaoTesteTexto}>[TESTE] Inserir CAF vencendo + notificação</Text>
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

