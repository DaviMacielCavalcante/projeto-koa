import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GradientButton, ScreenContainer, TopBar } from '../../design/components';
import { colors } from '../../design/theme';
import { agricultoresDb } from '../../src/db/index';
import { seedEducationalContentsIfEmpty } from '../../src/db/seedEducationalContents';
import { useTutorial } from '../../src/contexts/TutorialContext';
import { listarConcluidosDoUsuario } from '../../src/services/progress';
import { roadmapStyles as styles } from '../../styles/roadmapStyles';

type ContentRow = {
    id: string;
    title: string;
    category: string | null;
    created_at: string;
};

export default function Roadmap() {
    const { iniciar: iniciarTutorial } = useTutorial();
    const [topics, setTopics] = useState<ContentRow[]>([]);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());

    function abrirTutorial() {
        router.replace('/(tabs)');
        iniciarTutorial();
    }

    useFocusEffect(
        useCallback(() => {
            async function carregar() {
                await seedEducationalContentsIfEmpty();

                const contents = await agricultoresDb?.getAllAsync<ContentRow>(
                    'SELECT id, title, category, created_at FROM educational_contents ORDER BY created_at ASC'
                );
                setTopics(contents ?? []);

                const concluidos = await listarConcluidosDoUsuario();
                setReadIds(concluidos);
            }
            carregar();
        }, [])
    );

    return (
        <ScreenContainer variant="cream">
            <TopBar leftIcon="arrow-back" dark />
            <View style={styles.headerCardWrap}>
                <LinearGradient
                    colors={[colors.white, colors.creamLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.headerCard}
                >
                    <View style={styles.headerTexto}>
                        <Text style={styles.titulo}>Trilha do agricultor</Text>
                        <Text style={styles.subtitulo}>
                            Aprenda sobre os documentos no seu ritmo
                        </Text>
                    </View>
                    <Image
                        source={require('../../assets/trophy-icon.png')}
                        style={styles.headerTrofeu}
                        resizeMode="contain"
                    />
                </LinearGradient>
            </View>

            <View style={styles.tutorialBtnWrap}>
                <GradientButton
                    label="Tutorial do app"
                    variant="teal"
                    onPress={abrirTutorial}
                />
            </View>

            {topics.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="book-outline" size={48} color={colors.inkMute} />
                    <Text style={styles.emptyText}>
                        Nenhum conteúdo disponível ainda.
                    </Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <ImageBackground
                        source={require('../../assets/images/leaves-roadmap-wallpaper.png')}
                        resizeMode="repeat"
                        style={styles.pathWallpaper}
                        imageStyle={styles.pathWallpaperImage}
                    >
                    <View style={styles.pathContainer}>
                        {topics.map((topic, i) => {
                            const isLeft = i % 2 === 0;
                            const isRead = readIds.has(topic.id);
                            const hasNext = i < topics.length - 1;
                            return (
                                <View key={topic.id} style={styles.step}>
                                    {hasNext && (
                                        <View
                                            style={[
                                                styles.connector,
                                                isLeft
                                                    ? styles.connectorFromLeft
                                                    : styles.connectorFromRight,
                                                isRead && styles.connectorRead,
                                            ]}
                                        />
                                    )}
                                    <View
                                        style={[
                                            styles.nodeAnchor,
                                            isLeft
                                                ? styles.nodeAnchorLeft
                                                : styles.nodeAnchorRight,
                                        ]}
                                    >
                                        <TouchableOpacity
                                            activeOpacity={0.85}
                                            onPress={() => router.push(`/roadmap/${topic.id}`)}
                                        >
                                            <View
                                                style={[
                                                    styles.nodeCircle,
                                                    isRead && styles.nodeCircleRead,
                                                ]}
                                            >
                                                <Ionicons
                                                    name={isRead ? 'checkmark' : 'book'}
                                                    size={28}
                                                    color={isRead ? colors.white : colors.tealDark}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.nodeTitleWrap}>
                                            <Text
                                                style={[
                                                    styles.nodeTitle,
                                                    isRead && styles.nodeTitleRead,
                                                ]}
                                                numberOfLines={2}
                                            >
                                                {topic.title}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    </ImageBackground>
                </ScrollView>
            )}
        </ScreenContainer>
    );
}
