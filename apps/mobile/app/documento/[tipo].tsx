import { LinearGradient } from 'expo-linear-gradient';
import { agricultoresDb } from '../../src/db/index';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState, useRef, useEffect } from 'react';
import { ActivityIndicator, Text, View, Modal, Image, TouchableOpacity } from 'react-native';
import { useTutorial } from '../../src/contexts/TutorialContext';
import { Ionicons } from '@expo/vector-icons';
import AudioPlayer from '../../components/AudioPlayer';
import TutorialGlow from '../../components/TutorialGlow';
import { GradientButton, ScreenContainer, TopBar } from '../../design/components';
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
    const { registrarRef, zonaAtiva } = useTutorial();
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
    const [fotoVisivel, setFotoVisivel] = useState(false);
    const [imagemVisivel, setImagemVisivel] = useState(false);
    const imagemDoc = IMAGENS_DOC[tipo];
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

            {/* Cabeçalho: título + badge de status */}
            <TutorialGlow active={zonaAtiva === 'doc-hero'} borderRadius={20} style={{ marginHorizontal: 12 }}>
                <View ref={heroRef} style={styles.top}>
                    <Text style={styles.titulo}>{tipo}</Text>
                    <Text style={styles.subtitulo}>{meta?.fullName ?? tipo}</Text>

                    
                        <View ref={statusRef}>
                            <LinearGradient
                                colors={[...statusGradients[docStatus]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.statusBadgeSmall}
                            >
                                <Text style={styles.statusBadgeTexto}>{big} · {sub}</Text>
                            </LinearGradient>
                        </View>
                    
                </View>
            </TutorialGlow>

            {/* Imagem do documento — ocupa o espaço principal */}
            {imagemDoc ? (
                 
                <TouchableOpacity
                    style={styles.imagemWrap}
                    onPress={() => setImagemVisivel(true)}
                    activeOpacity={0.9}
                >
                    <TutorialGlow active={zonaAtiva === 'doc-status'} borderRadius={20}>
                    <Image source={imagemDoc} style={styles.imagemHeroFull} resizeMode="contain" />
                    </TutorialGlow>
                </TouchableOpacity>
                
            ) : (
                <View style={styles.semImagemWrap}>
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

            {/* Descrição e validade */}
            <View style={styles.descricaoWrap}>
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

            <TutorialGlow active={zonaAtiva === 'doc-acoes'} borderRadius={20} style={{ marginHorizontal: 12, marginTop: 'auto' as const }}>
                <View ref={acoesRef} style={[styles.acoes, { marginTop: 0 }]}>
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
                    <GradientButton
                        label="Guardar foto do documento"
                        variant="red"
                        disabled={!dependenciaCumprida}
                        onPress={() => router.push(`/camera/${tipo}`)}
                    />
                </View>
            </TutorialGlow>

            <Modal visible={fotoVisivel} transparent animationType="fade">
                <TouchableOpacity style={styles.avisoFundo} activeOpacity={1} onPress={() => setFotoVisivel(false)}>
                    <Image source={{ uri: documento?.file_url ?? '' }} style={{ width: '90%', height: '75%' }} resizeMode="contain" />
                    <TouchableOpacity style={{ position: 'absolute', top: 52, right: 20 }} onPress={() => setFotoVisivel(false)}>
                        <Ionicons name="close-circle" size={52} color="#fff" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Modal visible={imagemVisivel} transparent animationType="fade">
                <TouchableOpacity style={modalStyles.fundo} activeOpacity={1} onPress={() => setImagemVisivel(false)}>
                    <Image source={imagemDoc} style={modalStyles.imagem} resizeMode="contain" />
                    <TouchableOpacity style={modalStyles.fechar} onPress={() => setImagemVisivel(false)}>
                        <Ionicons name="close-circle" size={48} color="#fff" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <AudioPlayer
                source={require('../../assets/audio/829108__jamm__notification-sound-4-hopeful.mp3')}
                autoPlay={false}
                style={styles.player}
            />
        </ScreenContainer>
    );
}
