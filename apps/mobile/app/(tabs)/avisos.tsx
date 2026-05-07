import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { avisosStyles as styles } from '../../styles/avisosStyles';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { agricultoresDb } from '../../src/db/index';
import { ScreenContainer } from '../../design/components';
import { colors } from '../../design/theme';

type DocRow = {
    type: string;
    status: string | null;
    expiration_date: string | null;
};

type Aviso = {
    tipo: string;
    icone: keyof typeof Ionicons.glyphMap;
    titulo: string;
    subtitulo: string;
    cor: string;
    urgencia: 'red' | 'yellow';
};

const TRINTA_DIAS = 30 * 24 * 60 * 60 * 1000;

function gerarAvisos(docs: DocRow[], nomeAgri: string): Aviso[] {
    const avisos: Aviso[] = [];
    const hoje = Date.now();

    for (const doc of docs) {
        if (!doc.expiration_date && doc.status !== 'expired') continue;

        if (doc.expiration_date) {
            const vencimento = new Date(doc.expiration_date).getTime();
            const diasRestantes = Math.ceil((vencimento - hoje) / (24 * 60 * 60 * 1000));

            if (hoje > vencimento) {
                avisos.push({
                    tipo: doc.type,
                    icone: 'alert-circle',
                    titulo: `${doc.type} vencido`,
                    subtitulo: 'Precisa renovar logo',
                    cor: colors.redMid,
                    urgencia: 'red',
                });
            } else if (vencimento - hoje <= TRINTA_DIAS) {
                avisos.push({
                    tipo: doc.type,
                    icone: 'calendar',
                    titulo: `${doc.type} vence em ${diasRestantes} dia${diasRestantes !== 1 ? 's' : ''}`,
                    subtitulo: `${nomeAgri}, dá uma olhada`,
                    cor: colors.orangeMid,
                    urgencia: 'yellow',
                });
            }
        } else if (doc.status === 'expired') {
            avisos.push({
                tipo: doc.type,
                icone: 'alert-circle',
                titulo: `${doc.type} vencido`,
                subtitulo: 'Precisa renovar logo',
                cor: colors.redMid,
                urgencia: 'red',
            });
        }
    }

    return avisos.sort((a, b) => (a.urgencia === 'red' ? -1 : 1));
}

export default function Avisos() {
    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [nomeAgri, setNomeAgri] = useState('Agricultor');

    useFocusEffect(
        useCallback(() => {
            async function carregar() {
                const userRow = await agricultoresDb?.getFirstAsync<{ name: string }>(
                    'SELECT name FROM users ORDER BY created_at DESC LIMIT 1'
                );
                const nome = userRow?.name ?? 'Agricultor';
                setNomeAgri(nome);

                const docs = await agricultoresDb?.getAllAsync<DocRow>(
                    `SELECT type, status, expiration_date FROM documents
                     WHERE type IN ('CAF','CAR','CCIR','ITR','NFA-e')
                     GROUP BY type
                     HAVING created_at = MAX(created_at)`
                );

                setAvisos(gerarAvisos(docs ?? [], nome));
            }
            carregar();
        }, [])
    );

    return (
        <ScreenContainer variant="cream">
            <View style={styles.header}>
                <Text style={styles.titulo}>Avisos</Text>
                <Text style={styles.subtitulo}>
                    {avisos.length === 0
                        ? 'Tudo em ordem!'
                        : `${avisos.length} coisa${avisos.length !== 1 ? 's' : ''} pra olhar`}
                </Text>
            </View>

            {avisos.length === 0 ? (
                <View style={styles.vazio}>
                    <View style={styles.vazioBadge}>
                        <Ionicons name="checkmark-circle" size={64} color={colors.tealMid} />
                    </View>
                    <Text style={styles.vazioTitulo}>Nada pra resolver</Text>
                    <Text style={styles.vazioTexto}>
                        Todos os seus documentos estão em dia. Continue assim!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={avisos}
                    keyExtractor={(item) => item.tipo}
                    contentContainerStyle={styles.lista}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => router.push(`/documento/${item.tipo}`)}
                        >
                            <View style={[styles.card, { backgroundColor: item.cor }]}>
                                <View style={styles.cardIcone}>
                                    <Ionicons name={item.icone} size={20} color={colors.white} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.cardTitulo}>{item.titulo}</Text>
                                    <Text style={styles.cardSub}>{item.subtitulo}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </ScreenContainer>
    );
}

