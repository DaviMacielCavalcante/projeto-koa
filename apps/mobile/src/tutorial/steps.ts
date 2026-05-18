export type TutorialZone =
    | 'greet'
    | 'docs'
    | 'cores'
    | 'tab-avisos'
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
        texto: 'Estes são seus 5 documentos principais. Toque em qualquer um para ver detalhes, tirar foto ou saber como conseguir.',
        calloutPos: 'below',
    },
    {
        zone: 'cores',
        titulo: 'O que significa cada cor?',
        texto: 'Verde = em dia · Amarelo = vencendo em breve · Vermelho = vencido · Cinza = sem informação ainda.',
        calloutPos: 'below',
    },
    {
        zone: 'tab-avisos',
        titulo: 'Aba Avisos',
        texto: 'Aqui você recebe alertas quando um documento está perto de vencer. Não ignore!',
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
        texto: 'Vamos ver como funciona a tela do ITR. O ícone e o nome do documento ficam aqui no topo.',
        calloutPos: 'below',
        navigateTo: '/documento/ITR',
    },
    {
        zone: 'doc-status',
        titulo: 'Situação do documento',
        texto: 'Este círculo mostra se o seu ITR está em dia, vencendo ou vencido. A cor muda conforme a situação.',
        calloutPos: 'below',
    },
    {
        zone: 'doc-acoes',
        titulo: 'O que você pode fazer',
        texto: 'Aqui você acessa o guia de como conseguir o documento, tira foto para guardar, ou vê suas dúvidas.',
        calloutPos: 'above',
    },
];
