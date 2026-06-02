import { createContext, useContext, useCallback } from 'react';

export type SupportedLanguage = 'de' | 'en' | 'fr' | 'it';

export interface TranslationKeys {
  // Navigation & General
  'nav.skipToMain': string;
  'nav.skipToFilters': string;
  'nav.skipToResults': string;
  'common.loading': string;
  'common.error': string;
  'common.retry': string;
  'common.close': string;
  'common.search': string;
  'common.filter': string;
  'common.clear': string;
  'common.reset': string;
  'common.save': string;
  'common.cancel': string;
  'common.yes': string;
  'common.no': string;
  'common.none': string;
  'common.all': string;
  'common.active': string;
  'common.inactive': string;
  'common.required': string;

  // Header & Title
  'header.title': string;
  'header.subtitle': string;
  'header.resultsCount': string;
  'header.resultsCountFiltered': string;

  // Search & Filters
  'search.placeholder': string;
  'search.label': string;
  'search.helpText': string;
  'search.noResults': string;
  'search.noResultsDescription': string;
  'filters.title': string;
  'filters.agencyType': string;
  'filters.agencyType.help': string;
  'filters.pricingModel': string;
  'filters.pricingModel.help': string;
  'filters.platform': string;
  'filters.platform.help': string;
  'filters.focus': string;
  'filters.focus.help': string;
  'filters.status': string;
  'filters.status.help': string;
  'filters.minFollowers': string;
  'filters.minFollowers.help': string;
  'filters.clearAll': string;
  'filters.activeFilters': string;
  'filters.activeCount': string;

  // Table
  'table.caption': string;
  'table.agency': string;
  'table.type': string;
  'table.pricing': string;
  'table.legalForm': string;
  'table.location': string;
  'table.founded': string;
  'table.departments': string;
  'table.focus': string;
  'table.platforms': string;
  'table.references': string;
  'table.conditions': string;
  'table.followers': string;
  'table.status': string;
  'table.sortBy': string;
  'table.sortAsc': string;
  'table.sortDesc': string;
  'table.showDetails': string;

  // Agency Types & Values
  'agency.type.exclusive': string;
  'agency.type.mass': string;
  'agency.pricing.commission': string;
  'agency.pricing.baseFee': string;
  'agency.status.active': string;
  'agency.status.inactive': string;

  // Modal
  'modal.title': string;
  'modal.close': string;
  'modal.visitWebsite': string;
  'modal.basicInfo': string;
  'modal.description': string;
  'modal.departments': string;
  'modal.focusAreas': string;
  'modal.platforms': string;
  'modal.references': string;
  'modal.conditions': string;
  'modal.followerReach': string;
  'modal.notes': string;
  'modal.type': string;
  'modal.pricingModel': string;
  'modal.legalForm': string;
  'modal.location': string;
  'modal.founded': string;
  'modal.status': string;
  'modal.followers': string;

  // Loading & Error States
  'loading.data': string;
  'loading.progress': string;
  'error.loadingData': string;
  'error.parsingData': string;
  'error.noData': string;

  // Accessibility
  'a11y.sortedBy': string;
  'a11y.searchResults': string;
  'a11y.filtersApplied': string;
  'a11y.filtersCleared': string;
  'a11y.modalOpened': string;
  'a11y.modalClosed': string;
  'a11y.focusableElements': string;
  'a11y.keyboardNavigation': string;

  // Language Switcher
  'language.current': string;
  'language.switch': string;
  'language.de': string;
  'language.en': string;
  'language.fr': string;
  'language.it': string;

  // Footer
  'footer.copyright': string;
  'footer.accessibility': string;
  'footer.privacy': string;
  'footer.contact': string;
}

export type TranslationFunction = (key: keyof TranslationKeys, params?: Record<string, string | number>) => string;

export interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationFunction;
  availableLanguages: SupportedLanguage[];
}

export const I18nContext = createContext<I18nContextType | null>(null);

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

// Helper function to get browser language
export const getBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('it')) return 'it';
  if (browserLang.startsWith('en')) return 'en';

  // Default to German for DACH region
  return 'de';
};

const LOCALES: Record<SupportedLanguage, string> = {
  de: 'de-DE',
  en: 'en-US',
  fr: 'fr-FR',
  it: 'it-IT',
};

// Hook for getting localized number formatting
export const useNumberFormat = () => {
  const { language } = useTranslation();
  return useCallback((num: number): string => num.toLocaleString(LOCALES[language]), [language]);
};

// Hook for getting localized date formatting
export const useDateFormat = () => {
  const { language } = useTranslation();
  return useCallback((date: Date): string => date.toLocaleDateString(LOCALES[language]), [language]);
};

// Hook for getting currency formatting
export const useCurrencyFormat = () => {
  const { language } = useTranslation();
  return useCallback(
    (amount: number, currency = 'EUR'): string =>
      new Intl.NumberFormat(LOCALES[language], { style: 'currency', currency }).format(amount),
    [language]
  );
};

// Hook for getting relative time formatting
export const useRelativeTimeFormat = () => {
  const { language } = useTranslation();

  return useCallback((date: Date): string => {
    const rtf = new Intl.RelativeTimeFormat(LOCALES[language], { numeric: 'auto' });
    const now = new Date();
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(diffInSeconds, 'second');
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) {
      return rtf.format(diffInMinutes, 'minute');
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) {
      return rtf.format(diffInHours, 'hour');
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (Math.abs(diffInDays) < 30) {
      return rtf.format(diffInDays, 'day');
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (Math.abs(diffInMonths) < 12) {
      return rtf.format(diffInMonths, 'month');
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(diffInYears, 'year');
  }, [language]);
};
