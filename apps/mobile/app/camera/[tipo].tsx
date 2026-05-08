import { useLocalSearchParams, router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Alert, StyleSheet } from 'react-native';
import { cameraScreenStyles as styles } from '../../styles/cameraScreenStyles';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { ScreenContainer, GradientButton, TopBar } from '../../design/components';
import { colors } from '../../design/theme';
import { processAndSavePhoto } from '../../src/services/photo';
import { agricultoresDb } from '../../src/db/index';
import { agendarAlertas } from '../../src/services/notificacoes';
import { usePracticeMode } from '../../src/hooks/usePracticeMode';
import { mockDocuments } from '../../src/mocks/practiceData';

type Etapa = 'preparo' | 'camera' | 'preview' | 'confirmacao';

const INSTRUCOES = [
    { icone: 'sunny-outline' as const, texto: 'Escolha um lugar bem iluminado' },
    { icone: 'document-outline' as const, texto: 'Coloque o documento numa superfície plana' },
    { icone: 'scan-outline' as const, texto: 'Enquadre o documento inteiro na foto' },
];

export default function CameraDocumento() {
    const { tipo } = useLocalSearchParams<{ tipo: string }>();
    const [etapa, setEtapa] = useState<Etapa>('preparo');
    const [permission, requestPermission] = useCameraPermissions();
    const [fotoUri, setFotoUri] = useState<string | null>(null);
    const { isPracticeMode, setPracticePhoto } = usePracticeMode();
    const [salvando, setSalvando] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (etapa === 'confirmacao') {
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 40,
                friction: 6,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0);
        }
    }, [etapa]);

    async function tirarFoto() {
        const foto = await cameraRef.current?.takePictureAsync({ shutterSound: false });
        if (foto) {
            setFotoUri(foto.uri);
            setEtapa('preview');
        }
    }

    async function confirmarFoto() {
        if (!fotoUri) return;
        setSalvando(true);
        try {
            if (isPracticeMode) {
                const doc = mockDocuments.find(d => d.type === tipo);
                if (doc) {
                    doc.file_url = fotoUri;
                    doc.status = 'active';
                }
                setPracticePhoto(tipo, fotoUri);
                setEtapa('confirmacao');
                return;
            }

            let doc = await agricultoresDb?.getFirstAsync<{ id: string }>(
                'SELECT id FROM documents WHERE type = ? ORDER BY created_at DESC LIMIT 1',
                [tipo]
            );
            if (!doc) {
                const novoId = uuid.v4();
                const agora = new Date().toISOString();
                await agricultoresDb?.runAsync(
                    `INSERT INTO documents (id, type, status, sincronizado, created_at, updated_at) VALUES (?, ?, 'active', 0, ?, ?)`,
                    [novoId, tipo, agora, agora]
                );
                doc = { id: novoId };
            }
            await processAndSavePhoto(fotoUri, doc.id);
            await agendarAlertas();
            setEtapa('confirmacao');
        } catch {
            Alert.alert('Erro', 'Não foi possível salvar a foto.');
        } finally {
            setSalvando(false);
        }
    }

    // --- ETAPA 1: PREPARO ---
    if (etapa === 'preparo') {
        return (
            <ScreenContainer variant="teal">
                <TopBar leftIcon="arrow-back" />
                <View style={styles.preparoContainer}>
                    <Ionicons name="camera" size={64} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.preparoTitulo}>Fotografar {tipo}</Text>
                    <Text style={styles.preparoSubtitulo}>Siga as dicas para uma boa foto</Text>

                    <View style={styles.instrucoesList}>
                        {INSTRUCOES.map((item) => (
                            <View key={item.texto} style={styles.instrucaoItem}>
                                <View style={styles.instrucaoIcone}>
                                    <Ionicons name={item.icone} size={22} color={colors.tealDark} />
                                </View>
                                <Text style={styles.instrucaoTexto}>{item.texto}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.preparoBotao}>
                    <GradientButton
                        label="📷  Abrir câmera"
                        variant="cream"
                        onPress={() => {
                            if (!permission?.granted) requestPermission().then((r) => { if (r.granted) setEtapa('camera'); });
                            else setEtapa('camera');
                        }}
                        style={{ width: '100%' }}
                    />
                </View>
            </ScreenContainer>
        );
    }

    // --- SEM PERMISSÃO ---
    if (!permission?.granted) {
        return (
            <ScreenContainer variant="teal">
                <TopBar leftIcon="arrow-back" />
                <View style={styles.preparoContainer}>
                    <Ionicons name="camera-outline" size={64} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.preparoTitulo}>Permissão necessária</Text>
                    <Text style={styles.preparoSubtitulo}>
                        Precisamos acessar a câmera para fotografar seu documento.
                    </Text>
                </View>
                <View style={styles.preparoBotao}>
                    <GradientButton label="Permitir câmera" variant="cream" onPress={requestPermission} style={{ width: '100%' }} />
                </View>
            </ScreenContainer>
        );
    }

    // --- ETAPA 2: CÂMERA ---
    if (etapa === 'camera') {
        return (
            <View style={styles.cameraRoot}>
                <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={'back' as CameraType} mute>
                    <View style={styles.cameraTopBar}>
                        <TouchableOpacity onPress={() => setEtapa('preparo')} hitSlop={12}>
                            <Ionicons name="arrow-back" size={26} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cameraInstrucao}>
                        <Text style={styles.cameraInstrucaoTexto}>Enquadre o {tipo} na moldura</Text>
                    </View>

                    <View style={styles.moldura}>
                        <View style={[styles.canto, styles.cantoTL]} />
                        <View style={[styles.canto, styles.cantoTR]} />
                        <View style={[styles.canto, styles.cantoBL]} />
                        <View style={[styles.canto, styles.cantoBR]} />
                    </View>

                    <View style={styles.shutterArea}>
                        <TouchableOpacity style={styles.shutter} onPress={tirarFoto} />
                    </View>
                </CameraView>
            </View>
        );
    }

    // --- ETAPA 3: PREVIEW ---
    if (etapa === 'preview') {
        return (
            <ScreenContainer variant="orange">
                <TopBar leftIcon="arrow-back" onLeftPress={() => setEtapa('camera')} />
                <View style={styles.previewContainer}>
                    <Text style={styles.previewTitulo}>Como ficou?</Text>
                    <Image source={{ uri: fotoUri ?? '' }} style={styles.previewFoto} resizeMode="contain" />
                </View>
                <View style={styles.previewBotoes}>
                    <GradientButton
                        label="↩  Tirar de novo"
                        variant="cream"
                        onPress={() => { setFotoUri(null); setEtapa('camera'); }}
                        disabled={salvando}
                        style={{ flex: 1 }}
                    />
                    <GradientButton
                        label={salvando ? 'Salvando...' : '✓  Ficou bom!'}
                        variant="teal"
                        onPress={confirmarFoto}
                        disabled={salvando}
                        style={{ flex: 1 }}
                    />
                </View>
            </ScreenContainer>
        );
    }

    // --- ETAPA 4: CONFIRMAÇÃO ---
    return (
        <ScreenContainer variant="orange">
            <View style={styles.confirmacaoCentro}>
                <Animated.View style={[styles.selo, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.seloInterno}>
                        <Ionicons name="checkmark" size={72} color={colors.goldDark} />
                    </View>
                </Animated.View>
            </View>

            <View style={styles.confirmacaoCard}>
                <Text style={styles.confirmacaoTitulo}>Tá guardado!</Text>
                <Text style={styles.confirmacaoTexto}>
                    Pronto, seu {tipo} tá guardado. Quando tiver internet eu mando pro servidor sozinho.
                </Text>
            </View>

            <View style={styles.confirmacaoBotao}>
                <GradientButton
                    label="Voltar pro início"
                    variant="red"
                    onPress={() => router.replace('/(tabs)')}
                    style={{ width: '100%' }}
                />
            </View>
        </ScreenContainer>
    );
}

