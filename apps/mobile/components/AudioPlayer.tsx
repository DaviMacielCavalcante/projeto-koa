import { TouchableOpacity, Text, StyleProp, ViewStyle } from 'react-native';
import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
    source: any;
    autoPlay?: boolean;
    onFinish?: () => void;
    style?: StyleProp<ViewStyle>;
}

export default function AudioPlayer({ source, autoPlay = false, onFinish, style }: AudioPlayerProps) {
    const soundRef = useRef<Audio.Sound | null>(null);
    const mountedRef = useRef(true);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        mountedRef.current = true;

        async function load() {
            try {
                await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
                const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false });

                if (!mountedRef.current) {
                    await sound.unloadAsync();
                    return;
                }

                soundRef.current = sound;

                sound.setOnPlaybackStatusUpdate((status) => {
                    if (!mountedRef.current) return;
                    if (status.isLoaded && status.didJustFinish) {
                        setIsPlaying(false);
                        onFinish?.();
                    }
                });

                if (autoPlay && mountedRef.current) {
                    await sound.playAsync();
                    if (mountedRef.current) setIsPlaying(true);
                }
            } catch {
                // ignora erros de carregamento (ex: reload rápido)
            }
        }

        load();

        return () => {
            mountedRef.current = false;
            soundRef.current?.unloadAsync().catch(() => {});
            soundRef.current = null;
        };
    }, []);

    async function handlePlay() {
        if (!soundRef.current) return;
        try {
            if (isPlaying) {
                await soundRef.current.pauseAsync();
                setIsPlaying(false);
            } else {
                await soundRef.current.playAsync();
                setIsPlaying(true);
            }
        } catch {
            // ignora erros de thread durante reload
        }
    }

    return (
        <TouchableOpacity onPress={handlePlay} style={style}>
            <Text>{isPlaying ? 'Pausar' : 'Tocar'}</Text>
        </TouchableOpacity>
    );
}
