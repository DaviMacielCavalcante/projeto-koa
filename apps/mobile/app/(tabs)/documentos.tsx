import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import { documentosTabStyles as styles } from '../../styles/documentosTabStyles';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { agricultoresDb } from '../../src/db/index';
import { ScreenContainer } from '../../design/components';
import { colors } from '../../design/theme';
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
        <ScreenContainer variant="cream">
            <Text style={styles.titulo}>Meus Documentos</Text>

            <FlatList
                data={docs}
                keyExtractor={(item) => item.type}
                contentContainerStyle={styles.lista}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View style={styles.itemIcone}>
                            <Ionicons
                                name="document-text"
                                size={26}
                                color={item.file_url ? colors.tealDark : colors.grey}
                            />
                        </View>
                        <View style={styles.itemInfo}>
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
                                <Ionicons name="eye" size={18} color={colors.white} />
                                <Text style={styles.botaoVerTexto}>Ver</Text>
                            </TouchableOpacity>
                        )}
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
                style={styles.player}
            />
        </ScreenContainer>
    );
}

