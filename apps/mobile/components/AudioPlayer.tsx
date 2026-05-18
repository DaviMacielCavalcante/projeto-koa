import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Audio } from 'expo-av';
import { useRef, useState } from 'react';
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

    async function descarregar() {
        const sound = soundRef.current;
        if (!sound) return;
        soundRef.current = null;
        sound.setOnPlaybackStatusUpdate(null);
        try { await sound.stopAsync(); } catch {}
        try { await sound.unloadAsync(); } catch {}
    }

    async function handlePlay() {
        try {
            if (isPlaying) {
                await soundRef.current?.pauseAsync();
                setIsPlaying(false);
                return;
            }

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

            await soundRef.current?.playAsync();
            setIsPlaying(true);
        } catch {
            setIsPlaying(false);
        }
    }

    return (
        <TouchableOpacity
            accessibilityLabel={isPlaying ? 'Pausar audio' : 'Tocar audio'}
            activeOpacity={0.88}
            onPress={handlePlay}
            style={[
                {
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.creamLight,
                    borderWidth: 1,
                    borderColor: 'rgba(14, 79, 79, 0.08)',
                    shadowColor: colors.tealDark,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.12,
                    shadowRadius: 16,
                    elevation: 6,
                },
                style,
            ]}
        >
            <Ionicons
                color={colors.tealDark}
                name={isPlaying ? 'pause' : 'volume-high'}
                size={30}
            />
        </TouchableOpacity>
    );
}
