import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { documentosTabStyles as styles } from '../../styles/documentosTabStyles';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { agricultoresDb } from '../../src/db/index';
import { DocumentTypeIcon, ScreenContainer } from '../../design/components';
import { colors } from '../../design/theme';
import AudioPlayer from '../../components/AudioPlayer';
import { DOCUMENT_TYPES, documentMeta, type DocumentType } from '../../src/constants/documents';
import { practiceDataAccess } from '../../src/db/practiceDataAccess';
import { usePracticeMode } from '../../src/hooks/usePracticeMode';

export type DocRow = { type: DocumentType; file_url: string | null; status: string | null };

export default function Documentos() {
    const { isPracticeMode, practicePhotos } = usePracticeMode();
    const [docs, setDocs] = useState<DocRow[]>([]);
    const [fotoVisivel, setFotoVisivel] = useState<string | null>(null);
    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            const mapa: Partial<Record<DocumentType, DocRow>> = {};
            async function carregar() {
                const rows = isPracticeMode
                    ? await practiceDataAccess.getDocuments(true)
                    : await agricultoresDb?.getAllAsync<DocRow>(
                        `SELECT type, file_url, status FROM documents
                         WHERE type IN ('CAF','CAR','CCIR','ITR','NFA-e')
                         GROUP BY type
                         HAVING created_at = MAX(created_at)`
                    );
                rows?.forEach((r) => (mapa[r.type] = r));
                setDocs(DOCUMENT_TYPES.map((tipo) => mapa[tipo] ?? { type: tipo, file_url: null, status: null }));
            }
            if (isPracticeMode) {
                setDocs(
                    DOCUMENT_TYPES.map((tipo) => ({
                        ...(mapa[tipo] ?? {
                            type: tipo,
                            file_url: null,
                            status: null,
                        }),
                        file_url: practicePhotos[tipo] ?? mapa[tipo]?.file_url ?? null,
                    }))
                );
            } else {
                setDocs(
                    DOCUMENT_TYPES.map(
                        (tipo) =>
                            mapa[tipo] ?? {
                                type: tipo,
                                file_url: null,
                                status: null,
                            }
                    )
                );
            }
            carregar();
        }, [isPracticeMode, practicePhotos])
    );

    return (
        <ScreenContainer variant="cream">
            <Text style={styles.titulo}>Meus Documentos</Text>
            <Text style={styles.subtitulo}>
                Toque no desenho do documento para abrir os detalhes ou ver o que ainda falta.
            </Text>

            <FlatList
                data={docs}
                keyExtractor={(item) => item.type}
                numColumns={2}
                columnWrapperStyle={styles.linha}
                contentContainerStyle={[
                    styles.lista,
                    { paddingTop: 8, paddingBottom: Math.max(insets.bottom + 128, 148) },
                ]}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <TouchableOpacity
                            activeOpacity={0.88}
                            onPress={() => router.push(`/documento/${item.type}`)}
                            style={styles.cardPressable}
                        >
                            <View style={[styles.cardIconeWrap, { backgroundColor: documentMeta[item.type].cardColor }]}>
                                <DocumentTypeIcon type={item.type} size={72} />
                            </View>

                            <Text style={styles.itemTipo}>{item.type}</Text>
                            <Text style={styles.itemNome}>{documentMeta[item.type].fullName}</Text>

                            <View style={styles.statusRow}>
                                <View
                                    style={[
                                        styles.statusDot,
                                        { backgroundColor: item.file_url ? colors.tealMid : colors.greyLight },
                                    ]}
                                />
                                <Text style={styles.itemStatus}>
                                    {item.file_url ? 'Foto guardada' : 'Ainda sem foto'}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.cardFooter}>
                            <Text style={styles.abrirTexto}>Abrir documento</Text>
                            {item.file_url ? (
                                <TouchableOpacity
                                    style={styles.botaoVer}
                                    onPress={() => setFotoVisivel(item.file_url)}
                                >
                                    <Ionicons name="eye-outline" size={18} color={colors.white} />
                                </TouchableOpacity>
                            ) : (
                                <Ionicons name="chevron-forward" size={18} color={colors.tealDark} />
                            )}
                        </View>
                    </View>
                )}
            />

            <Modal visible={!!fotoVisivel} transparent animationType="fade">
                <View style={styles.modalFundo}>
                    <Image source={{ uri: fotoVisivel ?? '' }} style={styles.modalFoto} resizeMode="contain" />
                    <TouchableOpacity style={styles.modalFechar} onPress={() => setFotoVisivel(null)}>
                        <Ionicons name="close-circle" size={52} color="#fff" />
                    </TouchableOpacity>
                </View>
            </Modal>

            <AudioPlayer
                source={require('../../assets/audio/829108__jamm__notification-sound-4-hopeful.mp3')}
                autoPlay={false}
                style={[styles.player, { bottom: Math.max(insets.bottom + 86, 98) }]}
            />
        </ScreenContainer>
    );
}

