import { router, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { inicioStyles as styles } from '../../styles/inicioStyles';
import { Ionicons } from '@expo/vector-icons';
import { agricultoresDb } from '../../src/db/index';
import { usePracticeMode } from '../../src/hooks/usePracticeMode';
import { DocCircle, ScreenContainer } from '../../design/components';
import { DocStatus } from '../../design/components/DocCircle';
import { colors } from '../../design/theme';
import AudioPlayer from '../../components/AudioPlayer';

const TIPOS = ['ITR', 'CCIR', 'CAF', 'CAR', 'NFA-e'];

const TRINTA_DIAS = 30 * 24 * 60 * 60 * 1000;

const STATUS_SUBTITLE: Record<DocStatus, string> = {
    green: 'em dia',
    yellow: 'vencendo',
    red: 'vencido',
    grey: 'faltando',
};

type DocRow = { type: string; status: string | null; expiration_date: string | null };

function calcularStatus(row: DocRow | null): DocStatus {
    if (!row) return 'grey';
    if (row.expiration_date) {
        const vencimento = new Date(row.expiration_date).getTime();
        const hoje = Date.now();
        if (hoje > vencimento) return 'red';
        if (vencimento - hoje <= TRINTA_DIAS) return 'yellow';
        return 'green';
    }
    if (row.status === 'active') return 'green';
    if (row.status === 'expiring_soon') return 'yellow';
    if (row.status === 'expired') return 'red';
    return 'grey';
}

export default function Inicio() {
    const { isPracticeMode } = usePracticeMode();
    const [docs, setDocs] = useState(
        TIPOS.map((nome) => ({ nome, status: 'grey' as DocStatus }))
    );
    const [nomeUsuario, setNomeUsuario] = useState('Agricultor');

    useFocusEffect(
        useCallback(() => {
            async function carregarStatus() {
                if (isPracticeMode) {
                    const { mockFarmer, mockDocuments } = await import('../../src/mocks/practiceData');
                    setNomeUsuario(mockFarmer.name);
                    const mapa: Record<string, DocRow> = {};
                    mockDocuments.forEach(d => (mapa[d.type] = d as DocRow));
                    setDocs(TIPOS.map((nome) => ({ nome, status: calcularStatus(mapa[nome] ?? null) })));
                    return;
                }

                const userRow = await agricultoresDb?.getFirstAsync<{ name: string }>(
                    'SELECT name FROM users ORDER BY created_at DESC LIMIT 1'
                );
                if (userRow?.name) setNomeUsuario(userRow.name);

                const rows = await agricultoresDb?.getAllAsync<DocRow>(
                    `SELECT type, status, expiration_date FROM documents
                     WHERE type IN ('CAF','CAR','CCIR','ITR','NFA-e')
                     GROUP BY type
                     HAVING created_at = MAX(created_at)`
                );
                const mapa: Record<string, DocRow> = {};
                rows?.forEach((r) => (mapa[r.type] = r));
                setDocs(TIPOS.map((nome) => ({
                    nome,
                    status: calcularStatus(mapa[nome] ?? null),
                })));
            }
            carregarStatus();
        }, [isPracticeMode])
    );

    return (
        <ScreenContainer variant="cream">
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.greetCard}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={22} color={colors.tealDark} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.greetLabel}>Bom dia,</Text>
                        <Text style={styles.greetName}>{nomeUsuario}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Seus Documentos</Text>

                <View style={styles.grid}>
                    {docs.map((doc) => (
                        <DocCircle
                            key={doc.nome}
                            name={doc.nome}
                            subtitle={STATUS_SUBTITLE[doc.status]}
                            status={doc.status}
                            onPress={() => router.push('/documento/' + doc.nome)}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.educationalCard}
                    activeOpacity={0.85}
                    onPress={() => router.push('/roadmap')}
                >
                    <View style={styles.educationalIcon}>
                        <Ionicons name="book" size={22} color={colors.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.educationalTitle}>Aprender sobre os documentos</Text>
                        <Text style={styles.educationalSub}>Estude no seu ritmo</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.tealDark} />
                </TouchableOpacity>
            </ScrollView>

            <AudioPlayer
                source={require('../../assets/audio/829108__jamm__notification-sound-4-hopeful.mp3')}
                autoPlay={false}
                style={styles.playerFixed}
            />

        </ScreenContainer>
    );
}

