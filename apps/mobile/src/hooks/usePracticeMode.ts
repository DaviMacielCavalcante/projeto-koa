import { useContext } from 'react';
import { PracticeModeContext, PracticeModeContextType } from '../contexts/PracticeMode';

export function usePracticeMode(): PracticeModeContextType {
    const context = useContext(PracticeModeContext);
    if (!context) throw new Error('usePracticeMode deve ser usado dentro de PracticeModeProvider');
    return context;
}
