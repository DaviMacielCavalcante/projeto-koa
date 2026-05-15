import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, sizes } from '../design/theme';
import { agricultoresDb } from '../src/db/index';

type Rascunho = {
    id: string;
    produtor_cnpj: string;
    produtor_endereco: string;
    comprador_nome: string;
    comprador_doc: string;
    descricao: string;
    valor: string;
    natureza: string;
    created_at: string;
};

function gerarNumeroNota(): string {
    const num = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `NFA-e ${num}`;
}

export default function NfaePreview() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [dados, setDados] = useState<Rascunho | null>(null);
    const [numeroNota] = useState(gerarNumeroNota());

    useEffect(() => {
        async function carregar() {
            const row = await agricultoresDb?.getFirstAsync<Rascunho>(
                'SELECT * FROM nfae_rascunhos WHERE id = ? LIMIT 1',
                [id]
            );
            setDados(row ?? null);
        }
        carregar();
    }, [id]);

    if (!dados) return null;

    const dataEmissao = new Date(dados.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });

    async function compartilhar() {
        try {
            await Share.share({
                message:
                    `${numeroNota} — SIMULAÇÃO\n` +
                    `Emissão: ${dataEmissao}\n\n` +
                    `PRODUTOR\nCNPJ: ${dados!.produtor_cnpj}\nEndereço: ${dados!.produtor_endereco}\n\n` +
                    `COMPRADOR\nNome: ${dados!.comprador_nome}\nCPF/CNPJ: ${dados!.comprador_doc}\n\n` +
                    `PRODUTO/SERVIÇO\n${dados!.descricao}\n\n` +
                    `VALOR TOTAL: R$ ${dados!.valor}\n` +
                    `NATUREZA: ${dados!.natureza}\n\n` +
                    `* Esta é uma simulação. Emita a nota oficial no sistema da SEFA-PA.`,
            });
        } catch {}
    }

    return (
        <View style={styles.tela}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
                    <Ionicons name="arrow-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitulo}>Nota Fiscal (simulação)</Text>
                <TouchableOpacity onPress={compartilhar} hitSlop={12}>
                    <Ionicons name="share-outline" size={24} color={colors.white} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Nota Fiscal */}
                <View style={styles.nota}>
                    {/* Cabeçalho da nota */}
                    <View style={styles.notaHeader}>
                        <View style={styles.notaHeaderEsq}>
                            <Text style={styles.notaTipo}>NOTA FISCAL AVULSA ELETRÔNICA</Text>
                            <Text style={styles.notaEstado}>Estado do Pará — SEFA-PA</Text>
                        </View>
                        <View style={styles.notaHeaderDir}>
                            <Text style={styles.notaNumero}>{numeroNota}</Text>
                            <Text style={styles.notaData}>{dataEmissao}</Text>
                        </View>
                    </View>

                    {/* Simulação watermark */}
                    <View style={styles.simulacaoWrap} pointerEvents="none">
                        <Text style={styles.simulacaoTexto}>SIMULAÇÃO</Text>
                    </View>

                    <View style={styles.divisor} />

                    {/* Produtor */}
                    <Secao titulo="DADOS DO PRODUTOR RURAL">
                        <Campo label="CNPJ" valor={dados.produtor_cnpj} />
                        <Campo label="Endereço" valor={dados.produtor_endereco} />
                    </Secao>

                    <View style={styles.divisor} />

                    {/* Comprador */}
                    <Secao titulo="DADOS DO DESTINATÁRIO">
                        <Campo label="Nome / Razão Social" valor={dados.comprador_nome} />
                        <Campo label="CPF / CNPJ" valor={dados.comprador_doc} />
                    </Secao>

                    <View style={styles.divisor} />

                    {/* Produto */}
                    <Secao titulo="DADOS DA OPERAÇÃO">
                        <Campo label="Natureza da Operação" valor={dados.natureza} />
                        <Campo label="Descrição dos Produtos / Serviços" valor={dados.descricao} />
                    </Secao>

                    <View style={styles.divisor} />

                    {/* Valor */}
                    <View style={styles.valorBox}>
                        <Text style={styles.valorLabel}>VALOR TOTAL DA NOTA</Text>
                        <Text style={styles.valorNumero}>R$ {dados.valor}</Text>
                    </View>

                    <View style={styles.divisor} />

                    {/* Código de barras mockado */}
                    <View style={styles.codigoWrap}>
                        <View style={styles.codigoBarras}>
                            {Array.from({ length: 40 }).map((_, i) => (
                                <View
                                    key={i}
                                    style={[styles.barra, { width: i % 3 === 0 ? 3 : 1, marginHorizontal: 1 }]}
                                />
                            ))}
                        </View>
                        <Text style={styles.codigoNumero}>
                            {dados.produtor_cnpj.replace(/\D/g, '').padEnd(44, '0').slice(0, 44)}
                        </Text>
                    </View>

                    {/* Aviso */}
                    <View style={styles.avisoBox}>
                        <Ionicons name="information-circle-outline" size={16} color={colors.inkMute} />
                        <Text style={styles.avisoTexto}>
                            Esta é uma simulação para organizar seus dados. Para emitir a nota fiscal oficial, acesse o sistema da SEFA-PA com estas informações.
                        </Text>
                    </View>
                </View>

                {/* Botões */}
                <TouchableOpacity style={styles.btnCompartilhar} onPress={compartilhar}>
                    <Ionicons name="share-outline" size={20} color={colors.white} />
                    <Text style={styles.btnCompartilharTexto}>Compartilhar dados</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnVoltar} onPress={() => router.replace('/documento/NFA-e')}>
                    <Text style={styles.btnVoltarTexto}>Voltar ao documento</Text>
                </TouchableOpacity>

            </ScrollView>
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
    simulacaoWrap: {
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        alignItems: 'center',
        opacity: 0.07,
        zIndex: 0,
    },
    simulacaoTexto: {
        fontFamily: fonts.displayBlack,
        fontSize: 52,
        color: colors.redDark,
        transform: [{ rotate: '-30deg' }],
        letterSpacing: 4,
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
    codigoNumero: {
        fontFamily: fonts.body,
        fontSize: 8,
        color: colors.inkMute,
        letterSpacing: 1,
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
    },
    btnCompartilharTexto: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.body,
        color: colors.white,
    },
    btnVoltar: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    btnVoltarTexto: {
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.body,
        color: 'rgba(255,255,255,0.7)',
    },
});
