import { StyleSheet } from 'react-native';
import { colors, spacing, typography, MIN_TOUCH_TARGET } from '../constants/theme';

export const documentoStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    header: {
        alignItems: 'center',
        marginTop: spacing.lg,
        marginBottom: spacing.lg,
    },
    indicador: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: spacing.md,
    },
    titulo: {
        ...typography.title,
        color: colors.text,
    },
    statusLabel: {
        ...typography.body,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    descricao: {
        ...typography.body,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.lg,
        lineHeight: 24,
    },
    validade: {
        ...typography.caption,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    botoes: {
        gap: spacing.sm,
    },
    botao: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        minHeight: MIN_TOUCH_TARGET,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    botaoSecundario: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    botaoTexto: {
        ...typography.subtitle,
        color: colors.surface,
    },
    botaoTextoSecundario: {
        color: colors.primary,
    },
});

export const guiaStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    titulo: {
        ...typography.title,
        color: colors.text,
        marginTop: spacing.lg,
        marginBottom: spacing.lg,
    },
    secao: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    secaoTitulo: {
        ...typography.subtitle,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    secaoTexto: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    itemLevar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    itemLevarTexto: {
        ...typography.body,
        color: colors.text,
    },
    botaoLigar: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        minHeight: MIN_TOUCH_TARGET,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    botaoLigarTexto: {
        ...typography.subtitle,
        color: colors.surface,
    },
    botaoGuardar: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        minHeight: MIN_TOUCH_TARGET,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    botaoGuardarTexto: {
        ...typography.subtitle,
        color: colors.primary,
    },
});

export const cameraStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    camera: {
        flex: 1,
        margin: -spacing.md,
    },
    instrucao: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: spacing.md,
    },
    instrucaoTexto: {
        ...typography.subtitle,
        color: '#fff',
        textAlign: 'center',
    },
    capturaBotaoContainer: {
        position: 'absolute',
        bottom: spacing.xl,
        width: '100%',
        alignItems: 'center',
    },
    capturaBotao: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#fff',
        borderWidth: 4,
        borderColor: colors.primary,
    },
    preview: {
        flex: 1,
        borderRadius: 8,
        marginBottom: spacing.md,
    },
    acoes: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    botao: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 8,
        minHeight: MIN_TOUCH_TARGET,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoSecundario: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    botaoTexto: {
        ...typography.subtitle,
        color: colors.surface,
    },
    botaoTextoSecundario: {
        color: colors.primary,
    },
    permissaoTexto: {
        ...typography.body,
        color: colors.text,
        textAlign: 'center',
        marginVertical: spacing.lg,
    },
});
