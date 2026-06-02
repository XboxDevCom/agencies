import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { de } from './translations/de';
import { en } from './translations/en';
import { fr } from './translations/fr';
import { it } from './translations/it';
import {
  I18nContext,
  getBrowserLanguage,
  type SupportedLanguage,
  type TranslationFunction,
} from './context';

interface I18nProviderProps {
  children: React.ReactNode;
  defaultLanguage?: SupportedLanguage;
}

const translations = {
  de,
  en,
  fr,
  it,
};

const STORAGE_KEY = 'creator-agencies-language';

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  defaultLanguage,
}) => {
  // Initialize language from localStorage, URL param, or browser/default
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') as SupportedLanguage;
    if (urlLang && Object.keys(translations).includes(urlLang)) {
      return urlLang;
    }

    // Check localStorage
    const storedLang = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
    if (storedLang && Object.keys(translations).includes(storedLang)) {
      return storedLang;
    }

    // Use provided default or browser language
    return defaultLanguage || getBrowserLanguage();
  });

  // Update document language and direction
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr'; // All supported languages are LTR

    // Update URL parameter without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('lang', language);
    window.history.replaceState({}, '', url.toString());
  }, [language]);

  const setLanguage = useCallback((newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
    localStorage.setItem(STORAGE_KEY, newLanguage);

    // Announce language change to screen readers
    const announcement = translations[newLanguage]['language.current'].replace('{{language}}', translations[newLanguage][`language.${newLanguage}` as keyof typeof translations[typeof newLanguage]]);

    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = announcement;
    document.body.appendChild(liveRegion);

    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  }, []);

  // Translation function with parameter interpolation
  const t: TranslationFunction = useCallback((key, params = {}) => {
    const translation = translations[language];
    let text = translation[key] || key;

    // Replace parameters in the format {{paramName}}
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      const placeholder = `{{${paramKey}}}`;
      text = text.replace(new RegExp(placeholder, 'g'), String(paramValue));
    });

    return text;
  }, [language]);

  // Available languages for the language switcher
  const availableLanguages: SupportedLanguage[] = useMemo(() => {
    return Object.keys(translations) as SupportedLanguage[];
  }, []);

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t,
    availableLanguages
  }), [language, setLanguage, t, availableLanguages]);

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};
