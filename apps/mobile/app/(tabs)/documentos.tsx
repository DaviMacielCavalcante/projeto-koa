import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { agricultoresDb } from '../../src/db/index';
import { colors, spacing, typography, MIN_TOUCH_TARGET } from '../../constants/theme';
import AudioPlayer from '../../components/AudioPlayer';

type DocRow = { type: string; file_url: string | null; status: string | null };

const TIPOS = ['CAF', 'CAR', 'CCIR', 'ITR', 'NFA-e'];

export default function Documentos() {
    const [docs, setDocs] = useState<DocRow[]>([]);
    const [fotoVisivel, setFotoVisivel] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            async function carregar() {
                const rows = await agricultoresDb?.getAllAsync<DocRow>(
                    `SELECT type, file_url, status FROM documents
                     WHERE type IN ('CAF','CAR','CCIR','ITR','NFA-e')
                     GROUP BY type
                     HAVING created_at = MAX(created_at)`
                );

                const mapa: Record<string, DocRow> = {};
                rows?.forEach((r) => (mapa[r.type] = r));

                setDocs(TIPOS.map((tipo) => mapa[tipo] ?? { type: tipo, file_url: null, status: null }));
            }
            carregar();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Meus Documentos</Text>

            <FlatList
                data={docs}
                keyExtractor={(item) => item.type}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View style={styles.itemInfo}>
                            <Ionicons
                                name="document-text"
                                size={28}
                                color={item.file_url ? colors.primary : colors.textSecondary}
                            />
                            <Text style={styles.itemTipo}>{item.type}</Text>
                            <Text style={styles.itemStatus}>
                                {item.file_url ? 'Foto salva' : 'Sem foto'}
                            </Text>
                        </View>

                        {item.file_url && (
                            <TouchableOpacity
                                style={styles.botaoVer}
                                onPress={() => setFotoVisivel(item.file_url)}
                            >
                                <Ionicons name="eye" size={20} color={colors.surface} />
                                <Text style={styles.botaoVerTexto}>Ver foto</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />

            <Modal visible={!!fotoVisivel} transparent animationType="fade">
                <View style={styles.modalFundo}>
                    <Image
                        source={{ uri: fotoVisivel ?? '' }}
                        style={styles.modalFoto}
                        resizeMode="contain"
                    />
                    <TouchableOpacity
                        style={styles.modalFechar}
                        onPress={() => setFotoVisivel(null)}
                    >
                        <Ionicons name="close-circle" size={48} color="#fff" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    titulo: {
        ...typography.title,
        color: colors.text,
        marginBottom: spacing.lg,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        minHeight: MIN_TOUCH_TARGET,
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    itemTipo: {
        ...typography.subtitle,
        color: colors.text,
    },
    itemStatus: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    botaoVer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 6,
    },
    botaoVerTexto: {
        ...typography.caption,
        color: colors.surface,
        fontWeight: '600',
    },
    modalFundo: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalFoto: {
        width: '90%',
        height: '80%',
    },
    modalFechar: {
        position: 'absolute',
        top: spacing.xl,
        right: spacing.md,
    },
});
