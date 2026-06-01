import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { GradientButton, ScreenContainer, TopBar } from '../../design/components';
import { colors } from '../../design/theme';
import { agricultoresDb } from '../../src/db/index';
import { getAudioSource } from '../../src/data/audioRegistry';
import { isConcluido, marcarComoConcluido, desmarcarConcluido } from '../../src/services/progress';
import { roadmapDetailStyles as styles } from '../../styles/roadmapDetailStyles';
import AudioBubble from '../../components/AudioBubble';

type ContentRow = {
    title: string;
    category: string | null;
    hero: string | null;
    resumo: string | null;
    audio_id: string | null;
};
type SectionRow = { icon: string; title: string; body: string };

export default function RoadmapDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [content, setContent] = useState<ContentRow | null>(null);
    const [sections, setSections] = useState<SectionRow[]>([]);
    const [audioSource, setAudioSource] = useState<number | undefined>(undefined);
    const [audioNome, setAudioNome] = useState<string | null>(null);
    const [concluido, setConcluido] = useState(false);

    useEffect(() => {
        async function carregar() {
            if (!id) return;
            const row = await agricultoresDb?.getFirstAsync<ContentRow>(
                'SELECT title, category, hero, resumo, audio_id FROM educational_contents WHERE id = ?',
                [id]
            );
            setContent(row ?? null);

            const secoes = await agricultoresDb?.getAllAsync<SectionRow>(
                'SELECT icon, title, body FROM content_sections WHERE content_id = ? ORDER BY position ASC',
                [id]
            );
            setSections(secoes ?? []);

            if (row?.audio_id) {
                const audio = await agricultoresDb?.getFirstAsync<{ file_key: string; name: string }>(
                    'SELECT file_key, name FROM audios WHERE id = ?',
                    [row.audio_id]
                );
                setAudioSource(getAudioSource(audio?.file_key));
                setAudioNome(audio?.name ?? null);
            } else {
                setAudioSource(undefined);
                setAudioNome(null);
            }

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

    const temConteudo = sections.length > 0;

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
                    <AudioBubble source={audioSource} name={audioNome} style={styles.audioBubble} />
                ) : null}

                {temConteudo ? (
                    <>
                        {content?.hero ? <Text style={styles.hero}>{content.hero}</Text> : null}

                        {sections.map((section, i) => (
                            <View key={`${section.title}-${i}`} style={styles.sectionCard}>
                                <View style={styles.sectionIconWrap}>
                                    <Ionicons
                                        name={section.icon as keyof typeof Ionicons.glyphMap}
                                        size={22}
                                        color={colors.tealDark}
                                    />
                                </View>
                                <View style={styles.sectionTextWrap}>
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                    <Text style={styles.sectionBody}>{section.body}</Text>
                                </View>
                            </View>
                        ))}

                        {content?.resumo ? (
                            <View style={styles.resumoCard}>
                                <View style={styles.resumoIconWrap}>
                                    <Ionicons name="bulb" size={22} color={colors.white} />
                                </View>
                                <Text style={styles.resumoText}>{content.resumo}</Text>
                            </View>
                        ) : null}
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
