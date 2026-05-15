import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, TopBar } from '../design/components';
import { colors, fonts, sizes } from '../design/theme';
import { agricultoresDb } from '../src/db/index';

type Rascunho = {
    id: string;
    comprador_nome: string;
    descricao: string;
    valor: string;
    created_at: string;
};

export default function NfaeLista() {
    const [notas, setNotas] = useState<Rascunho[]>([]);

    useFocusEffect(
        useCallback(() => {
            async function carregar() {
                const rows = await agricultoresDb?.getAllAsync<Rascunho>(
                    'SELECT id, comprador_nome, descricao, valor, created_at FROM nfae_rascunhos ORDER BY created_at DESC'
                );
                setNotas(rows ?? []);
            }
            carregar();
        }, [])
    );

    async function excluir(id: string) {
        Alert.alert('Excluir nota', 'Tem certeza que quer apagar esta nota?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    await agricultoresDb?.runAsync('DELETE FROM nfae_rascunhos WHERE id = ?', [id]);
                    setNotas(prev => prev.filter(n => n.id !== id));
                },
            },
        ]);
    }

    return (
        <ScreenContainer variant="teal">
            <TopBar leftIcon="arrow-back" />

            <View style={styles.header}>
                <Text style={styles.titulo}>Notas Fiscais</Text>
                <Text style={styles.subtitulo}>
                    {notas.length === 0
                        ? 'Nenhuma nota salva ainda.'
                        : `${notas.length} nota${notas.length !== 1 ? 's' : ''} salva${notas.length !== 1 ? 's' : ''}`}
                </Text>
            </View>

            {notas.length === 0 ? (
                <View style={styles.vazio}>
                    <Ionicons name="document-text-outline" size={56} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.vazioTexto}>
                        Ainda não há notas salvas. Preencha os dados de uma nota na tela do NFA-e.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={notas}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.lista}
                    renderItem={({ item }) => {
                        const data = new Date(item.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                        });
                        return (
                            <TouchableOpacity
                                style={styles.card}
                                activeOpacity={0.85}
                                onPress={() => router.push({ pathname: '/nfae-preview', params: { id: item.id } })}
                            >
                                <View style={styles.cardIcone}>
                                    <Ionicons name="document-text" size={22} color={colors.tealDark} />
                                </View>
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardComprador} numberOfLines={1}>
                                        {item.comprador_nome || 'Comprador não informado'}
                                    </Text>
                                    <Text style={styles.cardDescricao} numberOfLines={1}>
                                        {item.descricao || '—'}
                                    </Text>
                                    <View style={styles.cardRodape}>
                                        <Text style={styles.cardData}>{data}</Text>
                                        <Text style={styles.cardValor}>R$ {item.valor}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.btnExcluir}
                                    onPress={() => excluir(item.id)}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Ionicons name="trash-outline" size={18} color="rgba(255,255,255,0.5)" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}

            <TouchableOpacity
                style={styles.btnNova}
                onPress={() => router.push('/nfae-form')}
            >
                <Ionicons name="add" size={22} color={colors.white} />
                <Text style={styles.btnNovaTexto}>Nova nota</Text>
            </TouchableOpacity>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    titulo: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.lg,
        color: colors.white,
    },
    subtitulo: {
        fontFamily: fonts.body,
        fontSize: sizes.bodySm,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    vazio: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        gap: 16,
    },
    vazioTexto: {
        fontFamily: fonts.body,
        fontSize: sizes.body,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 22,
    },
    lista: {
        paddingHorizontal: 16,
        paddingBottom: 100,
        gap: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: 12,
        gap: 12,
    },
    cardIcone: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: colors.creamLight,
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    cardInfo: { flex: 1 },
    cardComprador: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.body,
        color: colors.white,
    },
    cardDescricao: {
        fontFamily: fonts.body,
        fontSize: sizes.caption,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    cardRodape: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    cardData: {
        fontFamily: fonts.body,
        fontSize: sizes.micro,
        color: 'rgba(255,255,255,0.5)',
    },
    cardValor: {
        fontFamily: fonts.bodyBold,
        fontSize: sizes.bodySm,
        color: colors.goldLight,
    },
    btnExcluir: {
        padding: 4,
    },
    btnNova: {
        position: 'absolute',
        bottom: 32,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.tealMid,
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    btnNovaTexto: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.body,
        color: colors.white,
    },
});
