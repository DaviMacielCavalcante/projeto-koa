import { createContext, useContext, useState, ReactNode } from 'react';

interface TutorialContextType {
    ativo: boolean;
    etapa: number;
    total: number;
    iniciar: () => void;
    proximo: () => void;
    pular: () => void;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

export function TutorialProvider({ children }: { children: ReactNode }) {
    const [ativo, setAtivo] = useState(false);
    const [etapa, setEtapa] = useState(0);
    const total = 6;

    function iniciar() {
        setEtapa(0);
        setAtivo(true);
    }

    function proximo() {
        if (etapa + 1 >= total) {
            setAtivo(false);
        } else {
            setEtapa(e => e + 1);
        }
    }

    function pular() {
        setAtivo(false);
    }

    return (
        <TutorialContext.Provider value={{ ativo, etapa, total, iniciar, proximo, pular }}>
            {children}
        </TutorialContext.Provider>
    );
}

export function useTutorial() {
    const ctx = useContext(TutorialContext);
    if (!ctx) throw new Error('useTutorial deve ser usado dentro de TutorialProvider');
    return ctx;
}
