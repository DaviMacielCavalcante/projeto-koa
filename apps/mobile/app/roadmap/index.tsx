import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, TopBar } from '../../design/components';
import { colors } from '../../design/theme';
import { agricultoresDb } from '../../src/db/index';
import { seedEducationalContentsIfEmpty } from '../../src/db/seedEducationalContents';
import { usePracticeMode } from '../../src/hooks/usePracticeMode';
import { listarConcluidosDoUsuario } from '../../src/services/progress';
import { roadmapStyles as styles } from '../../styles/roadmapStyles';

type ContentRow = {
    id: string;
    title: string;
    category: string | null;
    created_at: string;
};

export default function Roadmap() {
    const { isPracticeMode, practiceLidos } = usePracticeMode();
    const [topics, setTopics] = useState<ContentRow[]>([]);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());

    useFocusEffect(
        useCallback(() => {
            async function carregar() {
                if (!isPracticeMode) {
                    await seedEducationalContentsIfEmpty();
                }

                const contents = await agricultoresDb?.getAllAsync<ContentRow>(
                    'SELECT id, title, category, created_at FROM educational_contents ORDER BY created_at ASC'
                );
                setTopics(contents ?? []);

                if (isPracticeMode) {
                    setReadIds(practiceLidos);
                } else {
                    const concluidos = await listarConcluidosDoUsuario();
                    setReadIds(concluidos);
                }
            }
            carregar();
        }, [isPracticeMode, practiceLidos])
    );

    return (
        <ScreenContainer variant="cream">
            <TopBar leftIcon="arrow-back" dark />
            <View style={styles.header}>
                <Text style={styles.titulo}>Trilha do agricultor</Text>
                <Text style={styles.subtitulo}>
                    Aprenda sobre os documentos no seu ritmo
                </Text>
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
                            );
                        })}
                    </View>
                </ScrollView>
            )}
        </ScreenContainer>
    );
}
