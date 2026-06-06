import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../design/theme';

export const DOCUMENT_TYPES = ['CAF', 'CAR', 'CCIR', 'ITR'] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export type DocumentIconName = keyof typeof Ionicons.glyphMap;

export type DocumentIconLayer = {
    color: string;
    name: DocumentIconName;
    size: number;
    top: number;
    left: number;
    opacity?: number;
};

export type DocumentMeta = {
    accent: string;
    cardColor: string;
    description: string;
    fullName: string;
    iconBackground: string;
    iconBorder: string;
    iconLayers: DocumentIconLayer[];
    shortLabel: string;
};

export const documentMeta: Record<DocumentType, DocumentMeta> = {
    CAF: {
        shortLabel: 'CAF',
        fullName: 'Cadastro da Agricultura Familiar',
        description: 'Comprova que voce e agricultor familiar e abre acesso a politicas publicas.',
        accent: colors.tealDark,
        cardColor: '#D6EFEA',
        iconBackground: '#F4FBF8',
        iconBorder: '#B5DDD4',
        iconLayers: [
            { name: 'document-text-outline', size: 36, color: colors.tealDark, top: 14, left: 14, opacity: 0.28 },
            { name: 'person-circle-outline', size: 34, color: colors.tealDark, top: 20, left: 8 },
            { name: 'leaf-outline', size: 22, color: colors.goldDark, top: 34, left: 34 },
        ],
    },
    CAR: {
        shortLabel: 'CAR',
        fullName: 'Cadastro Ambiental Rural',
        description: 'Registro obrigatorio da propriedade no sistema ambiental.',
        accent: colors.tealMid,
        cardColor: '#D8E9D6',
        iconBackground: '#F5FAF1',
        iconBorder: '#C0D8BE',
        iconLayers: [
            { name: 'document-text-outline', size: 36, color: colors.tealDark, top: 14, left: 14, opacity: 0.24 },
            { name: 'map-outline', size: 32, color: colors.tealDark, top: 18, left: 10 },
            { name: 'leaf-outline', size: 18, color: colors.goldDark, top: 37, left: 39 },
        ],
    },
    CCIR: {
        shortLabel: 'CCIR',
        fullName: 'Certificado de Cadastro de Imovel Rural',
        description: 'Documento que identifica e certifica seu imovel rural.',
        accent: colors.goldDark,
        cardColor: '#F0E2BF',
        iconBackground: '#FFF9EC',
        iconBorder: '#E3C883',
        iconLayers: [
            { name: 'document-text-outline', size: 36, color: colors.goldDark, top: 14, left: 14, opacity: 0.25 },
            { name: 'home-outline', size: 26, color: colors.tealDark, top: 20, left: 13 },
            { name: 'ribbon-outline', size: 22, color: colors.orangeMid, top: 33, left: 35 },
        ],
    },
    ITR: {
        shortLabel: 'ITR',
        fullName: 'Imposto Territorial Rural',
        description: 'Declaracao anual obrigatoria sobre sua propriedade rural.',
        accent: colors.orangeMid,
        cardColor: '#F3D7C8',
        iconBackground: '#FFF4EE',
        iconBorder: '#E7B89E',
        iconLayers: [
            { name: 'document-text-outline', size: 36, color: colors.orangeMid, top: 14, left: 14, opacity: 0.24 },
            { name: 'cash-outline', size: 28, color: colors.redMid, top: 20, left: 11 },
            { name: 'calendar-outline', size: 20, color: colors.tealDark, top: 35, left: 36 },
        ],
    },
};

export function isDocumentType(value: string): value is DocumentType {
    return DOCUMENT_TYPES.includes(value as DocumentType);
}
