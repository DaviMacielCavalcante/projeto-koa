export type TutorialZone =
    | 'greet'
    | 'docs'
    | 'cores'
    | 'tab-notas'
    | 'tab-outros'
    | 'tab-ajuda'
    | 'doc-hero'
    | 'doc-status'
    | 'doc-acoes';

export interface TutorialStep {
    zone: TutorialZone;
    titulo: string;
    texto: string;
    calloutPos: 'above' | 'below';
    navigateTo?: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
    {
        zone: 'greet',
        titulo: 'Seu perfil',
        texto: 'Aqui fica o seu nome. Toque no lápis para editar quando quiser.',
        calloutPos: 'below',
    },
    {
        zone: 'docs',
        titulo: 'Seus documentos',
        texto: 'Estes são seus 4 documentos principais. Toque em qualquer um para ver detalhes, tirar foto ou saber como conseguir.',
        calloutPos: 'below',
    },
    {
        zone: 'cores',
        titulo: 'O que significa cada cor?',
        texto: 'Verde = em dia · Amarelo = vencendo em breve · Vermelho = vencido · Cinza = sem informação ainda.',
        calloutPos: 'below',
    },
    {
        zone: 'tab-notas',
        titulo: 'Aba Nota Fiscal',
        texto: 'Aqui você emite a nota fiscal das suas vendas e acompanha todas as notas já emitidas.',
        calloutPos: 'above',
    },
    {
        zone: 'tab-outros',
        titulo: 'Aba Outros',
        texto: 'Aqui você guarda cópias de outros documentos importantes, como contratos, certidões e autorizações.',
        calloutPos: 'above',
    },
    {
        zone: 'tab-ajuda',
        titulo: 'Aba Ajuda',
        texto: 'Aqui você pode rever este tutorial, alterar seu nome, entrar no modo prática e gerenciar seus dados.',
        calloutPos: 'above',
    },
    {
        zone: 'doc-hero',
        titulo: 'Dentro de um documento',
        texto: 'Aqui você vê o nome do documento e a sua situação atual — se está em dia, vencendo ou vencido.',
        calloutPos: 'below',
        navigateTo: '/documento/ITR',
    },
    {
        zone: 'doc-status',
        titulo: 'Imagem do documento',
        texto: 'Esta é a imagem de referência do documento. Toque nela para ampliar e ver como ele se parece.',
        calloutPos: 'below',
    },
    {
        zone: 'doc-acoes',
        titulo: 'O que você pode fazer',
        texto: 'Aqui você acessa o guia de como conseguir o documento, tira foto para guardar, ou vê suas dúvidas.',
        calloutPos: 'above',
    },
];
