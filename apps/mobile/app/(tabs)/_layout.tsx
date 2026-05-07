import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../design/theme';
import PracticeModeIndicator from '../../components/PracticeModeIndicator';

export default function TabsLayout() {
    return (
        <View style={{ flex: 1 }}>
            <PracticeModeIndicator />
            <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.tealDark,
                tabBarInactiveTintColor: colors.grey,
                tabBarStyle: {
                    height: 72,
                    paddingBottom: 10,
                    paddingTop: 6,
                    backgroundColor: colors.creamLight,
                    borderTopColor: colors.creamDeep,
                    borderTopWidth: 1,
                },
                tabBarLabelStyle: {
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 11,
                },
                tabBarItemStyle: {
                    minHeight: 56,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="documentos"
                options={{
                    title: 'Documentos',
                    tabBarIcon: ({ color }) => <Ionicons name="document-text" color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="avisos"
                options={{
                    title: 'Avisos',
                    tabBarIcon: ({ color }) => <Ionicons name="notifications" color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="ajuda"
                options={{
                    title: 'Ajuda',
                    tabBarIcon: ({ color }) => <Ionicons name="help-circle" color={color} size={24} />,
                }}
            />
        </Tabs>
        </View>
    );
}
