import { router, useFocusEffect } from 'expo-router';
import { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTutorial } from '../../src/contexts/TutorialContext';
import { inicioStyles as styles } from '../../styles/inicioStyles';
import { Ionicons } from '@expo/vector-icons';
import { agricultoresDb } from '../../src/db/index';
import { usePracticeMode } from '../../src/hooks/usePracticeMode';
import { ScreenContainer } from '../../design/components';
import { DocStatus } from '../../design/components/DocCircle';
import { colors } from '../../design/theme';
import AudioPlayer from '../../components/AudioPlayer';
import TutorialGlow from '../../components/TutorialGlow';
import BotaoConexao from '../../components/BotaoConexao';

const WALLPAPER_HOME = require('../../assets/images/WallpaperHome.png');
const TIPOS = ['ITR', 'CCIR', 'CAF', 'CAR'];
const TRINTA_DIAS = 30 * 24 * 60 * 60 * 1000;


const STATUS_SUBTITLE: Record<DocStatus, string> = {
    green: 'em dia',
    yellow: 'vencendo',
    red: 'vencido',
    grey: 'faltando',
};

type DocRow = { type: string; status: string | null; expiration_date: string | null };

function calcularStatus(row: DocRow | null): DocStatus {
    if (!row) return 'grey';
    if (row.expiration_date) {
        const vencimento = new Date(row.expiration_date).getTime();
        const hoje = Date.now();
        if (hoje > vencimento) return 'red';
        if (vencimento - hoje <= TRINTA_DIAS) return 'yellow';
        return 'green';
    }
    if (row.status === 'active') return 'green';
    if (row.status === 'expiring_soon') return 'yellow';
    if (row.status === 'expired') return 'red';
    return 'grey';
}

export default function Inicio() {
    const { isPracticeMode } = usePracticeMode();
    const { registrarRef, zonaAtiva } = useTutorial();
    const greetRef = useRef<View>(null);
    const docsRef = useRef<View>(null);

    useEffect(() => {
        registrarRef('greet', greetRef);
        registrarRef('docs', docsRef);
        registrarRef('cores', docsRef);
    }, []);

    const [docs, setDocs] = useState(
        TIPOS.map((nome) => ({ nome, status: 'grey' as DocStatus }))
    );
    const [nomeUsuario, setNomeUsuario] = useState('Agricultor');

    useFocusEffect(
        useCallback(() => {
            async function carregarStatus() {
                if (isPracticeMode) {
                    const { mockFarmer, mockDocuments } = await import('../../src/mocks/practiceData');
                    setNomeUsuario(mockFarmer.name);
                    const mapa: Record<string, DocRow> = {};
                    mockDocuments.forEach(d => (mapa[d.type] = d as DocRow));
                    setDocs(TIPOS.map((nome) => ({ nome, status: calcularStatus(mapa[nome] ?? null) })));
                    return;
                }

                const userRow = await agricultoresDb?.getFirstAsync<{ name: string }>(
                    'SELECT name FROM users ORDER BY created_at DESC LIMIT 1'
                );
                if (userRow?.name) setNomeUsuario(userRow.name);

                const rows = await agricultoresDb?.getAllAsync<DocRow>(
                    `SELECT type, status, expiration_date FROM documents
                     WHERE type IN ('CAF','CAR','CCIR','ITR')
                     GROUP BY type
                     HAVING created_at = MAX(created_at)`
                );
                const mapa: Record<string, DocRow> = {};
                rows?.forEach((r) => (mapa[r.type] = r));
                setDocs(TIPOS.map((nome) => ({ nome, status: calcularStatus(mapa[nome] ?? null) })));
            }
            carregarStatus();
        }, [isPracticeMode])
    );

    return (
        <ScreenContainer variant="cream">
            <TutorialGlow active={zonaAtiva === 'greet'} borderRadius={22} style={{ marginHorizontal: 16, marginTop: 12, marginBottom: 12 }}>
                <View ref={greetRef} style={[styles.greetCard, { marginHorizontal: 0, marginTop: 0, marginBottom: 0 }]}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={22} color={colors.tealDark} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.greetLabel}>Bom dia,</Text>
                        <Text style={styles.greetName}>{nomeUsuario}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/perfil')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="pencil" size={18} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>
                </View>
            </TutorialGlow>

            <ScrollView
                ref={docsRef as any}
                style={{ flex: 1 }}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Seus Documentos</Text>
                <View style={styles.docsRow}>
                    <View style={styles.docsColumn}>
                        {docs.map((doc) => {
                            const barColor = {
                                green: colors.statusGreen,
                                yellow: colors.statusYellow,
                                red: colors.statusRed,
                                grey: colors.statusGrey,
                            }[doc.status];
                            const destaque = zonaAtiva === 'docs' || zonaAtiva === 'cores';

                            return (
                                <TutorialGlow key={doc.nome} active={destaque} borderRadius={18}>
                                    <TouchableOpacity
                                        style={styles.docCard}
                                        activeOpacity={0.85}
                                        onPress={() => router.push('/documento/' + doc.nome)}
                                    >
                                        <View style={[styles.docCardBarra, { backgroundColor: barColor }]} />
                                        <View style={styles.docCardConteudo}>
                                            <Text style={styles.docCardNome}>{doc.nome}</Text>
                                            <Text style={styles.docCardSubtitulo}>{STATUS_SUBTITLE[doc.status]}</Text>
                                        </View>
                                        <View style={styles.docCardDireita}>
                                            <Ionicons name="chevron-forward" size={20} color={colors.tealDark} />
                                        </View>
                                    </TouchableOpacity>
                                </TutorialGlow>
                            );
                        })}
                    </View>
                    <View style={styles.wallpaperColumn} pointerEvents="none">
                        <Image source={WALLPAPER_HOME} style={styles.wallpaperImage} resizeMode="cover" />
                        <LinearGradient
                            colors={['rgba(242,232,210,1)', 'rgba(242,232,210,0.35)']}
                            locations={[0, 1]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                            pointerEvents="none"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.educationalCard}
                    activeOpacity={0.85}
                    onPress={() => router.push('/roadmap')}
                >
                    <Image
                        source={require('../../assets/trilha-icon.png')}
                        style={styles.educationalIcon}
                        resizeMode="contain"
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.educationalTitle}>Aprender sobre os documentos</Text>
                        <Text style={styles.educationalSub}>Estude no seu ritmo</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.tealDark} />
                </TouchableOpacity>

                <BotaoConexao />
            </ScrollView>

            <AudioPlayer
                source={require('../../assets/audio/829108__jamm__notification-sound-4-hopeful.mp3')}
                autoPlay={false}
                style={styles.playerFixed}
            />
        </ScreenContainer>
    );
}
