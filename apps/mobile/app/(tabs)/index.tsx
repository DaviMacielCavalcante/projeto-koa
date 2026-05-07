import { router, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { agricultoresDb } from '../../src/db/index';
import { practiceDataAccess } from '../../src/db/practiceDataAccess';
import { usePracticeMode } from '../../src/hooks/usePracticeMode';
import PracticeModeIndicator from '../../components/PracticeModeIndicator';
import { colors } from '../../constants/theme';

const TIPOS = ['CAF', 'CAR', 'CCIR', 'ITR', 'NFA-e'];
const TRINTA_DIAS = 30 * 24 * 60 * 60 * 1000;

type DocRow = { type: string; status: string | null; expiration_date: string | null };

function calcularCor(row: DocRow | null): string {
    if (!row) return colors.statusGray;

    if (row.expiration_date) {
        const vencimento = new Date(row.expiration_date).getTime();
        const hoje = Date.now();
        if (hoje > vencimento) return colors.statusRed;
        if (vencimento - hoje <= TRINTA_DIAS) return colors.statusYellow;
        return colors.statusGreen;
    }

    if (row.status === 'active') return colors.statusGreen;
    if (row.status === 'expiring_soon') return colors.statusYellow;
    if (row.status === 'expired') return colors.statusRed;

    return colors.statusGray;
}

export default function Inicio() {
    const { isPracticeMode } = usePracticeMode();
    const [docs, setDocs] = useState(
        TIPOS.map((nome) => ({ nome, cor: colors.statusGray }))
    );

    useFocusEffect(
        useCallback(() => {
            async function carregarCores() {
                const rows = isPracticeMode
                    ? await practiceDataAccess.getDocuments(true)
                    : await agricultoresDb?.getAllAsync<DocRow>(
                        `SELECT type, status, expiration_date FROM documents
                         WHERE type IN ('CAF','CAR','CCIR','ITR','NFA-e')
                         GROUP BY type
                         HAVING created_at = MAX(created_at)`
                    );

                const mapa: Record<string, DocRow> = {};
                rows?.forEach((r: any) => (mapa[r.type] = r));

                setDocs(TIPOS.map((nome) => ({
                    nome,
                    cor: calcularCor(mapa[nome] ?? null),
                })));
            }
            carregarCores();
        }, [isPracticeMode])
    );

    return (
        <View>
            <PracticeModeIndicator />
            <Text>Olá, João</Text>
            <FlatList
                data={docs}
                keyExtractor={(item) => item.nome}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: item.cor, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => router.push('/documento/' + item.nome)}
                    >
                        <Text>{item.nome}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
