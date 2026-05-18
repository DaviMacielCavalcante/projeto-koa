import { ReactNode } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useGlowPulse } from '../src/hooks/useGlowPulse';
import { colors } from '../design/theme';

type Props = {
    active: boolean;
    children: ReactNode;
    borderRadius?: number;
    inset?: number;
    style?: ViewStyle;
};

export default function TutorialGlow({
    active,
    children,
    borderRadius = 20,
    inset = -8,
    style,
}: Props) {
    const valor = useGlowPulse(active);

    if (!active) {
        return <View style={style}>{children}</View>;
    }

    const opacity = valor.interpolate({
        inputRange: [0, 1],
        outputRange: [0.55, 1],
    });
    const scale = valor.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.05],
    });

    return (
        <View style={[styles.wrapper, style]}>
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.halo,
                    {
                        top: inset,
                        left: inset,
                        right: inset,
                        bottom: inset,
                        borderRadius: borderRadius + Math.abs(inset),
                        opacity,
                        transform: [{ scale }],
                    },
                ]}
            />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
    },
    halo: {
        position: 'absolute',
        backgroundColor: colors.tealLight,
        shadowColor: colors.tealLight,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 32,
        elevation: 20,
    },
});
