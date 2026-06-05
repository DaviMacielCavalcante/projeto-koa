// Registro estático dos assets embutidos no app (áudios narrados e foto do
// narrador). O React Native exige que o caminho do require() seja literal
// (resolvido no build), então o banco guarda apenas a CHAVE (audios.file_key) e o
// código resolve o asset aqui — tanto o mp3 quanto o avatar do narrador.
const AUDIO_REGISTRY: Record<string, number> = {
    car: require('../../assets/roadmap/audio/car.mp3'),
    ccir: require('../../assets/roadmap/audio/ccir.mp3'),
    itr: require('../../assets/roadmap/audio/itr.mp3'),
    'nf-introducao': require('../../assets/roadmap/audio/nf-introducao.mp3'),
    'nf-separando-documentos': require('../../assets/roadmap/audio/nf-separando-documentos.mp3'),
    'nf-certificado-digital': require('../../assets/roadmap/audio/nf-certificado-digital.mp3'),
    'nf-emitindo-a-nota': require('../../assets/roadmap/audio/nf-emitindo-a-nota.mp3'),
};

// Foto do narrador, por narrador. CAR/CCIR/ITR são narrados por @fugaprascolinas;
// os tópicos de Nota Fiscal, por @matheus.
const PERFIL_FUGA = require('../../assets/roadmap/image/perfil-fugaprascolinas.jpg');
const PERFIL_MATHEUS = require('../../assets/roadmap/image/perfil-matheus.jpeg');

const AVATAR_REGISTRY: Record<string, number> = {
    car: PERFIL_FUGA,
    ccir: PERFIL_FUGA,
    itr: PERFIL_FUGA,
    'nf-introducao': PERFIL_MATHEUS,
    'nf-separando-documentos': PERFIL_MATHEUS,
    'nf-certificado-digital': PERFIL_MATHEUS,
    'nf-emitindo-a-nota': PERFIL_MATHEUS,
};

export function getAudioSource(fileKey: string | null | undefined): number | undefined {
    if (!fileKey) return undefined;
    return AUDIO_REGISTRY[fileKey];
}

export function getAvatarSource(fileKey: string | null | undefined): number | undefined {
    if (!fileKey) return undefined;
    return AVATAR_REGISTRY[fileKey];
}
