import { Text, View, Button } from "react-native"
import { router } from "expo-router"

export default function HomeScreen() {
    return (
        <View>
            <Text>Home Screen</Text>
            <Button title="Ir para o painel" onPress={() => router.replace('/(tabs)')} />
        </View>
    )
}