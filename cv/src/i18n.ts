import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import ukTranslations from './locales/uk.json';

i18next.use(LanguageDetector).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    uk: {
      translation: ukTranslations,
    },
  },
  fallbackLng: 'en',
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
