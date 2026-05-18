import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function useGlowPulse(active: boolean, duration = 1100): Animated.Value {
    const valor = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!active) {
            valor.stopAnimation();
            valor.setValue(0);
            return;
        }
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(valor, {
                    toValue: 1,
                    duration,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(valor, {
                    toValue: 0,
                    duration,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ]),
        );
        loop.start();
        return () => loop.stop();
    }, [active, duration, valor]);

    return valor;
}
