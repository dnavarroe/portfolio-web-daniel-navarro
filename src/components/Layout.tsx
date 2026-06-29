import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  currentLanguage: 'es' | 'en';
  onLanguageChange: (lang: 'es' | 'en') => void;
}

function Layout({ children, currentLanguage, onLanguageChange }: LayoutProps) {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only"
        aria-label={t('accessibility.skipToMain')}
      >
        {t('accessibility.skipToMain')}
      </a>
      
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
      <main 
        id="main-content"
        className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
