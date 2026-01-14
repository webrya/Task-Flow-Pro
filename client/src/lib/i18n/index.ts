import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import en from './en.json';
import el from './el.json';

type Language = 'en' | 'el';

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const translations: Record<Language, any> = { en, el };

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language: Language) => set({ language }),
      t: (path: string) => {
        const keys = path.split('.');
        let result = translations[get().language];
        for (const key of keys) {
          if (result && result[key]) {
            result = result[key];
          } else {
            return path;
          }
        }
        return typeof result === 'string' ? result : path;
      },
    }),
    { name: 'pm-i18n' }
  )
);
