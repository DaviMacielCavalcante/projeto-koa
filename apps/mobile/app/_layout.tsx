import { router, Stack } from 'expo-router';
import { useEffect, useState} from 'react';
import { ActivityIndicator, BackHandler } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { initDb } from '../src/db/index'
import auth from '@react-native-firebase/auth';
import { syncQueue } from '../src/services/sync';
import { configurarNotificacoes, agendarAlertas } from '../src/services/notificacoes';
import * as NetInfo from '@react-native-community/netinfo';
import { PracticeModeProvider } from '../src/contexts/PracticeMode';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function RootLayout() {

    const [dbReady, setDbReady] = useState(false);

    useEffect(() => {
        initDb().then(async () => {
            setDbReady(true);

            const lastActive = await SecureStore.getItemAsync('last_active');
            const time_diff = Date.now() - Number(lastActive);
            if (lastActive && time_diff > (30 * 60 * 1000)) {
                await auth().signOut();
                router.replace('/');
                return;
            }

            const permitido = await configurarNotificacoes();
            if (permitido) await agendarAlertas();
        });
    }, []);

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const tipo = response.notification.request.content.data?.tipo;
            if (tipo) router.push(`/documento/${tipo}`);
        });
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => subscription.remove();
    }, []);

    useEffect(
        () => {
            const unsubscribe = NetInfo.addEventListener(
                (state) => {
                    if (state.isConnected) syncQueue()
                }
            )
            return () => unsubscribe()
        }, [])

    if (!dbReady) {
        return <ActivityIndicator></ActivityIndicator>
    }

    return (
        <PracticeModeProvider>
            <Stack screenOptions={ { gestureEnabled: false, headerShown: false }}>   
                
                
            </Stack>
        </PracticeModeProvider>
    )
}