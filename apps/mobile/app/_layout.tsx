import { router, Stack } from 'expo-router';
import { useEffect, useState} from 'react';
import { ActivityIndicator, BackHandler } from 'react-native';
import { useFonts } from '@expo-google-fonts/inter';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Inconsolata_400Regular, Inconsolata_600SemiBold } from '@expo-google-fonts/inconsolata';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { initDb } from '../src/db/index'
import auth from '@react-native-firebase/auth';
import { syncQueue } from '../src/services/sync';
import { processarFilaEmissao } from '../src/services/emissaoNfae';
import { configurarNotificacoes, agendarAlertas } from '../src/services/notificacoes';
import * as NetInfo from '@react-native-community/netinfo';
import { PracticeModeProvider } from '../src/contexts/PracticeMode';
import { TutorialProvider } from '../src/contexts/TutorialContext';
import TutorialOverlay from '../components/TutorialOverlay';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Suprime o erro nativo do ExoPlayer durante hot reload em desenvolvimento
if (__DEV__) {
    const originalHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((error, isFatal) => {
        const msg = error?.message ?? '';
        if (
            msg.includes('Player is accessed on the wrong thread') ||
            msg.includes('wrong thread') ||
            msg.includes('ExoPlayer')
        ) {
            return;
        }
        originalHandler(error, isFatal);
    });
}

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
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inconsolata_400Regular,
        Inconsolata_600SemiBold,
    });

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
                    if (state.isConnected) {
                        syncQueue()
                        processarFilaEmissao()
                    }
                }
            )
            return () => unsubscribe()
        }, [])

    if (!dbReady || !fontsLoaded) {
        return <ActivityIndicator />;
    }

    return (
        <SafeAreaProvider>
            <TutorialProvider>
                <PracticeModeProvider>
                    <Stack screenOptions={{ gestureEnabled: false, headerShown: false }} />
                    <TutorialOverlay />
                </PracticeModeProvider>
            </TutorialProvider>
        </SafeAreaProvider>
    )
}
