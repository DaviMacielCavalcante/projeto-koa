import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { agricultoresDb } from '../../src/db/index';
import { practiceDataAccess } from '../../src/db/practiceDataAccess';
import { usePracticeMode } from '../../src/hooks/usePracticeMode';
import PracticeModeIndicator from '../../components/PracticeModeIndicator';
import { colors } from '../../constants/theme';
import { documentosStyles as styles } from '../../styles/documentosStyles';
import AudioPlayer from '../../components/AudioPlayer';

type DocRow = { type: string; file_url: string | null; status: string | null };

const TIPOS = ['CAF', 'CAR', 'CCIR', 'ITR', 'NFA-e'];

export default function Documentos() {
    const { isPracticeMode, practicePhotos } = usePracticeMode();
    const [docs, setDocs] = useState<DocRow[]>([]);
    const [fotoVisivel, setFotoVisivel] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            async function carregar() {
                const rows = isPracticeMode
                    ? await practiceDataAccess.getDocuments(true)
                    : await agricultoresDb?.getAllAsync<DocRow>(
                        `SELECT type, file_url, status FROM documents
                         WHERE type IN ('CAF','CAR','CCIR','ITR','NFA-e')
                         GROUP BY type
                         HAVING created_at = MAX(created_at)`
                    );

                const mapa: Record<string, DocRow> = {};
                rows?.forEach((r: any) => (mapa[r.type] = r));

            if (isPracticeMode) {
                setDocs(TIPOS.map((tipo) => ({
                    ...(mapa[tipo] ?? { type: tipo, file_url: null, status: null }),
                    file_url: practicePhotos[tipo] ?? mapa[tipo]?.file_url ?? null,
                })));
            } else {
                setDocs(TIPOS.map((tipo) => mapa[tipo] ?? { type: tipo, file_url: null, status: null }));
            }
            }
            carregar();
        }, [isPracticeMode, practicePhotos])
    );

    return (
        <View style={styles.container}>
            <PracticeModeIndicator />
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

            <AudioPlayer
                source={require('../../assets/audio/829108__jamm__notification-sound-4-hopeful.mp3')}
                autoPlay={false}
                style={{ position: 'absolute', bottom: 24, right: 24 }}
            />
        </View>
    );
}

