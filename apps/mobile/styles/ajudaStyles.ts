import { StyleSheet } from 'react-native';
import { colors, spacing, typography, MIN_TOUCH_TARGET } from '../constants/theme';

export const ajudaStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    titulo: {
        ...typography.title,
        color: colors.text,
        marginBottom: spacing.xl,
    },
    botaoDanger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.danger,
        borderRadius: 8,
        minHeight: MIN_TOUCH_TARGET,
        paddingHorizontal: spacing.md,
        marginTop: 'auto',
        marginBottom: spacing.lg,
    },
    botaoDangerTexto: {
        ...typography.subtitle,
        color: '#fff',
    },
    botaoDangerDesabilitado: {
        backgroundColor: colors.border,
    },
    botaoTeste: {
        marginTop: spacing.md,
        alignItems: 'center',
        minHeight: MIN_TOUCH_TARGET,
        justifyContent: 'center',
    },
    botaoTesteTexto: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    botaoVoltar: {
        borderRadius: 8,
        minHeight: MIN_TOUCH_TARGET,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    botaoVoltarTexto: {
        ...typography.subtitle,
        color: colors.textSecondary,
    },
    modalFundo: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalCaixa: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.lg,
        width: '100%',
        gap: spacing.md,
        alignItems: 'center',
    },
    modalTitulo: {
        ...typography.title,
        color: colors.text,
    },
    modalTexto: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});
