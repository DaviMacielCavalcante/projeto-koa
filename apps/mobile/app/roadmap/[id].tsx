import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer, TopBar } from '../../design/components';
import { colors, buttonGradients } from '../../design/theme';
import { agricultoresDb } from '../../src/db/index';
import { getAudioSource } from '../../src/data/audioRegistry';
import {
    isConcluido,
    marcarComoConcluido,
    desmarcarConcluido,
    listarSecoesConcluidas,
    marcarSecaoConcluida,
    desmarcarSecao,
} from '../../src/services/progress';
import { roadmapDetailStyles as styles } from '../../styles/roadmapDetailStyles';
import AudioBubble from '../../components/AudioBubble';

const ROAD = require('../../assets/roadmap/image/road-roadmap.png');
const FARMER = require('../../assets/roadmap/image/farmer-roadmap.png');
const MEDAL = require('../../assets/roadmap/image/medal-roadmap.png');
// Tamanho FIXO da estrada (não estica): fixo a altura e derivo a largura na mesma
// proporção da imagem (1536/363) pra não distorcer. Ajuste ROAD_H pra mudar o tamanho.
const ROAD_RATIO = 1536 / 363;
const ROAD_H = 80;
const ROAD_W = Math.round(ROAD_H * ROAD_RATIO);
const FARMER_W = 64; // largura/altura do fazendeiro na tela

type ContentRow = {
    title: string;
    category: string | null;
    hero: string | null;
    resumo: string | null;
    audio_id: string | null;
};
type SectionRow = { id: string; icon: string; title: string; body: string };

export default function RoadmapDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [content, setContent] = useState<ContentRow | null>(null);
    const [sections, setSections] = useState<SectionRow[]>([]);
    const [audioSource, setAudioSource] = useState<number | undefined>(undefined);
    const [audioNome, setAudioNome] = useState<string | null>(null);
    const [concluido, setConcluido] = useState(false);
    const [secoesConcluidas, setSecoesConcluidas] = useState<Set<string>>(new Set());
    const insets = useSafeAreaInsets();
    const farmerX = useRef(new Animated.Value(0)).current;
    const jaPosicionou = useRef(false);

    useEffect(() => {
        async function carregar() {
            if (!id) return;
            const row = await agricultoresDb?.getFirstAsync<ContentRow>(
                'SELECT title, category, hero, resumo, audio_id FROM educational_contents WHERE id = ?',
                [id]
            );
            setContent(row ?? null);

            const secoes = await agricultoresDb?.getAllAsync<SectionRow>(
                'SELECT id, icon, title, body FROM content_sections WHERE content_id = ? ORDER BY position ASC',
                [id]
            );
            setSections(secoes ?? []);
            setSecoesConcluidas(await listarSecoesConcluidas(id));

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

    async function toggleSecao(sectionId: string) {
        if (!id) return;
        const jaConcluida = secoesConcluidas.has(sectionId);
        // Atualiza a UI otimisticamente, depois persiste.
        setSecoesConcluidas((anterior) => {
            const proximo = new Set(anterior);
            if (jaConcluida) proximo.delete(sectionId);
            else proximo.add(sectionId);
            return proximo;
        });
        if (jaConcluida) await desmarcarSecao(id, sectionId);
        else await marcarSecaoConcluida(id, sectionId);
    }

    const temConteudo = sections.length > 0;
    const totalSecoes = sections.length;
    const secoesOk = secoesConcluidas.size;
    // Sem seções (ex: CAF) não há o que travar; com seções, exige todas marcadas.
    const podeConcluir = totalSecoes === 0 || secoesOk >= totalSecoes;

    // Move o fazendeiro pela estrada (largura fixa) conforme o progresso das seções.
    useEffect(() => {
        if (totalSecoes === 0) return;
        const p = secoesOk / totalSecoes;
        const destino = p * Math.max(0, ROAD_W - FARMER_W);
        if (!jaPosicionou.current) {
            // Primeira passada: posiciona sem animar (sem "deslizar" ao abrir).
            farmerX.setValue(destino);
            jaPosicionou.current = true;
            return;
        }
        Animated.timing(farmerX, {
            toValue: destino,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [secoesOk, totalSecoes, farmerX]);

    return (
        <ScreenContainer variant="cream">
            <TopBar leftIcon="arrow-back" dark />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                    styles.content,
                    temConteudo && { paddingBottom: ROAD_H + insets.bottom + 32 },
                ]}
                showsVerticalScrollIndicator={false}
            >
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

                        {sections.map((section) => {
                            const feita = secoesConcluidas.has(section.id);
                            return (
                                <TouchableOpacity
                                    key={section.id}
                                    style={[styles.sectionCard, feita && styles.sectionCardFeita]}
                                    activeOpacity={0.85}
                                    onPress={() => toggleSecao(section.id)}
                                    accessibilityRole="checkbox"
                                    accessibilityState={{ checked: feita }}
                                >
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
                                    <Ionicons
                                        name={feita ? 'checkmark-circle' : 'ellipse-outline'}
                                        size={26}
                                        color={feita ? colors.statusGreen : colors.creamDeep}
                                        style={styles.sectionCheck}
                                    />
                                </TouchableOpacity>
                            );
                        })}

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

                {temConteudo ? (
                    <Text style={styles.contador}>
                        {secoesOk}/{totalSecoes} concluídos
                        {!concluido && !podeConcluir ? ' — marque todos para concluir o tópico' : ''}
                    </Text>
                ) : null}

                {concluido ? (
                    // Tópico concluído: medalha coletada no centro (toque pra desfazer).
                    <TouchableOpacity
                        style={styles.medalhaColetada}
                        activeOpacity={0.85}
                        onPress={handleToggleConcluido}
                    >
                        <Image source={MEDAL} style={styles.medalhaImg} resizeMode="contain" />
                        <Text style={styles.medalhaLabel}>Medalha coletada!</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={handleToggleConcluido}
                        disabled={!podeConcluir}
                        style={[styles.coletarBtn, !podeConcluir && styles.coletarBtnOff]}
                    >
                        <LinearGradient
                            colors={[...buttonGradients.teal]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.coletarGrad}
                        >
                            <Image source={MEDAL} style={styles.coletarMedal} resizeMode="contain" />
                            <Text style={styles.coletarLabel}>Coletar a sua medalha</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {temConteudo ? (
                <View style={[styles.trilhaBar, { bottom: insets.bottom }]} pointerEvents="none">
                    <View style={[styles.trilhaRoadWrap, { width: ROAD_W, height: ROAD_H }]}>
                        <Image
                            source={ROAD}
                            style={{ width: ROAD_W, height: ROAD_H }}
                            resizeMode="stretch"
                        />
                        <Animated.Image
                            source={FARMER}
                            resizeMode="contain"
                            style={[
                                styles.trilhaFarmer,
                                { width: FARMER_W, height: FARMER_W, transform: [{ translateX: farmerX }] },
                            ]}
                        />
                    </View>
                </View>
            ) : null}
        </ScreenContainer>
    );
}
