import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../design/components';
import { colors } from '../../design/theme';
import { listarNotas, excluirNota, type NotaFiscal } from '../../src/db/notasFiscais';
import { obterCertificado, type Certificado } from '../../src/db/certificado';
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
    const [certificado, setCertificado] = useState<Certificado | null>(null);
    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            async function carregar() {
                const [lista, cert] = await Promise.all([listarNotas(), obterCertificado()]);
                setNotas(lista);
                setCertificado(cert);
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

            <CardCertificado certificado={certificado} />

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
                    contentContainerStyle={[
                        styles.lista,
                        { paddingBottom: insets.bottom + (certificado ? 160 : 196) },
                    ]}
                    renderItem={({ item }) => (
                        <CardNota
                            nota={item}
                            onAbrir={() => router.push({ pathname: '/nfae-preview', params: { id: item.id } })}
                            onExcluir={() => confirmarExcluir(item)}
                        />
                    )}
                />
            )}

            <View style={[styles.rodapeEmitir, { bottom: insets.bottom + 84 }]}>
                {!certificado && (
                    <View style={styles.dicaCertificado}>
                        <Ionicons name="alert-circle" size={14} color={colors.orangeDark} />
                        <Text style={styles.dicaCertificadoTexto}>
                            Envie seu certificado primeiro
                        </Text>
                    </View>
                )}
                <TouchableOpacity
                    style={[styles.botaoEmitir, !certificado && styles.botaoEmitirDesabilitado]}
                    activeOpacity={0.85}
                    disabled={!certificado}
                    onPress={() => router.push('/nfae-form')}
                >
                    <Ionicons name="add-circle" size={22} color={colors.white} />
                    <Text style={styles.botaoEmitirTexto}>Emitir nova nota</Text>
                </TouchableOpacity>
            </View>
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

function CardCertificado({ certificado }: { certificado: Certificado | null }) {
    if (!certificado) {
        return (
            <View style={[styles.certCard, styles.certCardPendente]}>
                <View style={styles.certTopo}>
                    <View style={[styles.certIcone, styles.certIconePendente]}>
                        <Ionicons name="shield-outline" size={22} color={colors.orangeDark} />
                    </View>
                    <View style={styles.certInfo}>
                        <Text style={[styles.certTitulo, { color: colors.orangeDark }]}>
                            Certificado pendente
                        </Text>
                        <Text style={styles.certTexto}>
                            Envie seu Certificado Digital A1 para poder emitir notas fiscais.
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.certBotao}
                    activeOpacity={0.85}
                    onPress={() => router.push('/certificado')}
                >
                    <Ionicons name="cloud-upload-outline" size={18} color={colors.white} />
                    <Text style={styles.certBotaoTexto}>Enviar certificado</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.certCard, styles.certCardAtivo]}>
            <View style={styles.certTopo}>
                <View style={[styles.certIcone, styles.certIconeAtivo]}>
                    <Ionicons name="shield-checkmark" size={22} color={colors.tealDark} />
                </View>
                <View style={styles.certInfo}>
                    <Text style={[styles.certTitulo, { color: colors.tealDark }]}>
                        Certificado ativo
                    </Text>
                    <Text style={styles.certTexto} numberOfLines={1}>
                        {certificado.arquivo_nome}
                    </Text>
                    <Text style={styles.certValidade}>
                        Válido até {formatarData(certificado.validade)}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.certTrocar}
                    onPress={() => router.push('/certificado')}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Text style={styles.certTrocarTexto}>Trocar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
