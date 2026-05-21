import { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, sizes } from '../design/theme';
import { obterNota, type NotaFiscal } from '../src/db/notasFiscais';

function formatarData(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

/** Quebra a chave de acesso de 44 dígitos em grupos de 4 para facilitar a leitura. */
function formatarChave(chave: string): string {
    return chave.match(/.{1,4}/g)?.join(' ') ?? chave;
}

export default function NfaePreview() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [nota, setNota] = useState<NotaFiscal | null>(null);
    const [carregando, setCarregando] = useState(true);

    useFocusEffect(
        useCallback(() => {
            async function carregar() {
                setNota(await obterNota(id));
                setCarregando(false);
            }
            carregar();
        }, [id])
    );

    async function compartilhar() {
        if (!nota || nota.status !== 'emitida') return;
        try {
            await Share.share({
                message:
                    `NOTA FISCAL AVULSA ELETRÔNICA — Nº ${nota.numero_nota}\n` +
                    `Estado do Pará — SEFA-PA\n` +
                    `Emissão: ${formatarData(nota.emitida_at)}\n\n` +
                    `PRODUTOR\nCNPJ: ${nota.produtor_cnpj}\nEndereço: ${nota.produtor_endereco}\n\n` +
                    `DESTINATÁRIO\nNome: ${nota.comprador_nome}\nCPF/CNPJ: ${nota.comprador_doc}\n\n` +
                    `OPERAÇÃO\nNatureza: ${nota.natureza}\nProduto/Serviço: ${nota.descricao}\n\n` +
                    `VALOR TOTAL: R$ ${nota.valor}\n\n` +
                    `Chave de acesso:\n${nota.chave_acesso}`,
            });
        } catch {}
    }

    const emitida = nota?.status === 'emitida';

    return (
        <View style={styles.tela}>
            {/* Header — sempre visível, garante a saída da tela */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
                    <Ionicons name="arrow-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitulo}>Nota Fiscal</Text>
                {emitida ? (
                    <TouchableOpacity onPress={compartilhar} hitSlop={12}>
                        <Ionicons name="share-outline" size={24} color={colors.white} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 24 }} />
                )}
            </View>

            {carregando ? (
                <ActivityIndicator color={colors.white} style={{ flex: 1 }} />
            ) : !nota ? (
                <View style={styles.naoEncontrada}>
                    <Ionicons name="document-outline" size={56} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.naoEncontradaTexto}>
                        Não encontramos esta nota. Ela pode ter sido removida.
                    </Text>
                    <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
                        <Text style={styles.btnVoltarTexto}>Voltar para minhas notas</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.nota}>
                        {/* Cabeçalho da nota */}
                        <View style={styles.notaHeader}>
                            <View style={styles.notaHeaderEsq}>
                                <Text style={styles.notaTipo}>NOTA FISCAL AVULSA ELETRÔNICA</Text>
                                <Text style={styles.notaEstado}>Estado do Pará — SEFA-PA</Text>
                            </View>
                            <View style={styles.notaHeaderDir}>
                                {emitida ? (
                                    <>
                                        <Text style={styles.notaNumero}>Nº {nota.numero_nota}</Text>
                                        <Text style={styles.notaData}>{formatarData(nota.emitida_at)}</Text>
                                    </>
                                ) : (
                                    <View style={styles.statusPill}>
                                        <Ionicons name="time" size={12} color={colors.white} />
                                        <Text style={styles.statusPillTexto}>AGUARDANDO</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Banner de nota pendente */}
                        {!emitida && (
                            <View style={styles.bannerPendente}>
                                <Ionicons name="cloud-offline-outline" size={20} color={colors.orangeDark} />
                                <Text style={styles.bannerPendenteTexto}>
                                    Esta nota foi registrada e será emitida automaticamente assim que você
                                    estiver conectado à internet.
                                </Text>
                            </View>
                        )}

                        <View style={styles.divisor} />

                        {/* Produtor */}
                        <Secao titulo="DADOS DO PRODUTOR RURAL">
                            <Campo label="CNPJ" valor={nota.produtor_cnpj} />
                            <Campo label="Endereço" valor={nota.produtor_endereco} />
                        </Secao>

                        <View style={styles.divisor} />

                        {/* Destinatário */}
                        <Secao titulo="DADOS DO DESTINATÁRIO">
                            <Campo label="Nome / Razão Social" valor={nota.comprador_nome} />
                            <Campo label="CPF / CNPJ" valor={nota.comprador_doc} />
                        </Secao>

                        <View style={styles.divisor} />

                        {/* Operação */}
                        <Secao titulo="DADOS DA OPERAÇÃO">
                            <Campo label="Natureza da Operação" valor={nota.natureza} />
                            <Campo label="Descrição dos Produtos / Serviços" valor={nota.descricao} />
                        </Secao>

                        <View style={styles.divisor} />

                        {/* Valor */}
                        <View style={styles.valorBox}>
                            <Text style={styles.valorLabel}>VALOR TOTAL DA NOTA</Text>
                            <Text style={styles.valorNumero}>R$ {nota.valor}</Text>
                        </View>

                        {/* Chave de acesso — só quando emitida */}
                        {emitida && nota.chave_acesso && (
                            <>
                                <View style={styles.divisor} />
                                <View style={styles.codigoWrap}>
                                    <View style={styles.codigoBarras}>
                                        {Array.from({ length: 40 }).map((_, i) => (
                                            <View
                                                key={i}
                                                style={[styles.barra, { width: i % 3 === 0 ? 3 : 1, marginHorizontal: 1 }]}
                                            />
                                        ))}
                                    </View>
                                    <Text style={styles.codigoLabel}>CHAVE DE ACESSO</Text>
                                    <Text style={styles.codigoNumero}>{formatarChave(nota.chave_acesso)}</Text>
                                </View>
                            </>
                        )}

                        {/* Aviso */}
                        <View style={styles.avisoBox}>
                            <Ionicons name="information-circle-outline" size={16} color={colors.inkMute} />
                            <Text style={styles.avisoTexto}>
                                {emitida
                                    ? 'Guarde a chave de acesso — é ela que identifica a sua nota fiscal.'
                                    : 'Você não precisa fazer nada: a nota será emitida sozinha quando houver internet.'}
                            </Text>
                        </View>
                    </View>

                    {/* Botões */}
                    {emitida && (
                        <TouchableOpacity style={styles.btnCompartilhar} onPress={compartilhar}>
                            <Ionicons name="share-outline" size={20} color={colors.white} />
                            <Text style={styles.btnCompartilharTexto}>Compartilhar nota</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
                        <Text style={styles.btnVoltarTexto}>Voltar para minhas notas</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </View>
    );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
    return (
        <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>{titulo}</Text>
            {children}
        </View>
    );
}

function Campo({ label, valor }: { label: string; valor: string }) {
    return (
        <View style={styles.campo}>
            <Text style={styles.campoLabel}>{label}</Text>
            <Text style={styles.campoValor}>{valor || '—'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    tela: { flex: 1, backgroundColor: colors.tealDark },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 52,
        paddingBottom: 16,
    },
    headerTitulo: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.body,
        color: colors.white,
    },
    naoEncontrada: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        gap: 16,
    },
    naoEncontradaTexto: {
        fontFamily: fonts.body,
        fontSize: sizes.body,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 22,
    },
    scroll: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        gap: 12,
    },
    nota: {
        backgroundColor: colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    notaHeader: {
        backgroundColor: colors.tealDark,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        gap: 12,
    },
    notaHeaderEsq: { flex: 1 },
    notaTipo: {
        fontFamily: fonts.bodyBold,
        fontSize: sizes.caption,
        color: colors.white,
        letterSpacing: 0.5,
    },
    notaEstado: {
        fontFamily: fonts.body,
        fontSize: sizes.micro,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 2,
    },
    notaHeaderDir: { alignItems: 'flex-end' },
    notaNumero: {
        fontFamily: fonts.bodyBold,
        fontSize: sizes.bodySm,
        color: colors.goldLight,
    },
    notaData: {
        fontFamily: fonts.body,
        fontSize: sizes.micro,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 2,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.orangeMid,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    statusPillTexto: {
        fontFamily: fonts.bodyBold,
        fontSize: sizes.tiny,
        color: colors.white,
        letterSpacing: 0.5,
    },
    bannerPendente: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
        backgroundColor: '#FBEDE4',
        margin: 14,
        marginBottom: 0,
        padding: 12,
        borderRadius: 12,
    },
    bannerPendenteTexto: {
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.caption,
        color: colors.orangeDark,
        flex: 1,
        lineHeight: 17,
    },
    divisor: { height: 1, backgroundColor: colors.creamDeep, marginHorizontal: 14 },
    secao: { padding: 14, gap: 8 },
    secaoTitulo: {
        fontFamily: fonts.bodyBold,
        fontSize: sizes.micro,
        color: colors.inkMute,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    campo: { gap: 2 },
    campoLabel: {
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.micro,
        color: colors.inkMute,
    },
    campoValor: {
        fontFamily: fonts.body,
        fontSize: sizes.bodySm,
        color: colors.ink,
        lineHeight: 20,
    },
    valorBox: {
        padding: 14,
        alignItems: 'center',
        gap: 4,
    },
    valorLabel: {
        fontFamily: fonts.bodyBold,
        fontSize: sizes.micro,
        color: colors.inkMute,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    valorNumero: {
        fontFamily: fonts.displayBlack,
        fontSize: sizes.xl,
        color: colors.tealDark,
    },
    codigoWrap: {
        padding: 14,
        alignItems: 'center',
        gap: 6,
    },
    codigoBarras: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
    },
    barra: {
        height: '100%',
        backgroundColor: colors.ink,
    },
    codigoLabel: {
        fontFamily: fonts.bodyBold,
        fontSize: sizes.micro,
        color: colors.inkMute,
        letterSpacing: 0.8,
        marginTop: 2,
    },
    codigoNumero: {
        fontFamily: fonts.mono,
        fontSize: 10,
        color: colors.inkMute,
        letterSpacing: 1,
        textAlign: 'center',
    },
    avisoBox: {
        flexDirection: 'row',
        gap: 8,
        margin: 14,
        marginTop: 4,
        padding: 10,
        backgroundColor: colors.creamDeep,
        borderRadius: 10,
        alignItems: 'flex-start',
    },
    avisoTexto: {
        fontFamily: fonts.body,
        fontSize: sizes.micro,
        color: colors.inkMute,
        flex: 1,
        lineHeight: 16,
    },
    btnCompartilhar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.tealMid,
        borderRadius: 30,
        paddingVertical: 14,
        minHeight: 56,
    },
    btnCompartilharTexto: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.body,
        color: colors.white,
    },
    btnVoltar: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        minHeight: 56,
    },
    btnVoltarTexto: {
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.body,
        color: 'rgba(255,255,255,0.7)',
    },
});
