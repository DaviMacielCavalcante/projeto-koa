import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { ScreenContainer, GradientButton, TopBar } from '../design/components';
import { onboardingStyles as styles } from '../styles/onboardingStyles';
import { colors } from '../design/theme';
import { agricultoresDb } from '../src/db/index';

export default function Perfil() {
    const [nome, setNome] = useState('');

    useEffect(() => {
        async function carregarNome() {
            const row = await agricultoresDb?.getFirstAsync<{ name: string }>(
                'SELECT name FROM users ORDER BY created_at DESC LIMIT 1'
            );
            if (row?.name) setNome(row.name);
        }
        carregarNome();
    }, []);

    async function salvar() {
        const nomeTrimado = nome.trim();
        if (!nomeTrimado) return;
        await agricultoresDb?.runAsync(
            'UPDATE users SET name = ?, updated_at = ? WHERE id = (SELECT id FROM users ORDER BY created_at DESC LIMIT 1)',
            [nomeTrimado, new Date().toISOString()]
        ).catch(() => {});
        router.back();
    }

    const telefone = auth().currentUser?.phoneNumber ?? '—';

    return (
        <ScreenContainer variant="gold">
            <TopBar leftIcon="arrow-back" />
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

                <GradientButton
                    label="Salvar"
                    variant="gold"
                    onPress={salvar}
                    disabled={!nome.trim()}
                    style={[styles.botaoFull, { marginTop: 8 }]}
                />
                <View style={styles.botaoVoltarCard}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.botaoVoltarCardTexto}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenContainer>
    );
}
