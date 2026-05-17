import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useRef, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PracticeModeIndicator from '../../components/PracticeModeIndicator';
import { colors, fonts } from '../../design/theme';
import { useTutorial } from '../../src/contexts/TutorialContext';

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    const { registrarRef, zonaAtiva } = useTutorial();
    const outrosRef = useRef<View>(null);
    const avisosRef = useRef<View>(null);
    const ajudaRef = useRef<View>(null);

    useEffect(() => {
        registrarRef('tab-outros', outrosRef);
        registrarRef('tab-avisos', avisosRef);
        registrarRef('tab-ajuda', ajudaRef);
    }, []);

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
                        tabBarIcon: ({ color }) => <Ionicons name="book-outline" color={zonaAtiva === 'tab-outros' ? colors.white : color} size={24} />,
                        tabBarLabelStyle: [{ fontFamily: fonts.bodySemi, fontSize: 11 }, zonaAtiva === 'tab-outros' && { color: colors.white }],
                        tabBarButton: (props) => (
                            <Pressable ref={outrosRef} onPress={props.onPress} onLongPress={props.onLongPress}
                                style={[props.style, zonaAtiva === 'tab-outros' && { backgroundColor: colors.highlight, borderRadius: 16 }]} accessible={props.accessible}
                                accessibilityLabel={props.accessibilityLabel}
                                accessibilityRole={props.accessibilityRole}
                                accessibilityState={props.accessibilityState}>
                                {props.children}
                            </Pressable>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="avisos"
                    options={{
                        title: 'Avisos',
                        tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" color={zonaAtiva === 'tab-avisos' ? colors.white : color} size={24} />,
                        tabBarLabelStyle: [{ fontFamily: fonts.bodySemi, fontSize: 11 }, zonaAtiva === 'tab-avisos' && { color: colors.white }],
                        tabBarButton: (props) => (
                            <Pressable ref={avisosRef} onPress={props.onPress} onLongPress={props.onLongPress}
                                style={[props.style, zonaAtiva === 'tab-avisos' && { backgroundColor: colors.highlight, borderRadius: 16 }]} accessible={props.accessible}
                                accessibilityLabel={props.accessibilityLabel}
                                accessibilityRole={props.accessibilityRole}
                                accessibilityState={props.accessibilityState}>
                                {props.children}
                            </Pressable>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="ajuda"
                    options={{
                        title: 'Ajuda',
                        tabBarIcon: ({ color }) => <Ionicons name="help-circle-outline" color={zonaAtiva === 'tab-ajuda' ? colors.white : color} size={24} />,
                        tabBarLabelStyle: [{ fontFamily: fonts.bodySemi, fontSize: 11 }, zonaAtiva === 'tab-ajuda' && { color: colors.white }],
                        tabBarButton: (props) => (
                            <Pressable ref={ajudaRef} onPress={props.onPress} onLongPress={props.onLongPress}
                                style={[props.style, zonaAtiva === 'tab-ajuda' && { backgroundColor: colors.highlight, borderRadius: 16 }]} accessible={props.accessible}
                                accessibilityLabel={props.accessibilityLabel}
                                accessibilityRole={props.accessibilityRole}
                                accessibilityState={props.accessibilityState}>
                                {props.children}
                            </Pressable>
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}
