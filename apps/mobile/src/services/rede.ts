import * as NetInfo from '@react-native-community/netinfo';

let chamadas = 0;

async function verificarConexao(origem = 'manual'): Promise<boolean> {
    chamadas += 1;
    const horario = new Date().toLocaleTimeString('pt-BR');
    try {
        const estado = await NetInfo.fetch();
        const conectado = estado.isConnected === true && estado.isInternetReachable === true;
        if (conectado) {
            console.log(`[rede] #${chamadas} ${horario} (${origem}) — CONECTADO (${estado.type}) | internet: ${estado.isInternetReachable}`);
        } else {
            console.log(`[rede] #${chamadas} ${horario} (${origem}) — SEM CONEXÃO | rede: ${estado.isConnected} internet: ${estado.isInternetReachable}`);
        }
        return conectado;
    } catch (e) {
        console.log(`[rede] #${chamadas} ${horario} (${origem}) — ERRO`, e);
        return false;
    }
}

export { verificarConexao };
