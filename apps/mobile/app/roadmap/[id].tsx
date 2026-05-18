import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { AudioCircle, GradientButton, ScreenContainer, TopBar } from '../../design/components';
import { colors } from '../../design/theme';
import { agricultoresDb } from '../../src/db/index';
import { getRoadmapContent } from '../../src/data/roadmapContent';
import { usePracticeMode } from '../../src/hooks/usePracticeMode';
import { isConcluido, marcarComoConcluido } from '../../src/services/progress';
import { roadmapDetailStyles as styles } from '../../styles/roadmapDetailStyles';

type ContentRow = { title: string; body: string | null; category: string | null };

export default function RoadmapDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { isPracticeMode, practiceLidos, marcarLidoPratica } = usePracticeMode();
    const [content, setContent] = useState<ContentRow | null>(null);
    const [concluido, setConcluido] = useState(false);

    useEffect(() => {
        async function carregar() {
            if (!id) return;
            const row = await agricultoresDb?.getFirstAsync<ContentRow>(
                'SELECT title, body, category FROM educational_contents WHERE id = ?',
                [id]
            );
            setContent(row ?? null);

            if (isPracticeMode) {
                setConcluido(practiceLidos.has(id));
            } else {
                setConcluido(await isConcluido(id));
            }
        }
        carregar();
    }, [id, isPracticeMode, practiceLidos]);

    async function handleConcluir() {
        if (!id || concluido) return;
        if (isPracticeMode) {
            marcarLidoPratica(id);
        } else {
            await marcarComoConcluido(id);
        }
        setConcluido(true);
    }

    const rich = getRoadmapContent(content?.category);

    return (
        <ScreenContainer variant="cream">
            <TopBar leftIcon="arrow-back" rightIcon="volume-high" dark />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.audioWrap}>
                    <AudioCircle icon="volume-high" iconColor={colors.tealDark} size={88} />
                </View>

                <Text style={[styles.titulo, concluido && styles.tituloConcluido]}>
                    {content?.title ?? ''}
                </Text>

                {content?.category ? (
                    <View style={styles.categoriaBadge}>
                        <Text style={styles.categoriaBadgeText}>{content.category}</Text>
                    </View>
                ) : null}

                {rich ? (
                    <>
                        <Text style={styles.hero}>{rich.hero}</Text>

                        {rich.sections.map((section, i) => (
                            <View key={`${section.title}-${i}`} style={styles.sectionCard}>
                                <View style={styles.sectionIconWrap}>
                                    <Ionicons name={section.icon} size={22} color={colors.tealDark} />
                                </View>
                                <View style={styles.sectionTextWrap}>
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                    <Text style={styles.sectionBody}>{section.body}</Text>
                                </View>
                            </View>
                        ))}

                        <View style={styles.resumoCard}>
                            <View style={styles.resumoIconWrap}>
                                <Ionicons name="bulb" size={22} color={colors.white} />
                            </View>
                            <Text style={styles.resumoText}>{rich.resumo}</Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>
                            Conteúdo em breve
                        </Text>
                    </View>
                )}

                <GradientButton
                    label={concluido ? 'Concluído ✓' : 'Marcar como concluído'}
                    variant="teal"
                    onPress={handleConcluir}
                    disabled={concluido}
                    style={styles.botao}
                />
            </ScrollView>
        </ScreenContainer>
    );
}
