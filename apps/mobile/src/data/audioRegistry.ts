// Registro estático dos áudios embutidos no app. O React Native exige que o
// caminho do require() seja literal (resolvido no build), então o banco guarda
// apenas a CHAVE (audios.file_key) e o código resolve o asset aqui.
const AUDIO_REGISTRY: Record<string, number> = {
    car: require('../../assets/roadmap/audio/car.mp3'),
    ccir: require('../../assets/roadmap/audio/ccir.mp3'),
    itr: require('../../assets/roadmap/audio/itr.mp3'),
};

export function getAudioSource(fileKey: string | null | undefined): number | undefined {
    if (!fileKey) return undefined;
    return AUDIO_REGISTRY[fileKey];
}
