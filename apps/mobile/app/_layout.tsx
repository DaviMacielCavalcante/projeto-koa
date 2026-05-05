import { router, Stack } from 'expo-router';
import {useEffect, useState} from 'react';
import { ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { initDb } from '../src/db/index'
import auth from '@react-native-firebase/auth';

export default function RootLayout() {

    const [dbReady, setDbReady] = useState(false);

    useEffect(() => {
        initDb().then(async () => {
        setDbReady(true)
           const lastActive = await SecureStore.getItemAsync('last_active');

           const time_diff = Date.now() - Number(lastActive);
           if (lastActive && time_diff > (30 * 60 * 1000)) {
                await auth().signOut()
                router.replace('/');
           }
        }
    )
    }, [])

    if (!dbReady) {
        return <ActivityIndicator></ActivityIndicator>
    }

    return (
        <Stack>   
            
            
        </Stack>
    )
}