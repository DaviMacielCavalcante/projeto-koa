import * as NetInfo from '@react-native-community/netinfo';

let chamadas = 0;

async function verificarConexao(origem = 'manual') {
    chamadas += 1;
    const horario = new Date().toLocaleTimeString('pt-BR');
    try {
        const estado = await NetInfo.fetch();
        if (estado.isConnected) {
            console.log(`[rede] #${chamadas} ${horario} (${origem}) — CONECTADO (${estado.type}) | internet: ${estado.isInternetReachable}`);
        } else {
            console.log(`[rede] #${chamadas} ${horario} (${origem}) — SEM CONEXÃO`);
        }
    } catch (e) {
        console.log(`[rede] #${chamadas} ${horario} (${origem}) — ERRO`, e);
    }
}

export { verificarConexao };
