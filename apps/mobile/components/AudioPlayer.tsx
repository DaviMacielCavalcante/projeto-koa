import { TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';
import { Audio } from 'expo-av';
import { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../design/theme';

interface AudioPlayerProps {
    source: any;
    autoPlay?: boolean;
    onFinish?: () => void;
    style?: StyleProp<ViewStyle>;
}

export default function AudioPlayer({ source, onFinish, style }: AudioPlayerProps) {
    const soundRef = useRef<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        return () => {
            const sound = soundRef.current;
            if (!sound) return;
            soundRef.current = null;
            sound.setOnPlaybackStatusUpdate(null);
            sound.stopAsync()
                .catch(() => {})
                .finally(() => sound.unloadAsync().catch(() => {}));
        };
    }, []);

    async function descarregar() {
        const sound = soundRef.current;
        if (!sound) return;
        soundRef.current = null;
        sound.setOnPlaybackStatusUpdate(null);
        try { await sound.stopAsync(); } catch {}
        try { await sound.unloadAsync(); } catch {}
    }

    async function carregarSom() {
        if (!soundRef.current) {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false });
            soundRef.current = sound;
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setIsPlaying(false);
                    onFinish?.();
                    descarregar();
                }
            });
        }
    }

    async function handlePlay() {
        try {
            if (isPlaying) {
                await soundRef.current?.pauseAsync();
                setIsPlaying(false);
                return;
            }
            await carregarSom();
            await soundRef.current?.playAsync();
            setIsPlaying(true);
        } catch {
            setIsPlaying(false);
        }
    }

    async function handleReiniciar() {
        try {
            await carregarSom();
            await soundRef.current?.setPositionAsync(0);
            await soundRef.current?.playAsync();
            setIsPlaying(true);
        } catch {}
    }

    const btnStyle = {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: colors.creamLight,
        borderWidth: 1,
        borderColor: 'rgba(14, 79, 79, 0.08)',
        shadowColor: colors.tealDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    };

    return (
        <View style={[{ alignItems: 'center', gap: 8 }, style]}>
            <TouchableOpacity
                accessibilityLabel="Voltar ao início"
                activeOpacity={0.88}
                onPress={handleReiniciar}
                style={btnStyle}
            >
                <Ionicons color={colors.tealDark} name="play-skip-back" size={22} />
            </TouchableOpacity>

            <TouchableOpacity
                accessibilityLabel={isPlaying ? 'Pausar audio' : 'Tocar audio'}
                activeOpacity={0.88}
                onPress={handlePlay}
                style={{ ...btnStyle, width: 64, height: 64, borderRadius: 32 }}
            >
                <Ionicons
                    color={colors.tealDark}
                    name={isPlaying ? 'pause' : 'volume-high'}
                    size={28}
                />
            </TouchableOpacity>
        </View>
    );
}
