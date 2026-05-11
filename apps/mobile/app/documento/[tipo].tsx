import { LinearGradient } from 'expo-linear-gradient';
import { agricultoresDb } from '../../src/db/index';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View, Modal, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AudioPlayer from '../../components/AudioPlayer';
import { DocumentTypeIcon, GradientButton, ScreenContainer, TopBar } from '../../design/components';
import { DocStatus } from '../../design/components/DocCircle';
import { colors, statusGradients } from '../../design/theme';
import { detalheDocumentoStyles as styles, docImagemModalStyles as modalStyles } from '../../styles/detalheDocumentoStyles';
import { documentMeta, isDocumentType } from '../../src/constants/documents';

const IMAGENS_DOC: Partial<Record<string, any>> = {
    CAF:  require('../../assets/docs/CAF.png'),
    CAR:  require('../../assets/docs/car.png'),
    CCIR: require('../../assets/docs/CCIR.png'),
    ITR:  require('../../assets/docs/ITR.png'),
};

type DocumentoStatus = 'active' | 'expiring_soon' | 'expired' | null;

type Documento = {
    id: string;
    type: string;
    expiration_date: string | null;
    status: DocumentoStatus;
};

function resolverStatus(doc: Documento | null): DocStatus {
    if (!doc) return 'grey';
    if (doc.expiration_date) {
        const dias = Math.ceil((new Date(doc.expiration_date).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
        if (dias < 0) return 'red';
        if (dias <= 30) return 'yellow';
        return 'green';
    }
    if (doc.status === 'active') return 'green';
    if (doc.status === 'expiring_soon') return 'yellow';
    if (doc.status === 'expired') return 'red';
    return 'grey';
}

function statusTexto(doc: Documento | null, docStatus: DocStatus): { big: string; sub: string } {
    if (docStatus === 'grey') return { big: 'Faltando', sub: 'CADASTRAR' };
    if (docStatus === 'red') return { big: 'Vencido', sub: 'PRECISA RENOVAR' };
    if (docStatus === 'green') return { big: 'Em dia', sub: 'TUDO CERTO' };
    if (doc?.expiration_date) {
        const dias = Math.ceil((new Date(doc.expiration_date).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
        return { big: `${dias} dias`, sub: 'PRA VENCER' };
    }
    return { big: 'Vencendo', sub: 'PRA VENCER' };
}

export default function DetalheDocumento() {
    const { tipo } = useLocalSearchParams<{ tipo: string }>();
    const [documento, setDocumento] = useState<Documento | null>(null);
    const [loading, setLoading] = useState(true);
    const [imagemVisivel, setImagemVisivel] = useState(false);
    const imagemDoc = IMAGENS_DOC[tipo];
    const documentType = tipo && isDocumentType(tipo) ? tipo : null;
    const meta = documentType ? documentMeta[documentType] : null;

    useFocusEffect(
        useCallback(() => {
            async function buscarDocumento() {
                setLoading(true);

                try {
                    const result = await agricultoresDb?.getFirstAsync<Documento>(
                        'SELECT * FROM documents WHERE type = ? ORDER BY created_at DESC LIMIT 1',
                        [tipo]
                    );
                    setDocumento(result ?? null);
                } finally {
                    setLoading(false);
                }
            }

            buscarDocumento();
        }, [tipo])
    );

    if (loading) {
        return (
            <ScreenContainer variant="gold">
                <ActivityIndicator color={colors.white} style={{ flex: 1 }} />
            </ScreenContainer>
        );
    }

    const docStatus = resolverStatus(documento);
    const { big, sub } = statusTexto(documento, docStatus);

    return (
        <ScreenContainer variant="gold">
            <TopBar leftIcon="arrow-back" rightIcon="volume-high" />

            <View style={styles.top}>
                <Text style={styles.titulo}>{tipo}</Text>
                <Text style={styles.subtitulo}>{meta?.fullName ?? tipo}</Text>
            </View>

            {/* Imagem de referência (ocupa o espaço principal) */}
            {imagemDoc ? (
                <TouchableOpacity
                    style={styles.imagemContainer}
                    activeOpacity={0.95}
                    onPress={() => setImagemVisivel(true)}
                >
                    <Image source={imagemDoc} style={styles.imagemReferencia} resizeMode="contain" />
                    
                </TouchableOpacity>
            ) : (
                <View style={styles.semImagem}>
                    {documentType ? <DocumentTypeIcon type={documentType} size={100} /> : null}
                    <LinearGradient
                        colors={[...statusGradients[docStatus]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statusCircle}
                    >
                        <Text style={styles.statusBig}>{big}</Text>
                        <Text style={styles.statusSub}>{sub}</Text>
                    </LinearGradient>
                </View>
            )}

            <View style={styles.acoes}>
                <GradientButton
                    label="Como consigo?"
                    variant="teal"
                    align="flex-start"
                    onPress={() => router.push(`/guia/${tipo}`)}
                />
                <GradientButton label="Tenho duvida" variant="orange" align="flex-start" />
                <GradientButton
                    label="Ja tenho, quero guardar"
                    variant="red"
                    align="flex-start"
                    onPress={() => router.push(`/camera/${tipo}`)}
                />
            </View>

            <Modal visible={imagemVisivel} transparent animationType="fade">
                <TouchableOpacity style={modalStyles.fundo} activeOpacity={1} onPress={() => setImagemVisivel(false)}>
                    <Image source={imagemDoc} style={modalStyles.imagem} resizeMode="contain" />
                    <TouchableOpacity style={modalStyles.fechar} onPress={() => setImagemVisivel(false)}>
                        <Ionicons name="close-circle" size={48} color="#fff" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </ScreenContainer>
    );
}
