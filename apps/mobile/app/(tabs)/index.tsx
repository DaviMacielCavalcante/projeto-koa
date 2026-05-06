import { router } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

export default function Inicio() {

    const docs = [
        {nome: "CAF", cor: '#9E9E9E'},
        {nome: "CAR", cor: '#9E9E9E'},
        {nome: "CCIR", cor: '#9E9E9E'},
        {nome: "ITR", cor: '#9E9E9E'},
        {nome: "NFA-e", cor: '#9E9E9E'},
    ]

    return (
        <View>
            <Text>Olá, João</Text>
            <FlatList
                data={docs}
                keyExtractor={(item) => item.nome}
                renderItem={({ item }) => (
                    <TouchableOpacity  style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: item.cor, justifyContent: 'center', alignItems: 'center' }} onPress={() => router.push('/documento/' + item.nome)}>
                        <Text>{item.nome}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
