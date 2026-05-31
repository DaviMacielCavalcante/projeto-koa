import { router, useFocusEffect } from 'expo-router';
import { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTutorial } from '../../src/contexts/TutorialContext';
import { inicioStyles as styles } from '../../styles/inicioStyles';
import { Ionicons } from '@expo/vector-icons';
import { agricultoresDb } from '../../src/db/index';
import { ScreenContainer } from '../../design/components';
import { DocStatus } from '../../design/components/DocCircle';
import { colors } from '../../design/theme';
import AudioPlayer from '../../components/AudioPlayer';
import TutorialGlow from '../../components/TutorialGlow';
import BotaoConexao from '../../components/BotaoConexao';

const WALLPAPER_HOME = require('../../assets/images/WallpaperHome.png');
const TIPOS = ['ITR', 'CCIR', 'CAF', 'CAR'];
const TRINTA_DIAS = 30 * 24 * 60 * 60 * 1000;
const CARD_W = 140;
const CARD_GAP = 12;
const CARD_SNAP = CARD_W + CARD_GAP;


const STATUS_SUBTITLE: Record<DocStatus, string> = {
    green: 'em dia',
    yellow: 'vencendo',
    red: 'vencido',
    grey: 'faltando',
};

type DocRow = { type: string; status: string | null; expiration_date: string | null; file_url: string | null };

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
    const insets = useSafeAreaInsets();
    const { registrarRef, zonaAtiva } = useTutorial();
    const greetRef = useRef<View>(null);
    const docsRef = useRef<View>(null);

    useEffect(() => {
        registrarRef('greet', greetRef);
        registrarRef('docs', docsRef);
        registrarRef('cores', docsRef);
    }, []);

    const [docs, setDocs] = useState(
        TIPOS.map((nome) => ({ nome, status: 'grey' as DocStatus, fotoUrl: null as string | null }))
    );
    const [nomeUsuario, setNomeUsuario] = useState('Agricultor');
    const [fotoVisivel, setFotoVisivel] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            async function carregarStatus() {
                const userRow = await agricultoresDb?.getFirstAsync<{ name: string }>(
                    'SELECT name FROM users ORDER BY created_at DESC LIMIT 1'
                );
                if (userRow?.name) setNomeUsuario(userRow.name);

                const rows = await agricultoresDb?.getAllAsync<DocRow>(
                    `SELECT type, status, expiration_date, file_url FROM documents
                     WHERE type IN ('CAF','CAR','CCIR','ITR')
                     GROUP BY type
                     HAVING created_at = MAX(created_at)`
                );
                const mapa: Record<string, DocRow> = {};
                rows?.forEach((r) => (mapa[r.type] = r));
                setDocs(TIPOS.map((nome) => ({
                    nome,
                    status: calcularStatus(mapa[nome] ?? null),
                    fotoUrl: mapa[nome]?.file_url ?? null,
                })));
            }
            carregarStatus();
        }, [])
    );

    return (
        <ScreenContainer variant="cream">
            <View style={styles.screenBg} pointerEvents="none">
                <Image source={WALLPAPER_HOME} style={StyleSheet.absoluteFill} resizeMode="cover" />
                <LinearGradient
                    colors={['rgba(242,232,210,0.92)', 'rgba(242,232,210,0.5)', 'rgba(242,232,210,0.88)']}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            </View>

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
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    snapToInterval={CARD_SNAP}
                    snapToAlignment="start"
                    contentContainerStyle={styles.carouselContent}
                >
                    {docs.map((doc) => {
                        const barColor = {
                            green: colors.statusGreen,
                            yellow: colors.statusYellow,
                            red: colors.statusRed,
                            grey: colors.statusGrey,
                        }[doc.status];
                        const destaque = zonaAtiva === 'docs' || zonaAtiva === 'cores';

                        return (
                            <TutorialGlow key={doc.nome} active={destaque} borderRadius={18} style={styles.carouselItem}>
                                <TouchableOpacity
                                    style={styles.docCardSquare}
                                    activeOpacity={0.85}
                                    onPress={() => router.push('/documento/' + doc.nome)}
                                >
                                    {doc.fotoUrl && (
                                        <TouchableOpacity
                                            style={styles.docCardEye}
                                            onPress={() => setFotoVisivel(doc.fotoUrl)}
                                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        >
                                            <Ionicons name="eye-outline" size={20} color={colors.tealDark} />
                                        </TouchableOpacity>
                                    )}
                                    <View style={styles.docCardSquareBody}>
                                        <Text style={styles.docCardSquareNome}>{doc.nome}</Text>
                                        <Text style={styles.docCardSquareSub}>{STATUS_SUBTITLE[doc.status]}</Text>
                                    </View>
                                    <View style={[styles.docCardStatusBar, { backgroundColor: barColor }]} />
                                </TouchableOpacity>
                            </TutorialGlow>
                        );
                    })}
                </ScrollView>

                <TouchableOpacity
                    style={styles.educationalCardWrap}
                    activeOpacity={0.85}
                    onPress={() => router.push('/roadmap')}
                >
                    <LinearGradient
                        colors={[colors.white, colors.creamLight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.educationalCard}
                    >
                        <Image
                            source={require('../../assets/roadmap/image/trilha-icon.png')}
                            style={styles.educationalIcon}
                            resizeMode="contain"
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.educationalTitle}>Aprender sobre os documentos</Text>
                            <Text style={styles.educationalSub}>Estude no seu ritmo</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.tealDark} />
                    </LinearGradient>
                </TouchableOpacity>

                <BotaoConexao />
            </ScrollView>

            <AudioPlayer
                source={require('../../assets/audio/829108__jamm__notification-sound-4-hopeful.mp3')}
                autoPlay={false}
                style={[styles.playerFixed, { bottom: Math.max(insets.bottom + 86, 98) }]}
            />

            <Modal visible={!!fotoVisivel} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.fotoModalFundo}
                    activeOpacity={1}
                    onPress={() => setFotoVisivel(null)}
                >
                    <Image
                        source={{ uri: fotoVisivel ?? '' }}
                        style={styles.fotoModalImagem}
                        resizeMode="contain"
                    />
                    <TouchableOpacity
                        style={styles.fotoModalFechar}
                        onPress={() => setFotoVisivel(null)}
                    >
                        <Ionicons name="close-circle" size={52} color="#fff" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </ScreenContainer>
    );
}
