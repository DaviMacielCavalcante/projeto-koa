import { useLocalSearchParams, router } from 'expo-router';
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import uuid from 'react-native-uuid';
import BackButton from '../../components/BackButton';
import { processAndSavePhoto } from '../../src/services/photo';
import { usePracticeMode } from '../../src/hooks/usePracticeMode';
import { agricultoresDb } from '../../src/db/index';
import { agendarAlertas } from '../../src/services/notificacoes';
import { cameraStyles as styles } from '../../styles/documentoStyles';

export default function CameraDocumento() {
    const { tipo } = useLocalSearchParams<{ tipo: string }>();
    const { isPracticeMode, setPracticePhoto } = usePracticeMode();
    const [permission, requestPermission] = useCameraPermissions();
    const [fotoUri, setFotoUri] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    async function tirarFoto() {
        const foto = await cameraRef.current?.takePictureAsync();
        if (foto) setFotoUri(foto.uri);
    }

    async function confirmarFoto() {
        if (!fotoUri) return;
        setSalvando(true);
        try {
            if (isPracticeMode) {
                setPracticePhoto(tipo ?? '', fotoUri);
                Alert.alert('Pronto!', `Seu ${tipo} tá guardado (modo prática).`, [
                    { text: 'OK', onPress: () => router.back() },
                ]);
                return;
            }

            // Fluxo normal: buscar ou criar documento no banco
            let doc: { id: string } | null | undefined;
            doc = await agricultoresDb?.getFirstAsync<{ id: string }>(
                'SELECT id FROM documents WHERE type = ? ORDER BY created_at DESC LIMIT 1',
                [tipo]
            );

            if (!doc) {
                const novoId = uuid.v4() as string;
                const agora = new Date().toISOString();
                await agricultoresDb?.runAsync(
                    `INSERT INTO documents (id, type, status, sincronizado, created_at, updated_at)
                     VALUES (?, ?, 'active', 0, ?, ?)`,
                    [novoId, tipo, agora, agora]
                );
                doc = { id: novoId };
            }

            await processAndSavePhoto(fotoUri, doc.id);
            await agendarAlertas();
            Alert.alert('Pronto!', `Seu ${tipo} tá guardado.`, [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch {
            Alert.alert('Erro', 'Não foi possível salvar a foto.');
        } finally {
            setSalvando(false);
        }
    }

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <BackButton />
                <Text style={styles.permissaoTexto}>
                    Precisamos de acesso à câmera para fotografar seu documento.
                </Text>
                <TouchableOpacity style={styles.botao} onPress={requestPermission}>
                    <Text style={styles.botaoTexto}>Permitir câmera</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (fotoUri) {
        return (
            <View style={styles.container}>
                <Image source={{ uri: fotoUri }} style={styles.preview} resizeMode="contain" />
                <View style={styles.acoes}>
                    <TouchableOpacity
                        style={[styles.botao, styles.botaoSecundario]}
                        onPress={() => setFotoUri(null)}
                        disabled={salvando}
                    >
                        <Text style={[styles.botaoTexto, styles.botaoTextoSecundario]}>
                            Tirar de novo
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.botao}
                        onPress={confirmarFoto}
                        disabled={salvando}
                    >
                        <Text style={styles.botaoTexto}>
                            {salvando ? 'Salvando...' : 'Ficou bom'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={'back' as CameraType}>
                <View style={styles.instrucao}>
                    <Text style={styles.instrucaoTexto}>
                        Tire uma foto do seu {tipo}
                    </Text>
                </View>
                <View style={styles.capturaBotaoContainer}>
                    <BackButton />
                    <TouchableOpacity style={styles.capturaBotao} onPress={tirarFoto} />
                </View>
            </CameraView>
        </View>
    );
}

