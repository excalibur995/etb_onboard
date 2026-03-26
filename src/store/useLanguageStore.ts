import { create } from 'zustand';
import { locale_language } from '../utils/kv';

interface LanguageStoreState {
  language: string;
  languageContent: Record<string, unknown>;
  setLanguage: (language: string) => void;
  setLanguageContent: (languageContent: Record<string, unknown>) => void;
}

export const useLanguageStore = create<LanguageStoreState>()(set => ({
  // Synchronous MMKV read as initial state — no async rehydration race.
  language: locale_language.getString('language') || 'en',
  languageContent: JSON.parse(
    locale_language.getString('languageContent') || '{}',
  ),
  setLanguage: language => {
    locale_language.set('language', language);
    set({ language });
  },
  setLanguageContent: languageContent => {
    locale_language.set('languageContent', JSON.stringify(languageContent));
    set({ languageContent });
  },
}));
