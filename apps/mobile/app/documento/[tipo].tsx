import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { detalheDocumentoStyles as styles } from '../../styles/detalheDocumentoStyles';
import { agricultoresDb } from '../../src/db/index';
import { ScreenContainer, GradientButton, TopBar } from '../../design/components';
import { DocStatus } from '../../design/components/DocCircle';
import { colors, statusGradients } from '../../design/theme';
import AudioPlayer from '../../components/AudioPlayer';

type DocumentoStatus = 'active' | 'expiring_soon' | 'expired' | null;

type Documento = {
    id: string;
    type: string;
    expiration_date: string | null;
    status: DocumentoStatus;
};

const FULL_NAMES: Record<string, string> = {
    CAF: 'Cadastro da Agricultura Familiar',
    CAR: 'Cadastro Ambiental Rural',
    CCIR: 'Certificado de Cadastro de Imóvel Rural',
    ITR: 'Imposto Territorial Rural',
    'NFA-e': 'Nota Fiscal Avulsa Eletrônica',
};

const DESCRICAO: Record<string, string> = {
    CAF: 'Comprova que você é agricultor familiar e dá acesso a políticas públicas.',
    CAR: 'Registro obrigatório da sua propriedade no sistema ambiental.',
    CCIR: 'Documento que identifica e certifica seu imóvel rural.',
    ITR: 'Declaração anual obrigatória sobre sua propriedade rural.',
    'NFA-e': 'Usada para emitir notas na venda dos seus produtos.',
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

    useFocusEffect(
        useCallback(() => {
            async function buscarDocumento() {
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
                <Text style={styles.subtitulo}>{FULL_NAMES[tipo] ?? tipo}</Text>

                <LinearGradient
                    colors={[...statusGradients[docStatus]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.statusCircle}
                >
                    <Text style={styles.statusBig}>{big}</Text>
                    <Text style={styles.statusSub}>{sub}</Text>
                </LinearGradient>

                <Text style={styles.descricao}>{DESCRICAO[tipo] ?? ''}</Text>

                {documento?.expiration_date && (
                    <Text style={styles.validade}>
                        Validade: {new Date(documento.expiration_date).toLocaleDateString('pt-BR')}
                    </Text>
                )}
            </View>

            <View style={styles.acoes}>
                <GradientButton label="📍  Como consigo?" variant="teal" align="flex-start" onPress={() => router.push(`/guia/${tipo}`)} />
                <GradientButton label="❓  Tenho dúvida" variant="orange" align="flex-start" />
                <GradientButton label="📷  Já tenho, quero guardar" variant="red" align="flex-start" onPress={() => router.push(`/camera/${tipo}`)} />
            </View>

            <AudioPlayer
                source={require('../../assets/audio/829108__jamm__notification-sound-4-hopeful.mp3')}
                autoPlay={false}
                style={styles.player}
            />
        </ScreenContainer>
    );
}

