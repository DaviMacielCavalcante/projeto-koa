import { createContext, useState, ReactNode, useCallback } from 'react';

export interface PracticeModeContextType {
    isPracticeMode: boolean;
    enterPracticeMode: () => void;
    exitPracticeMode: () => void;
    practicePhotos: Record<string, string>;
    setPracticePhoto: (tipo: string, uri: string) => void;
}

export const PracticeModeContext = createContext<PracticeModeContextType | null>(null);

export function PracticeModeProvider({ children }: { children: ReactNode }) {
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [practicePhotos, setPracticePhotos] = useState<Record<string, string>>({});

    const enterPracticeMode = useCallback(() => {
        setIsPracticeMode(true);
        setPracticePhotos({});
    }, []);

    const exitPracticeMode = useCallback(() => {
        setIsPracticeMode(false);
        setPracticePhotos({});
    }, []);

    const setPracticePhoto = useCallback((tipo: string, uri: string) => {
        setPracticePhotos(prev => ({ ...prev, [tipo]: uri }));
    }, []);

    return (
        <PracticeModeContext.Provider value={{ isPracticeMode, enterPracticeMode, exitPracticeMode, practicePhotos, setPracticePhoto }}>
            {children}
        </PracticeModeContext.Provider>
    );
}
