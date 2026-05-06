import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: 'Início',
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
            )}} />
            <Tabs.Screen name="documentos" options={{ title: 'Documentos',
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="document-text" color={color} size={size} />
            ) }} />
            <Tabs.Screen name="avisos" options={{ title: 'Avisos',
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="notifications" color={color} size={size} />
            ) }} />
            <Tabs.Screen name="ajuda" options={{ title: 'Ajuda',
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="help-circle" color={color} size={size} />
            ) }} 
    />
        </Tabs>
    );
}
