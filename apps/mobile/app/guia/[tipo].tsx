import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../../components/BackButton';
import { colors } from '../../constants/theme';
import { guiaStyles as styles } from '../../styles/documentoStyles';
import AudioPlayer from '../../components/AudioPlayer';

const EMATER_TELEFONE = 'tel:+5591XXXXXXXX'; // TODO: confirmar número real da EMATER em Moju

const HORARIO = 'Segunda a sexta, das 8h às 14h';

type ItemLevar = { icone: keyof typeof Ionicons.glyphMap; label: string };

const O_QUE_LEVAR: Record<string, ItemLevar[]> = {
    CAF: [
        { icone: 'card', label: 'RG ou CPF' },
        { icone: 'document', label: 'DAP anterior (se tiver)' },
        { icone: 'home', label: 'Comprovante de residência' },
    ],
    CAR: [
        { icone: 'card', label: 'CPF' },
        { icone: 'map', label: 'Coordenadas ou croqui da propriedade' },
        { icone: 'document', label: 'CCIR ou ITR' },
    ],
    CCIR: [
        { icone: 'card', label: 'CPF' },
        { icone: 'document', label: 'Escritura ou contrato de posse' },
        { icone: 'cash', label: 'Comprovante de pagamento do ITR' },
    ],
    ITR: [
        { icone: 'card', label: 'CPF' },
        { icone: 'document', label: 'CCIR' },
        { icone: 'home', label: 'Dados da propriedade (área, município)' },
    ],
    'NFA-e': [
        { icone: 'card', label: 'CPF' },
        { icone: 'document', label: 'CAF ou DAP' },
        { icone: 'storefront', label: 'Dados do comprador' },
    ],
};

export default function GuiaDocumento() {
    const { tipo } = useLocalSearchParams<{ tipo: string }>();
    const itens = O_QUE_LEVAR[tipo] ?? [];

    return (
        <View  style={{ flex: 1}}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <BackButton />

                <Text style={styles.titulo}>Como conseguir o {tipo}</Text>

                <View style={styles.secao}>
                    <Text style={styles.secaoTitulo}>Onde ir</Text>
                    <Text style={styles.secaoTexto}>Escritório da EMATER em Moju</Text>
                    <Text style={styles.secaoTexto}>{HORARIO}</Text>
                </View>

                <View style={styles.secao}>
                    <Text style={styles.secaoTitulo}>O que levar</Text>
                    {itens.map((item) => (
                        <View key={item.label} style={styles.itemLevar}>
                            <Ionicons name={item.icone} size={28} color={colors.primary} />
                            <Text style={styles.itemLevarTexto}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.botaoLigar}
                    onPress={() => Linking.openURL(EMATER_TELEFONE)}
                >
                    <Ionicons name="call" size={24} color={colors.surface} />
                    <Text style={styles.botaoLigarTexto}>Ligar pra EMATER</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoGuardar}
                    onPress={() => router.push(`/camera/${tipo}`)}
                >
                    <Text style={styles.botaoGuardarTexto}>Já tenho, quero guardar</Text>
                </TouchableOpacity>
            </ScrollView>
        <AudioPlayer
                source={require("../../assets/audio/829108__jamm__notification-sound-4-hopeful.mp3")}
                autoPlay ={false}
                style={{ position: 'absolute', bottom: 24, right: 24 }}
        />
        </View>
    );
}

