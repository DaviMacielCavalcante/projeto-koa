import { LinearGradient } from 'expo-linear-gradient';
import { agricultoresDb } from '../../src/db/index';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState, useRef, useEffect } from 'react';
import { ActivityIndicator, Text, View, Modal, Image, TouchableOpacity } from 'react-native';
import { useTutorial } from '../../src/contexts/TutorialContext';
import { Ionicons } from '@expo/vector-icons';
import AudioPlayer from '../../components/AudioPlayer';
import { DocumentTypeIcon, GradientButton, ScreenContainer, TopBar } from '../../design/components';
import { DocStatus } from '../../design/components/DocCircle';
import { colors, statusGradients } from '../../design/theme';
import { detalheDocumentoStyles as styles } from '../../styles/detalheDocumentoStyles';
import { documentMeta, isDocumentType } from '../../src/constants/documents';

type DocumentoStatus = 'active' | 'expiring_soon' | 'expired' | null;

type Documento = {
    id: string;
    type: string;
    expiration_date: string | null;
    status: DocumentoStatus;
    file_url: string | null;
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
    const { registrarRef } = useTutorial();
    const heroRef = useRef<View>(null);
    const statusRef = useRef<View>(null);
    const acoesRef = useRef<View>(null);
    const [documento, setDocumento] = useState<Documento | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        registrarRef('doc-hero', heroRef);
        registrarRef('doc-status', statusRef);
        registrarRef('doc-acoes', acoesRef);
    }, []);
    const [avisoNfae, setAvisoNfae] = useState(false);
    const [fotoVisivel, setFotoVisivel] = useState(false);
    const [avisoDependencia, setAvisoDependencia] = useState<string | null>(null);
    const [dependenciaCumprida, setDependenciaCumprida] = useState(true);

    const DEPENDENCIAS: Partial<Record<string, string>> = { CAF: 'CCIR', CAR: 'CAF' };

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

                    const dep = DEPENDENCIAS[tipo];
                    if (dep) {
                        const depDoc = await agricultoresDb?.getFirstAsync<{ id: string }>(
                            'SELECT id FROM documents WHERE type = ? ORDER BY created_at DESC LIMIT 1',
                            [dep]
                        );
                        const cumprida = !!depDoc;
                        setDependenciaCumprida(cumprida);
                        setAvisoDependencia(cumprida ? null : dep);
                    } else {
                        setDependenciaCumprida(true);
                        setAvisoDependencia(null);
                    }
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
            <TopBar leftIcon="arrow-back" />

            <View ref={heroRef} style={styles.top}>
                {documentType ? (
                    <View style={styles.heroIconWrap}>
                        <DocumentTypeIcon type={documentType} size={104} />
                    </View>
                ) : null}

                <Text style={styles.titulo}>{tipo}</Text>
                <Text style={styles.subtitulo}>{meta?.fullName ?? tipo}</Text>

                <View ref={statusRef}>
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

                <Text style={styles.descricao}>{meta?.description ?? ''}</Text>

                {documento?.expiration_date ? (
                    <Text style={styles.validade}>
                        Validade: {new Date(documento.expiration_date).toLocaleDateString('pt-BR')}
                    </Text>
                ) : null}
            </View>

            {avisoDependencia && (
                <View style={styles.bannnerDep}>
                    <Ionicons name="lock-closed" size={16} color={colors.orangeDark} />
                    <Text style={styles.bannerDepTexto}>
                        Para guardar a foto do {tipo} você precisa primeiro registrar o{' '}
                        <Text style={styles.bannerDepLink} onPress={() => router.push(`/documento/${avisoDependencia}`)}>
                            {avisoDependencia}
                        </Text>.
                    </Text>
                </View>
            )}

            <View ref={acoesRef} style={styles.acoes}>
                {documento?.file_url ? (
                    <GradientButton
                        label="Ver foto salva"
                        variant="gold"
                        onPress={() => setFotoVisivel(true)}
                    />
                ) : null}
                <GradientButton
                    label="Como conseguir"
                    variant="teal"
                    onPress={() => router.push(`/guia/${tipo}`)}
                />
                <GradientButton label="Tenho duvida" variant="orange" onPress={() => router.push(`/faq/${tipo}`)} />
                {tipo === 'NFA-e' && (
                    <GradientButton
                        label="Ver notas salvas"
                        variant="teal"
                        onPress={() => router.push('/nfae-lista')}
                    />
                )}
                <GradientButton
                    label={tipo === 'NFA-e' ? 'Preencher dados da nota' : 'Guardar foto do documento'}
                    variant="red"
                    disabled={!dependenciaCumprida && tipo !== 'NFA-e'}
                    onPress={() => tipo === 'NFA-e' ? setAvisoNfae(true) : router.push(`/camera/${tipo}`)}
                />
            </View>

            <Modal visible={fotoVisivel} transparent animationType="fade">
                <TouchableOpacity style={styles.avisoFundo} activeOpacity={1} onPress={() => setFotoVisivel(false)}>
                    <Image source={{ uri: documento?.file_url ?? '' }} style={{ width: '90%', height: '75%' }} resizeMode="contain" />
                    <TouchableOpacity style={{ position: 'absolute', top: 52, right: 20 }} onPress={() => setFotoVisivel(false)}>
                        <Ionicons name="close-circle" size={52} color="#fff" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <AudioPlayer
                source={require('../../assets/audio/829108__jamm__notification-sound-4-hopeful.mp3')}
                autoPlay={false}
                style={styles.player}
            />

            <Modal visible={avisoNfae} transparent animationType="fade">
                <View style={styles.avisoFundo}>
                    <View style={styles.avisoCard}>
                        <View style={styles.avisoIcone}>
                            <Ionicons name="warning" size={32} color={colors.white} />
                        </View>
                        <Text style={styles.avisoTitulo}>Cuidado antes de continuar</Text>
                        <Text style={styles.avisoTexto}>
                            Antes de fazer uma nota fiscal, confira bem os dados — nome, quantidade e valor do que você vai vender.{'\n\n'}
                            Se tiver algo errado, você pode ter <Text style={styles.avisoDestaque}>problema com a fiscalização</Text> e ser obrigado a pagar <Text style={styles.avisoDestaque}>multa</Text>.{'\n\n'}
                        </Text>
                        <TouchableOpacity style={styles.avisoBtn} onPress={() => { setAvisoNfae(false); router.push('/nfae-form'); }}>
                            <Text style={styles.avisoBtnTexto}>Entendi, continuar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.avisoBtnVoltar} onPress={() => setAvisoNfae(false)}>
                            <Text style={styles.avisoBtnVoltarTexto}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScreenContainer>
    );
}
