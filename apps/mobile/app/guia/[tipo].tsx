import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, Linking, ScrollView } from 'react-native';
import { guiaScreenStyles as styles } from '../../styles/guiaScreenStyles';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GradientButton, TopBar } from '../../design/components';
import { colors } from '../../design/theme';

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
        <ScreenContainer variant="teal">
            <TopBar leftIcon="arrow-back" rightIcon="volume-high" />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <Text style={styles.titulo}>Como conseguir o {tipo}</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>Onde ir</Text>
                    <Text style={styles.cardTexto}>Escritório da EMATER em Moju</Text>
                    <Text style={styles.cardTexto}>{HORARIO}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitulo}>O que levar</Text>
                    {itens.map((item, i) => (
                        <View key={item.label} style={[styles.item, i === itens.length - 1 && { borderBottomWidth: 0 }]}>
                            <View style={styles.itemIcone}>
                                <Ionicons name={item.icone} size={22} color={colors.tealDark} />
                            </View>
                            <Text style={styles.itemTexto}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                <GradientButton
                    label="📞  Ligar pra EMATER"
                    variant="teal"
                    onPress={() => Linking.openURL(EMATER_TELEFONE)}
                    style={styles.botao}
                />
                <GradientButton
                    label="📷  Já tenho, quero guardar"
                    variant="gold"
                    onPress={() => router.push(`/camera/${tipo}`)}
                    style={styles.botao}
                />
            </ScrollView>
        </ScreenContainer>
    );
}

