import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { GradientButton, ScreenContainer, TopBar } from '../../design/components';
import { colors } from '../../design/theme';
import { agricultoresDb } from '../../src/db/index';
import { getRoadmapContent } from '../../src/data/roadmapContent';
import { isConcluido, marcarComoConcluido, desmarcarConcluido } from '../../src/services/progress';
import { roadmapDetailStyles as styles } from '../../styles/roadmapDetailStyles';
import AudioBubble from '../../components/AudioBubble';

type ContentRow = { title: string; body: string | null; category: string | null };

const AUDIO_POR_CATEGORIA: Record<string, number> = {
    CAR: require('../../assets/audio/car.mp3'),
    CCIR: require('../../assets/audio/ccir.mp3'),
    ITR: require('../../assets/audio/itr.mp3'),
};

export default function RoadmapDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
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

            setConcluido(await isConcluido(id));
        }
        carregar();
    }, [id]);

    async function handleToggleConcluido() {
        if (!id) return;
        if (concluido) {
            await desmarcarConcluido(id);
            setConcluido(false);
        } else {
            await marcarComoConcluido(id);
            setConcluido(true);
        }
    }

    const rich = getRoadmapContent(content?.category);
    const audioSource = content?.category ? AUDIO_POR_CATEGORIA[content.category] : undefined;

    return (
        <ScreenContainer variant="cream">
            <TopBar leftIcon="arrow-back" dark />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.titulo, concluido && styles.tituloConcluido]}>
                    {content?.title ?? ''}
                </Text>

                {content?.category ? (
                    <View style={styles.categoriaBadge}>
                        <Text style={styles.categoriaBadgeText}>{content.category}</Text>
                    </View>
                ) : null}

                {audioSource ? (
                    <AudioBubble source={audioSource} style={styles.audioBubble} />
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
                    label={concluido ? 'Desmarcar conclusão' : 'Marcar como concluído'}
                    variant="teal"
                    onPress={handleToggleConcluido}
                    style={styles.botao}
                />
            </ScrollView>
        </ScreenContainer>
    );
}
