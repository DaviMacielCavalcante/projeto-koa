import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { agricultoresDb } from '../../src/db/index';
import { ScreenContainer } from '../../design/components';
import { colors, fonts, sizes } from '../../design/theme';
import AudioPlayer from '../../components/AudioPlayer';

type DocRow = { id: string; type: string; file_url: string | null };

export default function Outros() {
    const [docs, setDocs] = useState<DocRow[]>([]);
    const [fotoVisivel, setFotoVisivel] = useState<string | null>(null);
    const [modalAdicionar, setModalAdicionar] = useState(false);
    const [nomeNovo, setNomeNovo] = useState('');
    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            async function carregar() {
                const rows = await agricultoresDb?.getAllAsync<DocRow>(
                    `SELECT id, type, file_url FROM documents
                     WHERE type NOT IN ('CAF','CAR','CCIR','ITR','NFA-e')
                     GROUP BY type
                     HAVING created_at = MAX(created_at)
                     ORDER BY created_at DESC`
                );
                setDocs(rows ?? []);
            }
            carregar();
        }, [])
    );

    async function deletarDocumento(id: string, tipo: string) {
        Alert.alert(
            'Apagar documento',
            `Tem certeza que quer apagar "${tipo}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Apagar',
                    style: 'destructive',
                    onPress: async () => {
                        await agricultoresDb?.runAsync('DELETE FROM documents WHERE id = ?', [id]);
                        setDocs(prev => prev.filter(d => d.id !== id));
                    },
                },
            ]
        );
    }

    function confirmarAdicionar() {
        const nome = nomeNovo.trim();
        if (!nome) {
            Alert.alert('Atenção', 'Digite o nome do documento.');
            return;
        }
        setModalAdicionar(false);
        setNomeNovo('');
        router.push(`/camera/${encodeURIComponent(nome)}`);
    }

    return (
        <ScreenContainer variant="cream">
            <View style={styles.header}>
                <Text style={styles.titulo}>Outros Documentos</Text>
                <TouchableOpacity style={styles.botaoAdicionar} onPress={() => setModalAdicionar(true)}>
                    <Ionicons name="add" size={22} color={colors.white} />
                </TouchableOpacity>
            </View>
            <Text style={styles.subtitulo}>
                Guarde cópias de outros documentos importantes, como certidões, contratos e autorizações.
            </Text>

            {docs.length === 0 ? (
                <View style={styles.vazio}>
                    <View style={styles.vazioIcone}>
                        <Ionicons name="documents-outline" size={48} color={colors.tealMid} />
                    </View>
                    <Text style={styles.vazioTitulo}>Nenhum documento ainda</Text>
                    <Text style={styles.vazioTexto}>
                        Toque no "+" para adicionar certidões, contratos ou qualquer outro documento importante.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={docs}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: Math.max(insets.bottom + 128, 148), gap: 10 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardIcone}>
                                <Ionicons name="document-text-outline" size={26} color={colors.tealDark} />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardNome}>{item.type}</Text>
                                <Text style={styles.cardStatus}>
                                    {item.file_url ? 'Foto guardada' : 'Sem foto'}
                                </Text>
                            </View>
                            <View style={styles.cardAcoes}>
                                {item.file_url && (
                                    <TouchableOpacity style={styles.btnVer} onPress={() => setFotoVisivel(item.file_url)}>
                                        <Ionicons name="eye-outline" size={18} color={colors.white} />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity style={styles.btnCamera} onPress={() => router.push(`/camera/${encodeURIComponent(item.type)}`)}>
                                    <Ionicons name="camera-outline" size={18} color={colors.tealDark} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnDeletar} onPress={() => deletarDocumento(item.id, item.type)}>
                                    <Ionicons name="trash-outline" size={18} color={colors.redMid} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            {/* Modal — adicionar documento */}
            <Modal visible={modalAdicionar} transparent animationType="slide">
                <TouchableOpacity style={styles.modalFundo} activeOpacity={1} onPress={() => setModalAdicionar(false)}>
                    <TouchableOpacity style={styles.modalCard} activeOpacity={1}>
                        <Text style={styles.modalTitulo}>Nome do documento</Text>
                        <Text style={styles.modalSubtitulo}>Ex: Contrato de arrendamento, Certidão de nascimento...</Text>
                        <TextInput
                            style={styles.input}
                            value={nomeNovo}
                            onChangeText={setNomeNovo}
                            placeholder="Nome do documento"
                            placeholderTextColor={colors.greyLight}
                            autoCapitalize="words"
                            autoFocus
                        />
                        <TouchableOpacity
                            style={[styles.btnConfirmar, !nomeNovo.trim() && { opacity: 0.4 }]}
                            onPress={confirmarAdicionar}
                            disabled={!nomeNovo.trim()}
                        >
                            <Text style={styles.btnConfirmarTexto}>Tirar foto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnCancelar} onPress={() => { setModalAdicionar(false); setNomeNovo(''); }}>
                            <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Modal — ver foto */}
            <Modal visible={!!fotoVisivel} transparent animationType="fade">
                <TouchableOpacity style={styles.fotoFundo} activeOpacity={1} onPress={() => setFotoVisivel(null)}>
                    <Image source={{ uri: fotoVisivel ?? '' }} style={styles.fotoImagem} resizeMode="contain" />
                    <TouchableOpacity style={styles.fotoFechar} onPress={() => setFotoVisivel(null)}>
                        <Ionicons name="close-circle" size={52} color="#fff" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <AudioPlayer
                source={require('../../assets/audio/829108__jamm__notification-sound-4-hopeful.mp3')}
                autoPlay={false}
                style={{ position: 'absolute', right: 24, bottom: Math.max(insets.bottom + 86, 98) }}
            />
        </ScreenContainer>
    );
}
