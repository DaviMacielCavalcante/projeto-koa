import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { agricultoresDb } from '../../src/db/index';
import BackButton from '../../components/BackButton';
import AudioPlayer from '../../components/AudioPlayer';
import { colors } from '../../constants/theme';
import { documentoStyles as styles } from '../../styles/documentoStyles';

type DocumentoStatus = 'active' | 'expiring_soon' | 'expired' | null;

type Documento = {
    id: string;
    type: string;
    number: string;
    issue_date: string;
    expiration_date: string;
    status: DocumentoStatus;
    file_url: string | null;
};

const STATUS_COLOR: Record<string, string> = {
    active: colors.statusGreen,
    expiring_soon: colors.statusYellow,
    expired: colors.statusRed,
};

const STATUS_LABEL: Record<string, string> = {
    active: 'Válido',
    expiring_soon: 'Vencendo em breve',
    expired: 'Vencido',
};

const DESCRICAO: Record<string, string> = {
    CAF: 'Cadastro da Agricultura Familiar — comprova que você é agricultor familiar e dá acesso a políticas públicas.',
    CAR: 'Cadastro Ambiental Rural — registro obrigatório da sua propriedade no sistema ambiental.',
    CCIR: 'Certificado de Cadastro de Imóvel Rural — documento que identifica e certifica seu imóvel rural.',
    ITR: 'Imposto Territorial Rural — declaração anual obrigatória sobre sua propriedade rural.',
    'NFA-e': 'Nota Fiscal Avulsa Eletrônica — usada para emitir notas na venda dos seus produtos.',
};

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

    const corStatus = documento?.status
        ? (STATUS_COLOR[documento.status] ?? colors.statusGray)
        : colors.statusGray;

    const labelStatus = documento?.status
        ? (STATUS_LABEL[documento.status] ?? 'Sem dados')
        : 'Sem dados';

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { flex: 1 }]}>
            <BackButton />

            <View style={styles.header}>
                <View style={[styles.indicador, { backgroundColor: corStatus }]} />
                <Text style={styles.titulo}>{tipo}</Text>
                <Text style={styles.statusLabel}>{labelStatus}</Text>
            </View>

            <Text style={styles.descricao}>{DESCRICAO[tipo] ?? ''}</Text>

            {documento?.expiration_date && (
                <Text style={styles.validade}>
                    Validade: {new Date(documento.expiration_date).toLocaleDateString('pt-BR')}
                </Text>
            )}

            <View style={styles.botoes}>
                <TouchableOpacity style={styles.botao} onPress={() => router.push(`/guia/${tipo}`)}>
                    <Text style={styles.botaoTexto}>Como consigo?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.botao, styles.botaoSecundario]}>
                    <Text style={[styles.botaoTexto, styles.botaoTextoSecundario]}>Tenho dúvida</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.botao, styles.botaoSecundario]} onPress={() => router.push(`/camera/${tipo}`)}>
                    <Text style={[styles.botaoTexto, styles.botaoTextoSecundario]}>Já tenho, quero guardar</Text>
                </TouchableOpacity>
            </View>

            <AudioPlayer
                source={require('../../assets/audio/829108__jamm__notification-sound-4-hopeful.mp3')}
                autoPlay={false}
                style={{ position: 'absolute', bottom: 24, right: 24 }}
            />
        </View>
    );
}

