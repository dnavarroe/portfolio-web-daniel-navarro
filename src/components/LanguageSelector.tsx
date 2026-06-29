import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface LanguageSelectorProps {
  currentLanguage: 'es' | 'en';
  onChange: (lang: 'es' | 'en') => void;
}

function LanguageSelector({ currentLanguage, onChange }: LanguageSelectorProps) {
  const { i18n, t } = useTranslation();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Persist language preference in localStorage
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const handleLanguageChange = (lang: 'es' | 'en') => {
    i18n.changeLanguage(lang);
    onChange(lang);
    
    // Announce language change to screen readers
    const languageName = lang === 'es' ? 'Español' : 'English';
    setAnnouncement(t('accessibility.languageChanged', { language: languageName }));
    
    // Clear announcement after a short delay
    setTimeout(() => setAnnouncement(''), 1000);
  };

  return (
    <>
      <div className="flex items-center gap-2" role="group" aria-label={t('accessibility.languageSelector')}>
        <button
          onClick={() => handleLanguageChange('es')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
            currentLanguage === 'es'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label={t('accessibility.switchToSpanish')}
          aria-pressed={currentLanguage === 'es'}
        >
          ES
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
            currentLanguage === 'en'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label={t('accessibility.switchToEnglish')}
          aria-pressed={currentLanguage === 'en'}
        >
          EN
        </button>
      </div>
      {/* Live region for announcing language changes */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </>
  );
}

export default LanguageSelector;
