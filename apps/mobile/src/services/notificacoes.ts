import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { agricultoresDb } from '../db/index';

const TRINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;

type DocRow = {
    type: string;
    expiration_date: string | null;
};

type UserRow = {
    name: string | null;
};

async function configurarNotificacoes(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') return false;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('alertas', {
            name: 'Alertas de documento',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
        });
    }

    return true;
}

async function agendarAlertas(): Promise<void> {
    try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const userRow = await agricultoresDb?.getFirstAsync<UserRow>(
        'SELECT name FROM users ORDER BY created_at DESC LIMIT 1'
    );
    const nomeAgri = userRow?.name ?? 'Agricultor';

    const docs = await agricultoresDb?.getAllAsync<DocRow>(
        `SELECT type, expiration_date FROM documents
         WHERE expiration_date IS NOT NULL
         GROUP BY type
         HAVING created_at = MAX(created_at)`
    );

    if (!docs) return;

    const hoje = Date.now();

    for (const doc of docs) {
        if (!doc.expiration_date) continue;

        const vencimento = new Date(doc.expiration_date).getTime();
        const diasRestantes = Math.ceil((vencimento - hoje) / (24 * 60 * 60 * 1000));

        if (hoje > vencimento) {
            await Notifications.scheduleNotificationAsync({
                identifier: `vencido_${doc.type}`,
                content: {
                    title: `${doc.type} vencido`,
                    body: `${nomeAgri}, seu ${doc.type} está vencido. Regularize o quanto antes.`,
                    data: { tipo: doc.type },
                    channelId: 'alertas',
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: 10,
                    repeats: true,
                },
            });
        } else if (vencimento - hoje <= TRINTA_DIAS_MS) {
            await Notifications.scheduleNotificationAsync({
                identifier: `vencendo_${doc.type}`,
                content: {
                    title: `${doc.type} vencendo em breve`,
                    body: `${nomeAgri}, seu ${doc.type} vence em ${diasRestantes} dia(s). Regularize agora.`,
                    data: { tipo: doc.type },
                    channelId: 'alertas',
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: 10,
                    repeats: true,
                },
            });
        } else {
            const dataAlerta = new Date(vencimento - TRINTA_DIAS_MS);
            if (dataAlerta.getTime() > hoje) {
                await Notifications.scheduleNotificationAsync({
                    identifier: `alerta_${doc.type}`,
                    content: {
                        title: `${doc.type} vence em 30 dias`,
                        body: `${nomeAgri}, seu ${doc.type} vence em 30 dias. Comece a regularizar.`,
                        data: { tipo: doc.type },
                        channelId: 'alertas',
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: dataAlerta,
                    },
                });
            }
        }
    }
    } catch (e) {
        console.error('[notificacoes] agendarAlertas falhou:', e);
    }
}

export { configurarNotificacoes, agendarAlertas };
