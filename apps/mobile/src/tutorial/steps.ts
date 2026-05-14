export type TutorialZone =
    | 'greet'
    | 'docs'
    | 'cores'
    | 'tab-avisos'
    | 'tab-outros'
    | 'tab-ajuda';

export interface TutorialStep {
    zone: TutorialZone;
    titulo: string;
    texto: string;
    calloutPos: 'above' | 'below';
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
];
