import { useState, useCallback } from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { verificarConexao } from '../src/services/rede';
import { botaoConexaoStyles as styles } from '../styles/botaoConexaoStyles';

const ICON_WIFI = require('../assets/icon-wifi.png');

export default function BotaoConexao() {
    const [conectado, setConectado] = useState(false);

    useFocusEffect(
        useCallback(() => {
            verificarConexao('home').then(setConectado);
        }, [])
    );

    return (
        <TouchableOpacity
            style={[styles.botao, conectado ? styles.botaoConectado : styles.botaoDesconectado]}
            activeOpacity={0.85}
            onPress={() => verificarConexao('toque').then(setConectado)}
        >
            <Image source={ICON_WIFI} style={styles.icone} resizeMode="contain" />
            <Text style={styles.texto}>{conectado ? 'conectado' : 'conecte-se'}</Text>
        </TouchableOpacity>
    );
}
