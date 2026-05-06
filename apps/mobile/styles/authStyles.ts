import { StyleSheet } from 'react-native';
import { colors, spacing, typography, MIN_TOUCH_TARGET } from '../constants/theme';

export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    titulo: {
        ...typography.subtitle,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        minHeight: MIN_TOUCH_TARGET,
        fontSize: 18,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    botao: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        minHeight: MIN_TOUCH_TARGET,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoTexto: {
        ...typography.subtitle,
        color: colors.surface,
    },
    botaoTeste: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    botaoTesteTexto: {
        ...typography.caption,
        color: colors.textSecondary,
    },
});

export const otpStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    titulo: {
        ...typography.subtitle,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        minHeight: MIN_TOUCH_TARGET,
        fontSize: 32,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.md,
        letterSpacing: 8,
    },
    botao: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        minHeight: MIN_TOUCH_TARGET,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoTexto: {
        ...typography.subtitle,
        color: colors.surface,
    },
});
