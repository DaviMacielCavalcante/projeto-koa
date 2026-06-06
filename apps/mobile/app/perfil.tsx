import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getTelefoneLocal } from '../src/auth/currentUser';
import { ScreenContainer, GradientButton, TopBar } from '../design/components';
import { onboardingStyles as styles } from '../styles/onboardingStyles';
import { emissorStyles as e } from '../styles/emissorStyles';
import { colors } from '../design/theme';
import { agricultoresDb } from '../src/db/index';
import {
    obterEmissor,
    salvarEmissor,
    emissorCompleto,
    CAMPOS_TEXTO_EMISSOR,
    REGIMES_TRIBUTARIOS,
    type DadosEmissor,
} from '../src/db/emissor';

const EMISSOR_INICIAL: DadosEmissor = {
    cnpj_emitente: '',
    nome_emitente: '',
    logradouro_emitente: '',
    numero_emitente: '',
    bairro_emitente: '',
    municipio_emitente: '',
    uf_emitente: '',
    cep_emitente: '',
    inscricao_estadual_emitente: '',
    regime_tributario_emitente: '',
};

export default function Perfil() {
    const [nome, setNome] = useState('');
    const [emissor, setEmissor] = useState<DadosEmissor>(EMISSOR_INICIAL);

    useEffect(() => {
        async function carregar() {
            const row = await agricultoresDb?.getFirstAsync<{ name: string }>(
                'SELECT name FROM users ORDER BY created_at DESC LIMIT 1'
            );
            if (row?.name) setNome(row.name);
            setEmissor(await obterEmissor());
        }
        carregar();
    }, []);

    function setCampo(campo: keyof DadosEmissor, valor: string) {
        setEmissor((anterior) => ({ ...anterior, [campo]: valor }));
    }

    async function salvar() {
        const nomeTrimado = nome.trim();
        if (!nomeTrimado) return;
        await agricultoresDb
            ?.runAsync(
                'UPDATE users SET name = ?, updated_at = ? WHERE id = (SELECT id FROM users ORDER BY created_at DESC LIMIT 1)',
                [nomeTrimado, new Date().toISOString()]
            )
            .catch(() => {});
        await salvarEmissor(emissor);
        router.back();
    }

    const telefone = getTelefoneLocal() ?? '—';
    const cadastroCompleto = emissorCompleto(emissor);

    return (
        <ScreenContainer variant="gold">
            <TopBar leftIcon="arrow-back" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={styles.perfilEspacador} />
                <View style={styles.perfilCard}>
                    <View style={styles.perfilAvatar}>
                        <Ionicons name="person" size={60} color={colors.goldMid} />
                    </View>

                    <Text style={styles.perfilTitulo}>Meu perfil</Text>

                    <TextInput
                        style={styles.perfilInput}
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Seu nome"
                        placeholderTextColor={colors.greyLight}
                        autoCapitalize="words"
                    />

                    <View style={styles.perfilInfo}>
                        <View style={styles.perfilRow}>
                            <View style={styles.perfilRowIcone}>
                                <Ionicons name="phone-portrait" size={18} color={colors.white} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.perfilRowLabel}>Telefone</Text>
                                <Text style={styles.perfilRowValor}>{telefone}</Text>
                            </View>
                        </View>
                        <View style={[styles.perfilRow, { borderBottomWidth: 0 }]}>
                            <View style={styles.perfilRowIcone}>
                                <Ionicons name="leaf" size={18} color={colors.white} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.perfilRowLabel}>Município</Text>
                                <Text style={styles.perfilRowValor}>Jutaí — AM</Text>
                            </View>
                        </View>
                    </View>

                    {/* Dados exigidos pela emissão de NFA-e. Quando todos preenchidos, libera o
                        botão "Emitir" na tela de Notas (gate em app/(tabs)/notas.tsx). */}
                    <View style={e.secao}>
                        <View style={e.secaoHeader}>
                            <Text style={e.secaoTitulo}>Dados para emissão de nota fiscal</Text>
                            <View
                                style={[
                                    e.statusChip,
                                    cadastroCompleto ? e.statusChipOk : e.statusChipPendente,
                                ]}
                            >
                                <Ionicons
                                    name={cadastroCompleto ? 'checkmark-circle' : 'alert-circle'}
                                    size={13}
                                    color={cadastroCompleto ? colors.tealDark : colors.orangeDark}
                                />
                                <Text
                                    style={[
                                        e.statusChipTexto,
                                        { color: cadastroCompleto ? colors.tealDark : colors.orangeDark },
                                    ]}
                                >
                                    {cadastroCompleto ? 'Cadastro completo' : 'Cadastro incompleto'}
                                </Text>
                            </View>
                        </View>

                        {CAMPOS_TEXTO_EMISSOR.map((meta) => (
                            <View key={meta.campo} style={e.campo}>
                                <Text style={e.label}>{meta.label}</Text>
                                <TextInput
                                    style={styles.perfilInput}
                                    value={emissor[meta.campo]}
                                    onChangeText={(valor) => setCampo(meta.campo, valor)}
                                    placeholder={meta.placeholder}
                                    placeholderTextColor={colors.greyLight}
                                    keyboardType={meta.keyboardType ?? 'default'}
                                    autoCapitalize={meta.autoCapitalize ?? 'sentences'}
                                    maxLength={meta.maxLength}
                                />
                            </View>
                        ))}

                        <View style={e.campo}>
                            <Text style={e.label}>Regime tributário</Text>
                            <View style={e.regimeRow}>
                                {REGIMES_TRIBUTARIOS.map((regime) => {
                                    const ativo = emissor.regime_tributario_emitente === regime.valor;
                                    return (
                                        <TouchableOpacity
                                            key={regime.valor}
                                            style={[e.regimeChip, ativo && e.regimeChipAtivo]}
                                            activeOpacity={0.85}
                                            onPress={() =>
                                                setCampo('regime_tributario_emitente', regime.valor)
                                            }
                                        >
                                            <Text
                                                style={[
                                                    e.regimeChipTexto,
                                                    ativo && e.regimeChipTextoAtivo,
                                                ]}
                                            >
                                                {regime.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </View>

                    <GradientButton
                        label="Salvar"
                        variant="gold"
                        onPress={salvar}
                        disabled={!nome.trim()}
                        style={[styles.botaoFull, { marginTop: 16 }]}
                    />
                    <View style={styles.botaoVoltarCard}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.botaoVoltarCardTexto}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
