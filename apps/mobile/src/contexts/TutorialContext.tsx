import { createContext, useContext, useState, useRef, RefObject, ReactNode } from 'react';
import { View, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { TUTORIAL_STEPS } from '../tutorial/steps';

export type ZonaRect = { top: number; left: number; width: number; height: number };

interface TutorialContextType {
    ativo: boolean;
    etapa: number;
    total: number;
    rects: Record<string, ZonaRect>;
    iniciar: () => void;
    proximo: () => void;
    pular: () => void;
    registrarRef: (zona: string, ref: RefObject<View | null>) => void;
    medirTudo: () => Promise<void>;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

const { width: W, height: H } = Dimensions.get('window');

export function TutorialProvider({ children }: { children: ReactNode }) {
    const [ativo, setAtivo] = useState(false);
    const [etapa, setEtapa] = useState(0);
    const [rects, setRects] = useState<Record<string, ZonaRect>>({});
    const refs = useRef<Record<string, RefObject<View | null>>>({});
    const total = TUTORIAL_STEPS.length;

    function registrarRef(zona: string, ref: React.RefObject<View>) {
        refs.current[zona] = ref;
    }

    function medirTudo(): Promise<void> {
        return new Promise((resolve) => {
            const zonas = Object.keys(refs.current);
            let medidas: Record<string, ZonaRect> = {};
            let pendentes = zonas.length;

            if (pendentes === 0) { resolve(); return; }

            function decrementar() {
                pendentes--;
                if (pendentes === 0) {
                    setRects(medidas);
                    resolve();
                }
            }

            zonas.forEach((zona) => {
                const ref = refs.current[zona];
                if (!ref?.current) { decrementar(); return; }
                ref.current.measureInWindow((x, y, width, height) => {
                    medidas[zona] = { top: y, left: x, width, height };
                    decrementar();
                });
            });
        });
    }

    function iniciar() {
        setEtapa(0);
        setAtivo(true);
    }

    function proximo() {
        const proxEtapa = etapa + 1;
        if (proxEtapa >= total) {
            setAtivo(false);
            router.replace('/(tabs)');
        } else {
            const proxStep = TUTORIAL_STEPS[proxEtapa];
            if (proxStep.navigateTo) {
                router.push(proxStep.navigateTo as any);
            }
            setEtapa(proxEtapa);
        }
    }

    function pular() {
        setAtivo(false);
    }

    return (
        <TutorialContext.Provider value={{ ativo, etapa, total, rects, iniciar, proximo, pular, registrarRef, medirTudo }}>
            {children}
        </TutorialContext.Provider>
    );
}

export function useTutorial() {
    const ctx = useContext(TutorialContext);
    if (!ctx) throw new Error('useTutorial deve ser usado dentro de TutorialProvider');
    return ctx;
}
