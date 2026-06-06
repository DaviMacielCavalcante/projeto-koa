import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GradientButton, TopBar } from '../design/components';
import { colors, fonts, sizes } from '../design/theme';
import { criarNotaPendente } from '../src/db/notasFiscais';
import { processarFilaEmissao } from '../src/services/emissaoNfae';

type Etapa = 'produtor' | 'comprador' | 'operacao' | 'resumo';

const ETAPAS: Etapa[] = ['produtor', 'comprador', 'operacao', 'resumo'];

const TITULOS: Record<Etapa, string> = {
    produtor: 'Dados do Produtor',
    comprador: 'Dados do Comprador',
    operacao: 'Produto e Valor',
    resumo: 'Resumo da Nota',
};

export default function NfaeForm() {
    const [etapa, setEtapa] = useState<Etapa>('produtor');
    const [emitindo, setEmitindo] = useState(false);

    const [produtorCnpj, setProdutorCnpj] = useState('');
    const [produtorEndereco, setProdutorEndereco] = useState('');
    const [compradorNome, setCompradorNome] = useState('');
    const [compradorDoc, setCompradorDoc] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [natureza, setNatureza] = useState('');

    const etapaIndex = ETAPAS.indexOf(etapa);

    function proximo() {
        if (etapa === 'produtor') {
            if (!produtorCnpj.trim() || !produtorEndereco.trim()) {
                Alert.alert('Atenção', 'Preencha todos os campos do produtor.');
                return;
            }
            setEtapa('comprador');
        } else if (etapa === 'comprador') {
            if (!compradorNome.trim() || !compradorDoc.trim()) {
                Alert.alert('Atenção', 'Preencha todos os campos do comprador.');
                return;
            }
            setEtapa('operacao');
        } else if (etapa === 'operacao') {
            if (!descricao.trim() || !valor.trim() || !natureza.trim()) {
                Alert.alert('Atenção', 'Preencha todos os campos da operação.');
                return;
            }
            setEtapa('resumo');
        }
    }

    function voltar() {
        if (etapa === 'comprador') setEtapa('produtor');
        else if (etapa === 'operacao') setEtapa('comprador');
        else if (etapa === 'resumo') setEtapa('operacao');
        else router.back();
    }

    function emitir() {
        Alert.alert(
            'Emitir nota fiscal',
            'Confira bem os dados. Depois de emitida, a nota não pode ser alterada.',
            [
                { text: 'Revisar', style: 'cancel' },
                { text: 'Emitir', onPress: confirmarEmissao },
            ]
        );
    }

    async function confirmarEmissao() {
        setEmitindo(true);
        try {
            const id = await criarNotaPendente({
                produtor_cnpj: produtorCnpj,
                produtor_endereco: produtorEndereco,
                comprador_nome: compradorNome,
                comprador_doc: compradorDoc,
                descricao,
                valor,
                natureza,
            });
            // Se houver internet, a nota já é emitida aqui; sem internet,
            // ela fica pendente e é emitida sozinha quando a conexão voltar.
            await processarFilaEmissao();
            router.replace({ pathname: '/nfae-preview', params: { id } });
        } catch {
            Alert.alert('Erro', 'Não foi possível registrar a nota. Tente de novo.');
            setEmitindo(false);
        }
    }

    return (
        <ScreenContainer variant="teal">
            <TopBar leftIcon="arrow-back" onLeftPress={voltar} />

            {/* Barra de progresso */}
            <View style={styles.progressoWrap}>
                {ETAPAS.filter(e => e !== 'resumo').map((e, i) => (
                    <View
                        key={e}
                        style={[styles.progressoPonto, i <= etapaIndex - (etapa === 'resumo' ? 0 : 0) && styles.progressoPontoAtivo,
                            etapa === e && styles.progressoPontoAtual]}
                    />
                ))}
            </View>

            <Text style={styles.etapaTitulo}>{TITULOS[etapa]}</Text>

            <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {etapa === 'produtor' && (
                    <>
                        <Campo
                            label="CNPJ do produtor rural"
                            valor={produtorCnpj}
                            onChange={setProdutorCnpj}
                            placeholder="00.000.000/0000-00"
                            keyboardType="numeric"
                        />
                        <Campo
                            label="Endereço completo"
                            valor={produtorEndereco}
                            onChange={setProdutorEndereco}
                            placeholder="Rua, número, município, estado"
                            multiline
                        />
                    </>
                )}

                {etapa === 'comprador' && (
                    <>
                        <Campo
                            label="Nome ou razão social do comprador"
                            valor={compradorNome}
                            onChange={setCompradorNome}
                            placeholder="Nome completo ou empresa"
                        />
                        <Campo
                            label="CPF ou CNPJ do comprador"
                            valor={compradorDoc}
                            onChange={setCompradorDoc}
                            placeholder="000.000.000-00 ou 00.000.000/0000-00"
                            keyboardType="numeric"
                        />
                    </>
                )}

                {etapa === 'operacao' && (
                    <>
                        <Campo
                            label="Descrição dos produtos ou serviços"
                            valor={descricao}
                            onChange={setDescricao}
                            placeholder="Ex: 100kg de açaí, 50 litros de leite..."
                            multiline
                        />
                        <Campo
                            label="Valor total da operação (R$)"
                            valor={valor}
                            onChange={setValor}
                            placeholder="0,00"
                            keyboardType="decimal-pad"
                        />
                        <Campo
                            label="Natureza da operação"
                            valor={natureza}
                            onChange={setNatureza}
                            placeholder="Ex: Venda de produção rural, Prestação de serviço..."
                        />
                    </>
                )}

                {etapa === 'resumo' && (
                    <View style={styles.resumoWrap}>
                        <ResumoSecao titulo="Produtor Rural">
                            <ResumoLinha label="CNPJ" valor={produtorCnpj} />
                            <ResumoLinha label="Endereço" valor={produtorEndereco} />
                        </ResumoSecao>
                        <ResumoSecao titulo="Comprador">
                            <ResumoLinha label="Nome" valor={compradorNome} />
                            <ResumoLinha label="CPF/CNPJ" valor={compradorDoc} />
                        </ResumoSecao>
                        <ResumoSecao titulo="Operação">
                            <ResumoLinha label="Produto/Serviço" valor={descricao} />
                            <ResumoLinha label="Valor" valor={`R$ ${valor}`} />
                            <ResumoLinha label="Natureza" valor={natureza} />
                        </ResumoSecao>

                        <View style={styles.avisoResumo}>
                            <Ionicons name="information-circle" size={18} color={colors.goldLight} />
                            <Text style={styles.avisoResumoTexto}>
                                Confira tudo com atenção. Ao tocar em "Emitir nota", a nota é registrada e não poderá mais ser alterada.
                            </Text>
                        </View>
                    </View>
                )}

            </ScrollView>

            <View style={styles.rodape}>
                {etapa !== 'resumo' ? (
                    <GradientButton
                        label="Próximo"
                        variant="cream"
                        onPress={proximo}
                        style={{ width: '100%' }}
                    />
                ) : (
                    <GradientButton
                        label={emitindo ? 'Emitindo...' : 'Emitir nota'}
                        variant="cream"
                        onPress={emitir}
                        disabled={emitindo}
                        style={{ width: '100%' }}
                    />
                )}
            </View>
        </ScreenContainer>
    );
}

