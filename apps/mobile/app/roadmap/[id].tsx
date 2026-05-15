import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GradientButton, ScreenContainer, TopBar } from '../../design/components';
import { colors, fonts, sizes } from '../../design/theme';
import { agricultoresDb } from '../../src/db/index';

type ContentRow = { title: string; body: string | null; category: string | null };

export default function RoadmapDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [content, setContent] = useState<ContentRow | null>(null);

    useEffect(() => {
        async function carregar() {
            if (!id) return;
            const row = await agricultoresDb?.getFirstAsync<ContentRow>(
                'SELECT title, body, category FROM educational_contents WHERE id = ?',
                [id]
            );
            setContent(row ?? null);
        }
        carregar();
    }, [id]);

    return (
        <ScreenContainer variant="cream">
            <TopBar leftIcon="arrow-back" dark />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.titulo}>{content?.title ?? ''}</Text>
                {content?.category ? (
                    <Text style={styles.categoria}>{content.category}</Text>
                ) : null}

                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>
                        Conteúdo em breve
                    </Text>
                </View>

                <GradientButton
                    label="Marcar como lido"
                    variant="teal"
                    style={styles.botao}
                />
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 48,
    },
    titulo: {
        fontFamily: fonts.display,
        fontSize: sizes.xl,
        color: colors.tealDark,
        fontWeight: '700',
        textAlign: 'center',
    },
    categoria: {
        fontFamily: fonts.body,
        fontSize: sizes.bodySm,
        color: colors.inkMute,
        textAlign: 'center',
        marginTop: 6,
    },
    placeholder: {
        marginTop: 32,
        marginBottom: 32,
        padding: 32,
        borderRadius: 22,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.creamDeep,
        alignItems: 'center',
    },
    placeholderText: {
        fontFamily: fonts.body,
        fontSize: sizes.body,
        color: colors.inkMute,
    },
    botao: {
        marginTop: 8,
    },
});
