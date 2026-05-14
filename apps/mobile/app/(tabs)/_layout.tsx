import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PracticeModeIndicator from '../../components/PracticeModeIndicator';
import TutorialOverlay from '../../components/TutorialOverlay';
import { colors, fonts } from '../../design/theme';

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1 }}>
            <PracticeModeIndicator />
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: colors.tealDark,
                    tabBarInactiveTintColor: colors.grey,
                    tabBarStyle: {
                        height: 72 + insets.bottom,
                        paddingBottom: 10 + insets.bottom,
                        paddingTop: 6,
                        backgroundColor: colors.creamLight,
                        borderTopColor: colors.creamDeep,
                        borderTopWidth: 1,
                    },
                    tabBarLabelStyle: {
                        fontFamily: fonts.bodySemi,
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
                        title: 'Inicio',
                        tabBarIcon: ({ color }) => <Ionicons name="home-outline" color={color} size={24} />,
                    }}
                />
                <Tabs.Screen
                    name="documentos"
                    options={{
                        title: 'Outros',
                        tabBarIcon: ({ color }) => <Ionicons name="book-outline" color={color} size={24} />,
                    }}
                />
                <Tabs.Screen
                    name="avisos"
                    options={{
                        title: 'Avisos',
                        tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" color={color} size={24} />,
                    }}
                />
                <Tabs.Screen
                    name="ajuda"
                    options={{
                        title: 'Ajuda',
                        tabBarIcon: ({ color }) => <Ionicons name="help-circle-outline" color={color} size={24} />,
                    }}
                />
            </Tabs>
            <TutorialOverlay />
        </View>
    );
}
