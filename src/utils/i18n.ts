import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import en from '../locales/en.json';
import id from '../locales/id.json';
import { useLanguageStore } from '../store/useLanguageStore';

const deviceLocale = getLocales()[0]?.languageCode ?? 'en';

export const injectIntoI18next = (
  lang: string,
  contents: Record<string, unknown>,
) => {
  for (const [namespace, translations] of Object.entries(contents)) {
    i18n.removeResourceBundle(lang, namespace);
    i18n.addResourceBundle(lang, namespace, translations, false, true);
  }
  i18n.changeLanguage(lang);
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: { en, id },
  lng: deviceLocale,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Hydrate from MMKV cache on subsequent launches.
const { language, languageContent } = useLanguageStore.getState();
if (Object.keys(languageContent).length > 0) {
  injectIntoI18next(language, languageContent);
}

export default i18n;
