import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, Image } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../design/theme';

// Avatar padrão (caso o áudio não traga um). O avatar real vem por prop, resolvido
// pelo file_key em src/data/audioRegistry.ts.
const AVATAR_PADRAO = require('../assets/roadmap/image/perfil-fugaprascolinas.jpg');

const WAVE_BARS = [
    10, 16, 22, 14, 26, 18, 12, 24, 30, 20, 14, 26, 18, 10, 22,
    28, 16, 12, 24, 18, 26, 14, 20, 30, 16, 12, 22, 18, 14, 24,
];

interface AudioBubbleProps {
    source: number;
    name?: string | null;
    avatar?: number;
    style?: StyleProp<ViewStyle>;
}

function formatarTempo(ms: number): string {
    const totalSeg = Math.max(0, Math.round(ms / 1000));
    const min = Math.floor(totalSeg / 60);
    const seg = totalSeg % 60;
    return `${min}:${String(seg).padStart(2, '0')}`;
}

export default function AudioBubble({ source, name, avatar, style }: AudioBubbleProps) {
    const soundRef = useRef<Audio.Sound | null>(null);
    const [tocando, setTocando] = useState(false);
    const [posicao, setPosicao] = useState(0);
    const [duracao, setDuracao] = useState(0);

    function aoAtualizar(status: AVPlaybackStatus) {
        if (!status.isLoaded) return;
        if (status.durationMillis) setDuracao(status.durationMillis);
        setPosicao(status.positionMillis ?? 0);
        setTocando(status.isPlaying);
        if (status.didJustFinish) {
            setTocando(false);
            setPosicao(0);
            soundRef.current?.setPositionAsync(0).catch(() => {});
        }
    }

    useEffect(() => {
        let ativo = true;
        (async () => {
            try {
                await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
                const { sound, status } = await Audio.Sound.createAsync(
                    source,
                    { shouldPlay: false, progressUpdateIntervalMillis: 250 },
                    aoAtualizar
                );
                if (!ativo) {
                    sound.unloadAsync().catch(() => {});
                    return;
                }
                soundRef.current = sound;
                if (status.isLoaded && status.durationMillis) setDuracao(status.durationMillis);
            } catch {}
        })();

        return () => {
            ativo = false;
            const sound = soundRef.current;
            soundRef.current = null;
            if (!sound) return;
            sound.setOnPlaybackStatusUpdate(null);
            sound.stopAsync().catch(() => {}).finally(() => sound.unloadAsync().catch(() => {}));
        };
    }, []);

    async function alternar() {
        const sound = soundRef.current;
        if (!sound) return;
        try {
            if (tocando) await sound.pauseAsync();
            else await sound.playAsync();
        } catch {}
    }

    const progresso = duracao > 0 ? posicao / duracao : 0;
    const tempoLabel = duracao > 0 ? formatarTempo(duracao - posicao) : '--:--';

    return (
        <View style={[styles.bubble, style]}>
            {name ? <Text style={styles.nome}>{name}</Text> : null}
            <View style={styles.row}>
                <View style={styles.avatar}>
                    <Image source={avatar ?? AVATAR_PADRAO} style={styles.avatarFoto} resizeMode="cover" />
                    <View style={styles.micBadge}>
                        <Ionicons name="mic" size={11} color={colors.white} />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.playBtn}
                    onPress={alternar}
                    activeOpacity={0.85}
                    accessibilityLabel={tocando ? 'Pausar áudio' : 'Tocar áudio'}
                >
                    <Ionicons name={tocando ? 'pause' : 'play'} size={22} color={colors.white} />
                </TouchableOpacity>

                <View style={styles.right}>
                    <View style={styles.wave}>
                        {WAVE_BARS.map((altura, i) => {
                            const tocada = i / WAVE_BARS.length <= progresso;
                            return (
                                <View
                                    key={i}
                                    style={[
                                        styles.bar,
                                        { height: altura, backgroundColor: tocada ? colors.tealDark : colors.creamDeep },
                                    ]}
                                />
                            );
                        })}
                    </View>
                    <Text style={styles.timer}>{tempoLabel}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    nome: {
        fontFamily: fonts.bodySemi,
        fontSize: 13,
        color: colors.tealDark,
        marginBottom: 10,
    },
    bubble: {
        backgroundColor: colors.white,
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: colors.creamDeep,
        shadowColor: colors.tealDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.tealDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarFoto: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    micBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: colors.statusGreen,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.white,
    },
    playBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.tealDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    right: {
        flex: 1,
    },
    wave: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        height: 32,
    },
    bar: {
        flex: 1,
        borderRadius: 2,
        minHeight: 4,
    },
    timer: {
        fontFamily: fonts.mono,
        fontSize: 12,
        color: colors.inkMute,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
});
