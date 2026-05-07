import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePracticeMode } from '../../src/hooks/usePracticeMode';
import PracticeModeIndicator from '../../components/PracticeModeIndicator';
import uuid from 'react-native-uuid';
import * as Notifications from 'expo-notifications';
import { ajudaStyles as styles } from '../../styles/ajudaStyles';
import { agricultoresDb } from '../../src/db/index';
import { agendarAlertas } from '../../src/services/notificacoes';

export default function Ajuda() {
    const { isPracticeMode, exitPracticeMode } = usePracticeMode();
    const [confirmando, setConfirmando] = useState(false);
    const [contador, setContador] = useState(5);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (confirmando) {
            setContador(5);
            intervalRef.current = setInterval(() => {
                setContador((c) => {
                    if (c <= 1) {
                        clearInterval(intervalRef.current!);
                        return 0;
                    }
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
            content: {
                title: 'Teste direto',
                body: 'Se aparecer, notificações funcionam.',
                data: { tipo: 'CAF' },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 5,
                repeats: false,
            },
        });
        Alert.alert('Aguarde', 'Notificação direta agendada para 5 segundos.');
    }

    async function inserirDocumentoTeste() {
        const agora = new Date().toISOString();
        const venceEm5Dias = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
        await agricultoresDb?.runAsync(
            `INSERT OR REPLACE INTO documents (id, type, status, expiration_date, sincronizado, created_at, updated_at)
             VALUES (?, 'CAF', 'expiring_soon', ?, 0, ?, ?)`,
            [uuid.v4() as string, venceEm5Dias, agora, agora]
        );
        await agendarAlertas();
        Alert.alert('Teste', 'Documento CAF inserido (vence em 5 dias). Notificação agendada para 10s.');
    }

    return (
        <View style={styles.container}>
            <PracticeModeIndicator />
            <Text style={styles.titulo}>Ajuda</Text>

            {isPracticeMode ? (
                <TouchableOpacity
                    style={styles.botaoPratica}
                    onPress={() =>
                        Alert.alert('Sair do Modo Prática', 'Voltar ao app de verdade?', [
                            { text: 'Cancelar', style: 'cancel' },
                            { text: 'Sair', style: 'destructive', onPress: () => { exitPracticeMode(); router.replace('/(tabs)'); } },
                        ])
                    }
                >
                    <Text style={styles.botaoPraticaTexto}>← Voltar pro App de Verdade</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.botaoPratica} onPress={() => router.push('/practice')}>
                    <Text style={styles.botaoPraticaTexto}>🔶 Entrar no Modo Prática</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.botaoDanger} onPress={() => setConfirmando(true)}>
                <Ionicons name="trash" size={22} color="#fff" />
                <Text style={styles.botaoDangerTexto}>Apagar todos os meus dados</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoTeste} onPress={testarNotificacaoDireta}>
                <Text style={styles.botaoTesteTexto}>[TESTE] Notificação direta (5s)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoTeste} onPress={inserirDocumentoTeste}>
                <Text style={styles.botaoTesteTexto}>[TESTE] Inserir CAF vencendo + agendar notificação</Text>
            </TouchableOpacity>

            <Modal visible={confirmando} transparent animationType="fade">
                <View style={styles.modalFundo}>
                    <View style={styles.modalCaixa}>
                        <Ionicons name="warning" size={40} color={styles.botaoDanger.backgroundColor} />
                        <Text style={styles.modalTitulo}>Tem certeza?</Text>
                        <Text style={styles.modalTexto}>
                            Todos os seus dados, fotos e documentos serão apagados permanentemente.
                            Você tem certeza?
                        </Text>

                        <TouchableOpacity
                            style={[styles.botaoDanger, contador > 0 && styles.botaoDangerDesabilitado]}
                            disabled={contador > 0}
                            onPress={fecharModal}
                        >
                            <Ionicons name="trash" size={20} color="#fff" />
                            <Text style={styles.botaoDangerTexto}>
                                {contador > 0 ? `Apagar tudo (${contador})` : 'Apagar tudo'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botaoVoltar} onPress={fecharModal}>
                            <Text style={styles.botaoVoltarTexto}>Não, voltar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
