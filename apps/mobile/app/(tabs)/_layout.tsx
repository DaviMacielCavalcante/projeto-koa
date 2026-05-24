import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useRef, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PracticeModeIndicator from '../../components/PracticeModeIndicator';
import TutorialGlow from '../../components/TutorialGlow';
import { colors, fonts } from '../../design/theme';
import { useTutorial } from '../../src/contexts/TutorialContext';

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    const { registrarRef, zonaAtiva } = useTutorial();
    const outrosRef = useRef<View>(null);
    const notasRef = useRef<View>(null);
    const ajudaRef = useRef<View>(null);

    useEffect(() => {
        registrarRef('tab-outros', outrosRef);
        registrarRef('tab-notas', notasRef);
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
                        tabBarIcon: ({ color }) => <Ionicons name="book-outline" color={color} size={24} />,
                        tabBarButton: (props) => (
                            <TutorialGlow active={zonaAtiva === 'tab-outros'} borderRadius={16} inset={-4} style={props.style as any}>
                                <Pressable ref={outrosRef} onPress={props.onPress} onLongPress={props.onLongPress}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} accessible={props.accessible}
                                    accessibilityLabel={props.accessibilityLabel}
                                    accessibilityRole={props.accessibilityRole}
                                    accessibilityState={props.accessibilityState}>
                                    {props.children}
                                </Pressable>
                            </TutorialGlow>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="notas"
                    options={{
                        title: 'Notas',
                        tabBarIcon: ({ color }) => <Ionicons name="receipt-outline" color={color} size={24} />,
                        tabBarButton: (props) => (
                            <TutorialGlow active={zonaAtiva === 'tab-notas'} borderRadius={16} inset={-4} style={props.style as any}>
                                <Pressable ref={notasRef} onPress={props.onPress} onLongPress={props.onLongPress}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} accessible={props.accessible}
                                    accessibilityLabel={props.accessibilityLabel}
                                    accessibilityRole={props.accessibilityRole}
                                    accessibilityState={props.accessibilityState}>
                                    {props.children}
                                </Pressable>
                            </TutorialGlow>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="ajuda"
                    options={{
                        title: 'Ajuda',
                        tabBarIcon: ({ color }) => <Ionicons name="help-circle-outline" color={color} size={24} />,
                        tabBarButton: (props) => (
                            <TutorialGlow active={zonaAtiva === 'tab-ajuda'} borderRadius={16} inset={-4} style={props.style as any}>
                                <Pressable ref={ajudaRef} onPress={props.onPress} onLongPress={props.onLongPress}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} accessible={props.accessible}
                                    accessibilityLabel={props.accessibilityLabel}
                                    accessibilityRole={props.accessibilityRole}
                                    accessibilityState={props.accessibilityState}>
                                    {props.children}
                                </Pressable>
                            </TutorialGlow>
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}
