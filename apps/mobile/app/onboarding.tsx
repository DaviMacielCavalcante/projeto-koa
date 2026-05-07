import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { onboardingStyles as styles, onboardingIlStyles as il } from '../styles/onboardingStyles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import auth from '@react-native-firebase/auth';
import { ScreenContainer, GradientButton, TopBar, AudioCircle } from '../design/components';
import { colors } from '../design/theme';
import { agricultoresDb } from '../src/db/index';
import { usePracticeMode } from '../src/hooks/usePracticeMode';

// ─── ILUSTRAÇÕES ──────────────────────────────────────────────────────────────

function IlustracaoBemVindo() {
    return (
        <View style={il.bemVindoWrap}>
            <View style={il.bemVindoCirculoGrande} />
            <View style={il.bemVindoCirculoPequeno} />
            <View style={il.bemVindoSol}>
                <Ionicons name="sunny" size={28} color={colors.goldLight} />
            </View>
            <AudioCircle icon="volume-high" iconColor={colors.tealDark} size={100} />
            <View style={il.bemVindoFolha}>
                <Ionicons name="leaf" size={22} color={colors.tealLight} />
            </View>
        </View>
    );
}

function IlustracaoTour({ index }: { index: number }) {
    if (index === 0) {
        // Cena: roça — sol, folha, casa
        return (
            <View style={il.cena}>
                <View style={[il.cenaCirculo, { backgroundColor: colors.tealDark }]}>
                    <View style={il.sol}>
                        <Ionicons name="sunny" size={32} color={colors.goldLight} />
                    </View>
                    <Ionicons name="leaf" size={72} color="rgba(255,255,255,0.95)" />
                    <View style={il.casinha}>
                        <Ionicons name="home" size={24} color="rgba(255,255,255,0.7)" />
                    </View>
                    <View style={il.colina} />
                </View>
            </View>
        );
    }

    if (index === 1) {
        // Cena: 5 círculos de documento
        const docs = [
            { label: 'CAF', cor: colors.tealDark },
            { label: 'CAR', cor: colors.goldDark },
            { label: 'CCIR', cor: colors.orangeMid },
            { label: 'ITR', cor: colors.redMid },
            { label: 'NFA-e', cor: colors.tealMid },
        ];
        return (
            <View style={il.cena}>
                <View style={il.docsGrid}>
                    <View style={il.docsLinha1}>
                        {docs.slice(0, 3).map((d) => (
                            <View key={d.label} style={[il.docCirculo, { backgroundColor: d.cor }]}>
                                <Text style={il.docLabel}>{d.label}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={il.docsLinha2}>
                        {docs.slice(3).map((d) => (
                            <View key={d.label} style={[il.docCirculo, { backgroundColor: d.cor }]}>
                                <Text style={il.docLabel}>{d.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        );
    }

    if (index === 2) {
        // Cena: câmera fotografando documento
        return (
            <View style={il.cena}>
                <View style={il.telefone}>
                    <View style={il.telefoneNotch} />
                    <View style={il.telaCamera}>
                        <View style={[il.cantoGuia, { top: 8, left: 8, borderTopWidth: 2, borderLeftWidth: 2 }]} />
                        <View style={[il.cantoGuia, { top: 8, right: 8, borderTopWidth: 2, borderRightWidth: 2 }]} />
                        <View style={[il.cantoGuia, { bottom: 20, left: 8, borderBottomWidth: 2, borderLeftWidth: 2 }]} />
                        <View style={[il.cantoGuia, { bottom: 20, right: 8, borderBottomWidth: 2, borderRightWidth: 2 }]} />
                        <View style={il.docMock}>
                            {[80, 100, 60, 90].map((w, i) => (
                                <View key={i} style={[il.docLinha, { width: `${w}%` }]} />
                            ))}
                        </View>
                    </View>
                    <View style={il.shutterArea}>
                        <View style={il.shutterBtn} />
                    </View>
                </View>
            </View>
        );
    }

    // index === 3: Cena: notificação no celular
    return (
        <View style={il.cena}>
            <View style={il.notifTelefone}>
                <View style={il.notifTela}>
                    <View style={il.notifCard}>
                        <View style={il.notifIconeWrap}>
                            <Ionicons name="notifications" size={20} color={colors.white} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={il.notifTitulo}>Facilitador Jutaí</Text>
                            <Text style={il.notifTexto}>Seu CAF vence em 30 dias</Text>
                        </View>
                    </View>
                    <View style={il.calCard}>
                        <Text style={il.calNum}>30</Text>
                        <Text style={il.calLabel}>dias</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}


type Etapa = 'boas_vindas' | 'lgpd' | 'perfil' | 'tour' | 'pratica';

const TOUR_SLIDES = [
    { icon: 'leaf' as const,          titulo: 'Pra começar',   corpo: 'Esse app é teu auxiliar pros documentos da roça. Tudo num lugar só.' },
    { icon: 'document-text' as const, titulo: 'Os 5 papéis',   corpo: 'Aqui tu cuida de tudo: CAF, CAR, CCIR, ITR e NFA-e.' },
    { icon: 'camera' as const,        titulo: 'Tira foto',     corpo: 'Tu fotografa o documento e a gente guarda pra ti com segurança.' },
    { icon: 'notifications' as const, titulo: 'A gente avisa', corpo: 'Quando faltar 30 dias pra vencer, tu é avisado pelo celular.' },
];

async function salvarProgresso(etapa: Etapa, nome: string) {
    await SecureStore.setItemAsync('onboarding_progress', JSON.stringify({ etapa, nome }));
}

async function concluirOnboarding(nome: string, lgpdConsentido: boolean) {
    const user = auth().currentUser;
    if (user) {
        const agora = new Date().toISOString();
        const existente = await agricultoresDb?.getFirstAsync<{ id: string }>(
            'SELECT id FROM users WHERE id = ?', [user.uid]
        );
        if (!existente) {
            await agricultoresDb?.runAsync(
                `INSERT INTO users (id, name, phone, consentimento_lgpd, onboarding_concluido, created_at, updated_at)
                 VALUES (?, ?, ?, ?, 1, ?, ?)`,
                [user.uid, nome || 'Agricultor', user.phoneNumber ?? '', lgpdConsentido ? 1 : 0, agora, agora]
            );
        } else {
            await agricultoresDb?.runAsync(
                `UPDATE users SET name = ?, consentimento_lgpd = ?, onboarding_concluido = 1, updated_at = ? WHERE id = ?`,
                [nome || 'Agricultor', lgpdConsentido ? 1 : 0, agora, user.uid]
            );
        }
    }
    await SecureStore.setItemAsync('onboarding_done', '1');
    await SecureStore.deleteItemAsync('onboarding_progress');
}

export default function Onboarding() {
    const { enterPracticeMode } = usePracticeMode();
    const [etapa, setEtapa] = useState<Etapa>('boas_vindas');
    const [nome, setNome] = useState('');
    const [lgpdConsentido, setLgpdConsentido] = useState(false);
    const [tourSlide, setTourSlide] = useState(0);

    useEffect(() => {
        async function restaurarProgresso() {
            const salvo = await SecureStore.getItemAsync('onboarding_progress');
            if (salvo) {
                const { etapa: e, nome: n } = JSON.parse(salvo);
                setEtapa(e);
                setNome(n ?? '');
            }
        }
        restaurarProgresso();
    }, []);

    useEffect(() => {
        salvarProgresso(etapa, nome);
    }, [etapa, nome]);

    async function irParaTabs(modoPratica = false) {
        await concluirOnboarding(nome, lgpdConsentido);
        if (modoPratica) enterPracticeMode();
        router.replace('/(tabs)');
    }

    // ─────────────────────────────────────────
    // ETAPA 1: BOAS-VINDAS
    // ─────────────────────────────────────────
    if (etapa === 'boas_vindas') {
        return (
            <ScreenContainer variant="gold">
                <TopBar leftIcon="home" dark={false} onLeftPress={() => router.replace('/(tabs)')} />
                <View style={styles.centro}>
                    <IlustracaoBemVindo />
                    <Text style={styles.titulo36}>Bem-vindo,{'\n'}parceiro!</Text>
                    <Text style={styles.corpoBranco}>
                        Tô falando com tu agora. Toca no áudio quando quiser ouvir de novo.
                    </Text>
                </View>
                <View style={styles.rodape}>
                    <GradientButton
                        label="PODE COMEÇAR"
                        variant="red"
                        onPress={() => setEtapa('lgpd')}
                        style={styles.botaoFull}
                    />
                </View>
            </ScreenContainer>
        );
    }

    // ─────────────────────────────────────────
    // ETAPA 2: LGPD
    // ─────────────────────────────────────────
    if (etapa === 'lgpd') {
        return (
            <ScreenContainer variant="teal">
                <TopBar leftIcon="arrow-back" rightIcon="volume-high" onLeftPress={() => setEtapa('boas_vindas')} />
                <View style={styles.lgpdContainer}>
                    <View style={styles.lgpdCard}>
                        <View style={styles.lgpdIcone}>
                            <Ionicons name="shield-checkmark" size={28} color={colors.white} />
                        </View>
                        <Text style={styles.lgpdTitulo}>Seus dados, seu controle</Text>
                        <Text style={styles.lgpdCorpo}>
                            A gente só usa as suas informações pra te ajudar com os documentos da roça.
                            Seus dados não são vendidos nem compartilhados com ninguém.
                            {'\n\n'}
                            Toca no alto-falante pra ouvir essa explicação.
                        </Text>
                        <View style={styles.lgpdAcoes}>
                            <GradientButton
                                label="✓  Sim, eu concordo"
                                variant="teal"
                                onPress={() => { setLgpdConsentido(true); setEtapa('perfil'); }}
                                style={styles.botaoFull}
                            />
                            <GradientButton
                                label="Não quero agora"
                                variant="red"
                                onPress={() => setEtapa('boas_vindas')}
                                style={styles.botaoFull}
                            />
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.botaoVoltarLink} onPress={() => setEtapa('boas_vindas')}>
                    <Ionicons name="arrow-back" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.botaoVoltarLinkTexto}>Voltar</Text>
                </TouchableOpacity>
            </ScreenContainer>
        );
    }

    // ─────────────────────────────────────────
    // ETAPA 3: PERFIL (nome)
    // ─────────────────────────────────────────
    if (etapa === 'perfil') {
        return (
            <ScreenContainer variant="gold">
                <TopBar leftIcon="arrow-back" rightIcon="volume-high" onLeftPress={() => setEtapa('lgpd')} />
                <View style={styles.perfilEspacador} />
                <View style={styles.perfilCard}>
                    <View style={styles.perfilAvatar}>
                        <Ionicons name="person" size={60} color={colors.goldMid} />
                    </View>
                    <Text style={styles.perfilTitulo}>Como tu se chama?</Text>

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
                                <Text style={styles.perfilRowValor}>{auth().currentUser?.phoneNumber ?? '—'}</Text>
                            </View>
                        </View>
                        <View style={styles.perfilRow}>
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
                        label="SALVAR E CONTINUAR"
                        variant="gold"
                        onPress={() => { setTourSlide(0); setEtapa('tour'); }}
                        style={[styles.botaoFull, { marginTop: 8 }]}
                    />
                    <TouchableOpacity style={styles.botaoVoltarCard} onPress={() => setEtapa('lgpd')}>
                        <Ionicons name="arrow-back" size={16} color={colors.inkMute} />
                        <Text style={styles.botaoVoltarCardTexto}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            </ScreenContainer>
        );
    }

    // ─────────────────────────────────────────
    // ETAPA 4: TOUR
    // ─────────────────────────────────────────
    if (etapa === 'tour') {
        const slide = TOUR_SLIDES[tourSlide];
        const ultimo = tourSlide === TOUR_SLIDES.length - 1;

        return (
            <ScreenContainer variant="orange">
                <View style={styles.tourTopBar}>
                    <TouchableOpacity onPress={() => setEtapa('pratica')} style={styles.tourPular}>
                        <Text style={styles.tourPularTexto}>Pular</Text>
                    </TouchableOpacity>
                    <Ionicons name="volume-high" size={22} color="rgba(255,255,255,0.7)" />
                </View>
                <View style={styles.tourCentro}>
                    <IlustracaoTour index={tourSlide} />
                    <Text style={styles.tourTitulo}>{slide.titulo}</Text>
                    <Text style={styles.tourCorpo}>{slide.corpo}</Text>
                    <View style={styles.tourDots}>
                        {TOUR_SLIDES.map((_, i) => (
                            <View key={i} style={[styles.tourDot, i === tourSlide && styles.tourDotAtivo]} />
                        ))}
                    </View>
                </View>
                <View style={styles.tourRodape}>
                    <TouchableOpacity
                        style={styles.tourBotaoVoltar}
                        onPress={() => tourSlide > 0 ? setTourSlide(t => t - 1) : setEtapa('perfil')}
                    >
                        <Ionicons name="arrow-back" size={18} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.tourBotaoVoltarTexto}>Voltar</Text>
                    </TouchableOpacity>
                    <GradientButton
                        label={ultimo ? 'FINALIZAR' : 'PRÓXIMO →'}
                        variant="red"
                        onPress={() => ultimo ? setEtapa('pratica') : setTourSlide(t => t + 1)}
                        style={{ flex: 1 }}
                    />
                </View>
            </ScreenContainer>
        );
    }

    // ─────────────────────────────────────────
    // ETAPA 5: ESCOLHA (PRÁTICA / VALER)
    // ─────────────────────────────────────────
    return (
        <ScreenContainer variant="cream">
            <TopBar leftIcon="arrow-back" rightIcon="volume-high" dark onLeftPress={() => setEtapa('tour')} />
            <View style={styles.praticaHeader}>
                <Text style={styles.praticaTitulo}>Quer treinar?</Text>
                <Text style={styles.praticaSub}>Pode brincar sem medo de errar</Text>
            </View>
            <View style={styles.praticaLista}>
                <TouchableOpacity style={styles.praticaCard} activeOpacity={0.85} onPress={() => irParaTabs()}>
                    <View style={[styles.praticaIcone, { backgroundColor: colors.tealDark }]}>
                        <Ionicons name="leaf" size={26} color={colors.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.praticaCardTitulo}>Entrar pra valer</Text>
                        <Text style={styles.praticaCardSub}>Já vou cadastrar meus documentos</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.praticaCard} activeOpacity={0.85} onPress={() => irParaTabs(true)}>
                    <View style={[styles.praticaIcone, { backgroundColor: colors.goldMid }]}>
                        <Ionicons name="play" size={26} color={colors.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.praticaCardTitulo}>Modo Prática</Text>
                        <Text style={styles.praticaCardSub}>Treina sem mexer nos documentos de verdade</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.praticaCard} activeOpacity={0.85} onPress={() => setEtapa('boas_vindas')}>
                    <View style={[styles.praticaIcone, { backgroundColor: colors.redMid }]}>
                        <Ionicons name="help-circle" size={26} color={colors.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.praticaCardTitulo}>Tô com dúvida</Text>
                        <Text style={styles.praticaCardSub}>Ouvir a explicação de novo</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.botaoVoltarCard}
                onPress={() => setEtapa('tour')}
            >
                <Ionicons name="arrow-back" size={16} color={colors.inkMute} />
                <Text style={styles.botaoVoltarCardTexto}>Voltar</Text>
            </TouchableOpacity>
        </ScreenContainer>
    );
}

