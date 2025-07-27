import React, { useState, useRef, useEffect } from 'react';
import { useTranslation, SupportedLanguage } from '../i18n/I18nProvider.tsx';
import { AccessibleButton } from './Accessibility.tsx';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage, availableLanguages, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Language display names and flags
  const languageInfo = {
    de: { name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
    en: { name: 'English', flag: '🇺🇸', nativeName: 'English' },
    fr: { name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
    it: { name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano' }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          const firstOption = dropdownRef.current?.querySelector('[role="menuitem"]') as HTMLElement;
          firstOption?.focus();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const currentLanguageInfo = languageInfo[language];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <AccessibleButton
        onClick={handleToggle}
        variant="secondary"
        size="sm"
        ariaLabel={t('language.current', { language: currentLanguageInfo.nativeName })}
        className="flex items-center space-x-2 min-w-[120px]"
      >
        <span role="img" aria-hidden="true" className="text-lg">
          {currentLanguageInfo.flag}
        </span>
        <span className="hidden sm:inline">{currentLanguageInfo.nativeName}</span>
        <span className="sm:hidden">{language.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </AccessibleButton>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 animate-fade-in"
          role="menu"
          aria-labelledby="language-menu-button"
        >
          <div className="py-1">
            {availableLanguages.map((lang, index) => {
              const langInfo = languageInfo[lang];
              const isSelected = lang === language;
              
              return (
                <button
                  key={lang}
                  role="menuitem"
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center space-x-3 ${
                    isSelected
                      ? 'bg-green-900 text-green-200'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } focus:outline-none focus:bg-gray-700 focus:text-white`}
                  onClick={() => handleLanguageChange(lang)}
                  onKeyDown={(e) => {
                    switch (e.key) {
                      case 'ArrowDown':
                        e.preventDefault();
                        const nextButton = e.currentTarget.nextElementSibling as HTMLElement;
                        nextButton?.focus();
                        break;
                      case 'ArrowUp':
                        e.preventDefault();
                        const prevButton = e.currentTarget.previousElementSibling as HTMLElement;
                        prevButton?.focus();
                        break;
                      case 'Home':
                        e.preventDefault();
                        const firstButton = dropdownRef.current?.querySelector('[role="menuitem"]') as HTMLElement;
                        firstButton?.focus();
                        break;
                      case 'End':
                        e.preventDefault();
                        const buttons = dropdownRef.current?.querySelectorAll('[role="menuitem"]');
                        const lastButton = buttons?.[buttons.length - 1] as HTMLElement;
                        lastButton?.focus();
                        break;
                    }
                  }}
                  aria-label={t('language.switch', { language: langInfo.nativeName })}
                >
                  <span role="img" aria-hidden="true" className="text-lg">
                    {langInfo.flag}
                  </span>
                  <span className="flex-1">{langInfo.nativeName}</span>
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
