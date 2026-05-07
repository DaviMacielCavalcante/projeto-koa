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

    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const load = async () => {

            const { sound } = await Audio.Sound.createAsync(source);
            soundRef.current = sound;

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setIsPlaying(false);
                    onFinish?.();
                }
            });

            if (autoPlay) {
                await sound.playAsync()
            }
        
        };
        load();        
    }, [] );

    useEffect(() => {
        return () => {
            soundRef.current?.unloadAsync()
        };
    }, []);

    async function handlePlay() {

        if (isPlaying) {
            soundRef.current?.pauseAsync()
            setIsPlaying(false);
        } else {
            soundRef.current?.playAsync()
            setIsPlaying(true);
        }

    }

    return (
    <TouchableOpacity onPress={handlePlay} style={style}>
        <Text>{isPlaying ? 'Pausar' : 'Tocar'}</Text>
    </TouchableOpacity>
    )
}