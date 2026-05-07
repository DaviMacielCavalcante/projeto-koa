import { createContext, useState, ReactNode, useCallback } from 'react';

export interface PracticeModeContextType {
  isPracticeMode: boolean;
  enterPracticeMode: () => void;
  exitPracticeMode: () => void;
  practicePhotos: Record<string, string>;
  setPracticePhoto: (tipo: string, uri: string) => void;
}

export const PracticeModeContext = createContext<PracticeModeContextType | null>(null);

interface PracticeModeProviderProps {
  children: ReactNode;
}

export const PracticeModeProvider = ({ children }: PracticeModeProviderProps) => {
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

  const value: PracticeModeContextType = {
    isPracticeMode,
    enterPracticeMode,
    exitPracticeMode,
    practicePhotos,
    setPracticePhoto,
  };

  return (
    <PracticeModeContext.Provider value={value}>
      {children}
    </PracticeModeContext.Provider>
  );
};
