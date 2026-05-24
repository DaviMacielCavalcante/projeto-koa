import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GradientButton, TopBar } from '../design/components';
import { colors } from '../design/theme';
import { certificadoStyles as styles } from '../styles/certificadoStyles';
import { salvarCertificado } from '../src/db/certificado';

/** Nome de arquivo usado para representar a escolha do .pfx (upload simulado). */
const ARQUIVO_SIMULADO = 'certificado_a1.pfx';

type InfoItem = { icone: keyof typeof Ionicons.glyphMap; texto: string };

const EXPLICACAO: InfoItem[] = [
    {
        icone: 'shield-checkmark',
        texto: 'É a sua assinatura eletrônica oficial. Garante que a nota fiscal foi emitida de verdade por você.',
    },
    {
        icone: 'lock-closed',
        texto: 'Vem em um arquivo terminado em .pfx, protegido por senha, emitido por uma Autoridade Certificadora.',
    },
    {
        icone: 'calendar',
        texto: 'Você só precisa enviar uma vez. O certificado vale por 1 ano.',
    },
];

export default function Certificado() {
    const [arquivo, setArquivo] = useState<string | null>(null);
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const podeSalvar = !!arquivo && senha.trim().length > 0 && !salvando;

    function selecionarArquivo() {
        // Upload simulado: representa a escolha de um .pfx no celular.
        setArquivo(ARQUIVO_SIMULADO);
    }

    async function salvar() {
        if (!podeSalvar || !arquivo) return;
        setSalvando(true);
        try {
            await salvarCertificado({ arquivo_nome: arquivo, senha });
            router.back();
        } catch {
            Alert.alert('Erro', 'Não foi possível salvar o certificado. Tente de novo.');
            setSalvando(false);
        }
    }

    return (
        <ScreenContainer variant="teal">
            <TopBar leftIcon="arrow-back" />

            <ScrollView
                contentContainerStyle={styles.conteudo}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.titulo}>Certificado Digital</Text>
                <Text style={styles.subtitulo}>
                    Envie seu certificado A1 para poder emitir notas fiscais pelo aplicativo.
                </Text>

                <View style={styles.infoCard}>
                    {EXPLICACAO.map((item) => (
                        <View key={item.icone} style={styles.infoLinha}>
                            <View style={styles.infoIcone}>
                                <Ionicons name={item.icone} size={18} color={colors.goldLight} />
                            </View>
                            <Text style={styles.infoTexto}>{item.texto}</Text>
                        </View>
                    ))}
                </View>

                {/* Seletor do arquivo */}
                <View style={styles.campo}>
                    <Text style={styles.label}>Arquivo do certificado</Text>
                    <TouchableOpacity
                        style={[styles.seletor, arquivo && styles.seletorSelecionado]}
                        onPress={selecionarArquivo}
                        activeOpacity={0.85}
                    >
                        <View style={styles.seletorIcone}>
                            <Ionicons
                                name={arquivo ? 'document-text' : 'cloud-upload-outline'}
                                size={22}
                                color={colors.white}
                            />
                        </View>
                        <View style={styles.seletorInfo}>
                            <Text style={styles.seletorTitulo}>
                                {arquivo ?? 'Selecionar certificado'}
                            </Text>
                            <Text style={styles.seletorSub}>
                                {arquivo ? 'Toque para trocar o arquivo' : 'Arquivo .pfx ou .p12'}
                            </Text>
                        </View>
                        {arquivo && (
                            <Ionicons name="checkmark-circle" size={22} color={colors.goldLight} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Senha do certificado */}
                <View style={styles.campo}>
                    <Text style={styles.label}>Senha do certificado</Text>
                    <View style={styles.senhaWrap}>
                        <TextInput
                            style={styles.senhaInput}
                            value={senha}
                            onChangeText={setSenha}
                            placeholder="Senha do arquivo .pfx"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            secureTextEntry={!mostrarSenha}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            style={styles.senhaToggle}
                            onPress={() => setMostrarSenha((v) => !v)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons
                                name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="rgba(255,255,255,0.7)"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.rodape}>
                <GradientButton
                    label={salvando ? 'Salvando...' : 'Salvar certificado'}
                    variant="cream"
                    onPress={salvar}
                    disabled={!podeSalvar}
                    style={{ width: '100%' }}
                />
            </View>
        </ScreenContainer>
    );
}
