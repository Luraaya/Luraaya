/**
 * Language Selector Component
 * Dropdown component for selecting application language
 * Works on both desktop and mobile with responsive design
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import { ChevronDown, Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'header' | 'footer' | 'dashboard' | 'mobile';
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'header',
  className = '' 
}) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Language options with display names and flags
  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' }
  ];

  // Get current language display info
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle language selection
  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
  };

  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'header':
        return {
          button: 'flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-purple-600 transition-colors rounded-md hover:bg-gray-50',
          dropdown: 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200',
          option: 'flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer transition-colors'
        };
      case 'mobile':
        return {
          button: 'flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-purple-600 transition-colors rounded-md hover:bg-gray-50',
          dropdown: 'absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200',
          option: 'flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer transition-colors'
        };
      case 'footer':
        return {
          button: 'flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800',
          dropdown: 'absolute bottom-full right-0 mb-2 w-48 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700',
          option: 'flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors'
        };
      case 'dashboard':
        return {
          button: 'flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100',
          dropdown: 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200',
          option: 'flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer transition-colors'
        };
      default:
        return {
          button: 'flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-purple-600 transition-colors rounded-md hover:bg-gray-50',
          dropdown: 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200',
          option: 'flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer transition-colors'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Language selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.button}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe size={16} />
        <span className="inline">{currentLang.name}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Language dropdown */}
      {isOpen && (
        <div className={styles.dropdown}>
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`${styles.option} ${
                  currentLanguage === language.code 
                    ? variant === 'footer' 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-purple-50 text-purple-700'
                    : ''
                } w-full text-left`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {currentLanguage === language.code && (
                  <span className="ml-auto">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;