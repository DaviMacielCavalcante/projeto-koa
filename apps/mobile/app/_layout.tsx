import { router, Stack } from 'expo-router';
import { useEffect, useState} from 'react';
import { ActivityIndicator, AppState, BackHandler } from 'react-native';
import { useFonts } from '@expo-google-fonts/inter';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Inconsolata_400Regular, Inconsolata_600SemiBold } from '@expo-google-fonts/inconsolata';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { initDb } from '../src/db/index'
import {
    carregarSessaoLocal,
    getCurrentUserId,
    sessaoExpirada,
    marcarAtividade,
} from '../src/auth/currentUser';
import { syncQueue } from '../src/services/sync';
import { processarFilaEmissao } from '../src/services/emissaoNfae';
import { configurarNotificacoes, agendarAlertas } from '../src/services/notificacoes';
import * as NetInfo from '@react-native-community/netinfo';
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
            await carregarSessaoLocal();
            setDbReady(true);

            // Sessão local válida (logado E dentro da janela de auto-lock) pula o login.
            if (getCurrentUserId() && !(await sessaoExpirada())) {
                const onboardingDone = await SecureStore.getItemAsync('onboarding_done');
                router.replace(onboardingDone === '1' ? '/(tabs)' : '/onboarding');
            }
            // Senão: permanece em '/' (primeira vez ou sessão travada por inatividade).

            const permitido = await configurarNotificacoes();
            if (permitido) await agendarAlertas();
        });
    }, []);

    // Auto-lock (RNF18): marca atividade ao sair e, ao voltar, trava se passou de 30 min.
    useEffect(() => {
        const sub = AppState.addEventListener('change', async (state) => {
            if (!getCurrentUserId()) return;
            if (state === 'active') {
                if (await sessaoExpirada()) router.replace('/');
                else await marcarAtividade();
            } else if (state === 'background' || state === 'inactive') {
                await marcarAtividade();
            }
        });
        return () => sub.remove();
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
                <Stack screenOptions={{ gestureEnabled: false, headerShown: false }} />
                <TutorialOverlay />
            </TutorialProvider>
        </SafeAreaProvider>
    )
}