function Campo({ label, valor, onChange, placeholder, multiline, keyboardType }: {
    label: string;
    valor: string;
    onChange: (v: string) => void;
    placeholder?: string;
    multiline?: boolean;
    keyboardType?: 'numeric' | 'decimal-pad' | 'default';
}) {
    return (
        <View style={styles.campo}>
            <Text style={styles.campoLabel}>{label}</Text>
            <TextInput
                style={[styles.campoInput, multiline && { height: 80, textAlignVertical: 'top' }]}
                value={valor}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="rgba(255,255,255,0.4)"
                multiline={multiline}
                keyboardType={keyboardType ?? 'default'}
                autoCapitalize="sentences"
            />
        </View>
    );
}

function ResumoSecao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
    return (
        <View style={styles.resumoSecao}>
            <Text style={styles.resumoSecaoTitulo}>{titulo}</Text>
            {children}
        </View>
    );
}

function ResumoLinha({ label, valor }: { label: string; valor: string }) {
    return (
        <View style={styles.resumoLinha}>
            <Text style={styles.resumoLinhaLabel}>{label}</Text>
            <Text style={styles.resumoLinhaValor}>{valor || '—'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    progressoWrap: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        paddingVertical: 8,
    },
    progressoPonto: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    progressoPontoAtivo: {
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    progressoPontoAtual: {
        width: 24,
        backgroundColor: colors.white,
    },
    etapaTitulo: {
        fontFamily: fonts.monoSemi,
        fontSize: sizes.lg,
        color: colors.white,
        textAlign: 'center',
        paddingBottom: 8,
    },
    conteudo: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        gap: 16,
    },
    campo: { gap: 6 },
    campoLabel: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.bodySm,
        color: 'rgba(255,255,255,0.9)',
    },
    campoInput: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.body,
        color: colors.white,
    },
    rodape: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 8,
    },
    resumoWrap: { gap: 12 },
    resumoSecao: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: 14,
        gap: 8,
    },
    resumoSecaoTitulo: {
        fontFamily: fonts.bodySemi,
        fontSize: sizes.bodySm,
        color: colors.goldLight,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    resumoLinha: {
        flexDirection: 'row',
        gap: 8,
    },
    resumoLinhaLabel: {
        fontFamily: fonts.bodyMedium,
        fontSize: sizes.caption,
        color: 'rgba(255,255,255,0.65)',
        width: 90,
    },
    resumoLinhaValor: {
        fontFamily: fonts.body,
        fontSize: sizes.caption,
        color: colors.white,
        flex: 1,
        lineHeight: 18,
    },
    avisoResumo: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 12,
    },
    avisoResumoTexto: {
        fontFamily: fonts.body,
        fontSize: sizes.caption,
        color: 'rgba(255,255,255,0.8)',
        flex: 1,
        lineHeight: 18,
    },
});
