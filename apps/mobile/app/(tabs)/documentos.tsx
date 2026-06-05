import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Image, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
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
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
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
                </KeyboardAvoidingView>
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
                source={require('../../assets/audio/outros-documentos.mp3')}
                autoPlay={false}
                style={{ position: 'absolute', right: 24, bottom: Math.max(insets.bottom + 86, 98) }}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 6,
    },
    titulo: { fontFamily: fonts.monoSemi, fontSize: sizes.lg, color: colors.tealDark },
    botaoAdicionar: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: colors.tealDark,
        alignItems: 'center', justifyContent: 'center',
    },
    subtitulo: {
        fontFamily: fonts.body, fontSize: sizes.bodySm,
        color: colors.inkSoft, paddingHorizontal: 20, lineHeight: 20, paddingBottom: 12,
    },
    vazio: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12 },
    vazioIcone: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: 'rgba(31,122,122,0.1)',
        alignItems: 'center', justifyContent: 'center',
    },
    vazioTitulo: { fontFamily: fonts.monoSemi, fontSize: sizes.md, color: colors.tealDark },
    vazioTexto: { fontFamily: fonts.body, fontSize: sizes.body, color: colors.inkMute, textAlign: 'center', lineHeight: 22 },
    card: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.white, borderRadius: 18, padding: 14,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    },
    cardIcone: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: colors.creamDeep,
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    cardInfo: { flex: 1 },
    cardNome: { fontFamily: fonts.bodySemi, fontSize: sizes.body, color: colors.ink },
    cardStatus: { fontFamily: fonts.body, fontSize: sizes.caption, color: colors.inkMute, marginTop: 2 },
    cardAcoes: { flexDirection: 'row', gap: 8 },
    btnVer: {
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: colors.tealDark,
        alignItems: 'center', justifyContent: 'center',
    },
    btnCamera: {
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: colors.creamDeep,
        alignItems: 'center', justifyContent: 'center',
    },
    btnDeletar: {
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: 'rgba(155,27,27,0.08)',
        alignItems: 'center', justifyContent: 'center',
    },
    modalFundo: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: colors.creamLight, borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: 24, gap: 12,
    },
    modalTitulo: { fontFamily: fonts.monoSemi, fontSize: sizes.md, color: colors.tealDark },
    modalSubtitulo: { fontFamily: fonts.body, fontSize: sizes.caption, color: colors.inkMute },
    input: {
        backgroundColor: colors.white, borderRadius: 14, padding: 14,
        fontFamily: fonts.bodyMedium, fontSize: sizes.body, color: colors.ink,
        borderWidth: 1, borderColor: colors.creamDeep,
    },
    btnConfirmar: {
        backgroundColor: colors.tealDark, borderRadius: 30,
        paddingVertical: 14, alignItems: 'center',
    },
    btnConfirmarTexto: { fontFamily: fonts.bodySemi, fontSize: sizes.body, color: colors.white },
    btnCancelar: { paddingVertical: 10, alignItems: 'center' },
    btnCancelarTexto: { fontFamily: fonts.bodyMedium, fontSize: sizes.body, color: colors.inkMute },
    fotoFundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
    fotoImagem: { width: '90%', height: '80%' },
    fotoFechar: { position: 'absolute', top: 48, right: 20 },
});
