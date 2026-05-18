import { createContext, useState, ReactNode, useCallback } from 'react';

export interface PracticeModeContextType {
    isPracticeMode: boolean;
    enterPracticeMode: () => void;
    exitPracticeMode: () => void;
    practicePhotos: Record<string, string>;
    setPracticePhoto: (tipo: string, uri: string) => void;
    practiceLidos: Set<string>;
    marcarLidoPratica: (contentId: string) => void;
}

export const PracticeModeContext = createContext<PracticeModeContextType | null>(null);

export function PracticeModeProvider({ children }: { children: ReactNode }) {
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [practicePhotos, setPracticePhotos] = useState<Record<string, string>>({});
    const [practiceLidos, setPracticeLidos] = useState<Set<string>>(new Set());

    const enterPracticeMode = useCallback(() => {
        setIsPracticeMode(true);
        setPracticePhotos({});
        setPracticeLidos(new Set());
    }, []);

    const exitPracticeMode = useCallback(() => {
        setIsPracticeMode(false);
        setPracticePhotos({});
        setPracticeLidos(new Set());
    }, []);

    const setPracticePhoto = useCallback((tipo: string, uri: string) => {
        setPracticePhotos(prev => ({ ...prev, [tipo]: uri }));
    }, []);

    const marcarLidoPratica = useCallback((contentId: string) => {
        setPracticeLidos(prev => {
            if (prev.has(contentId)) return prev;
            const next = new Set(prev);
            next.add(contentId);
            return next;
        });
    }, []);

    return (
        <PracticeModeContext.Provider value={{ isPracticeMode, enterPracticeMode, exitPracticeMode, practicePhotos, setPracticePhoto, practiceLidos, marcarLidoPratica }}>
            {children}
        </PracticeModeContext.Provider>
    );
}
