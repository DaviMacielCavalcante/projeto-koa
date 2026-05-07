import { StyleSheet } from 'react-native';
import { colors, spacing, typography, MIN_TOUCH_TARGET } from '../constants/theme';

export const documentosStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    titulo: {
        ...typography.title,
        color: colors.text,
        marginBottom: spacing.lg,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        minHeight: MIN_TOUCH_TARGET,
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    itemTipo: {
        ...typography.subtitle,
        color: colors.text,
    },
    itemStatus: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    botaoVer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 6,
    },
    botaoVerTexto: {
        ...typography.caption,
        color: colors.surface,
        fontWeight: '600',
    },
    modalFundo: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalFoto: {
        width: '90%',
        height: '80%',
    },
    modalFechar: {
        position: 'absolute',
        top: spacing.xl,
        right: spacing.md,
    },
});
