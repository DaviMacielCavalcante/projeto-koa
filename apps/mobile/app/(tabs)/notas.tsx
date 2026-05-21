import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../design/components';
import { colors } from '../../design/theme';
import { listarNotas, excluirNota, type NotaFiscal } from '../../src/db/notasFiscais';
import { notasStyles as styles } from '../../styles/notasStyles';

function formatarData(iso: string): string {
    return new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function resumo(total: number, pendentes: number): string {
    if (total === 0) return 'Registre as notas fiscais das suas vendas';
    if (pendentes > 0) {
        return `${total} ${total === 1 ? 'nota' : 'notas'} · ${pendentes} aguardando envio`;
    }
    return `${total} ${total === 1 ? 'nota emitida' : 'notas emitidas'}`;
}

export default function Notas() {
    const [notas, setNotas] = useState<NotaFiscal[]>([]);
    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            async function carregar() {
                setNotas(await listarNotas());
            }
            carregar();
        }, [])
    );

    function confirmarExcluir(nota: NotaFiscal) {
        Alert.alert('Excluir nota', 'Tem certeza que quer apagar esta nota da lista?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    await excluirNota(nota.id);
                    setNotas((prev) => prev.filter((n) => n.id !== nota.id));
                },
            },
        ]);
    }

    const pendentes = notas.filter((n) => n.status === 'pendente').length;

    return (
        <ScreenContainer variant="cream">
            <View style={styles.header}>
                <Text style={styles.titulo}>Notas Fiscais</Text>
                <Text style={styles.subtitulo}>{resumo(notas.length, pendentes)}</Text>
            </View>

            {notas.length === 0 ? (
                <View style={styles.vazio}>
                    <View style={styles.vazioIcone}>
                        <Ionicons name="receipt-outline" size={48} color={colors.tealMid} />
                    </View>
                    <Text style={styles.vazioTitulo}>Nenhuma nota ainda</Text>
                    <Text style={styles.vazioTexto}>
                        Emita a nota fiscal das suas vendas para manter tudo registrado e protegido.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={notas}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={[styles.lista, { paddingBottom: insets.bottom + 160 }]}
                    renderItem={({ item }) => (
                        <CardNota
                            nota={item}
                            onAbrir={() => router.push({ pathname: '/nfae-preview', params: { id: item.id } })}
                            onExcluir={() => confirmarExcluir(item)}
                        />
                    )}
                />
            )}

            <TouchableOpacity
                style={[styles.botaoEmitir, { bottom: insets.bottom + 84 }]}
                activeOpacity={0.85}
                onPress={() => router.push('/nfae-form')}
            >
                <Ionicons name="add-circle" size={22} color={colors.white} />
                <Text style={styles.botaoEmitirTexto}>Emitir nova nota</Text>
            </TouchableOpacity>
        </ScreenContainer>
    );
}

function CardNota({
    nota,
    onAbrir,
    onExcluir,
}: {
    nota: NotaFiscal;
    onAbrir: () => void;
    onExcluir: () => void;
}) {
    const emitida = nota.status === 'emitida';
    const data = formatarData(emitida && nota.emitida_at ? nota.emitida_at : nota.created_at);
    const corStatus = emitida ? colors.tealDark : colors.orangeDark;

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onAbrir}>
            <View style={styles.cardIcone}>
                <Ionicons name="receipt" size={24} color={colors.tealDark} />
            </View>

            <View style={styles.cardInfo}>
                <View style={styles.cardLinhaTopo}>
                    <Text style={styles.cardComprador} numberOfLines={1}>
                        {nota.comprador_nome || 'Comprador não informado'}
                    </Text>
                    <View style={[styles.badge, emitida ? styles.badgeEmitida : styles.badgePendente]}>
                        <Ionicons
                            name={emitida ? 'checkmark-circle' : 'time'}
                            size={12}
                            color={corStatus}
                        />
                        <Text style={[styles.badgeTexto, { color: corStatus }]}>
                            {emitida ? 'Emitida' : 'Aguardando'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.cardDescricao} numberOfLines={1}>
                    {nota.descricao || '—'}
                </Text>

                <View style={styles.cardRodape}>
                    <Text style={styles.cardData}>{data}</Text>
                    <Text style={styles.cardValor}>R$ {nota.valor}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.btnExcluir}
                onPress={onExcluir}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Ionicons name="trash-outline" size={18} color={colors.greyLight} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}
