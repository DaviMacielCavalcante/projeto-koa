import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { colors } from '../theme';
import { documentMeta, type DocumentType } from '../../src/constants/documents';

interface DocumentTypeIconProps {
    size?: number;
    type: DocumentType;
}

export default function DocumentTypeIcon({ type, size = 72 }: DocumentTypeIconProps) {
    const meta = documentMeta[type];
    const scale = size / 72;
    const primaryLayers = meta.iconLayers.slice(1);

    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size * 0.32,
                backgroundColor: meta.iconBackground,
                borderWidth: 1,
                borderColor: meta.iconBorder,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <View
                style={{
                    position: 'absolute',
                    inset: size * 0.1,
                    borderRadius: size * 0.24,
                    backgroundColor: meta.cardColor,
                }}
            />

            {primaryLayers.map((layer) => (
                <Ionicons
                    key={`${type}-${layer.name}-${layer.top}-${layer.left}`}
                    name={layer.name}
                    size={layer.size * scale}
                    color={layer.color}
                    style={{
                        position: 'absolute',
                        top: layer.top * scale,
                        left: layer.left * scale,
                        opacity: layer.opacity ?? 1,
                    }}
                />
            ))}

            <View
                style={{
                    position: 'absolute',
                    right: size * 0.1,
                    bottom: size * 0.1,
                    width: size * 0.14,
                    height: size * 0.14,
                    borderRadius: size * 0.07,
                    backgroundColor: meta.accent,
                    borderWidth: 2,
                    borderColor: colors.white,
                }}
            />
        </View>
    );
}
