import { StatusBar } from 'expo-status-bar';
import {useEffect, useState} from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { initDb } from './src/db'

export default function App() {

  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDb().then(() => {
      setDbReady(true)
    }
  )
  }, [])

  if (!dbReady) {
    return <ActivityIndicator></ActivityIndicator>
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
