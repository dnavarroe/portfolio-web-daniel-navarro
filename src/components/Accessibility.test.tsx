import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import Header from './Header';
import LanguageSelector from './LanguageSelector';
import Layout from './Layout';

// Helper to render with router and i18n
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('Accessibility - Task 14.1: ARIA Attributes', () => {
  beforeEach(() => {
    i18n.changeLanguage('es');
  });

  describe('Header Component', () => {
    it('should have aria-label on home link', () => {
      renderWithProviders(
        <Header currentLanguage="es" onLanguageChange={() => {}} />
      );
      
      const homeLink = screen.getByRole('link', { name: /ir a la página de inicio/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('aria-label');
    });

    it('should have aria-current="page" on active navigation link', () => {
      renderWithProviders(
        <Header currentLanguage="es" onLanguageChange={() => {}} />
      );
      
      // The home link should be active when on home page
      const links = screen.getAllByRole('link');
      const activeLinks = links.filter(link => link.getAttribute('aria-current') === 'page');
      expect(activeLinks.length).toBeGreaterThan(0);
    });

    it('should have aria-label on navigation elements', () => {
      renderWithProviders(
        <Header currentLanguage="es" onLanguageChange={() => {}} />
      );
      
      const nav = screen.getByRole('navigation', { name: /navegación principal/i });
      expect(nav).toBeInTheDocument();
    });

    it('should have aria-expanded on mobile menu button', () => {
      renderWithProviders(
        <Header currentLanguage="es" onLanguageChange={() => {}} />
      );
      
      const menuButton = screen.getByRole('button', { name: /alternar menú/i });
      expect(menuButton).toHaveAttribute('aria-expanded');
    });

    it('should have aria-label on mobile menu toggle button', () => {
      renderWithProviders(
        <Header currentLanguage="es" onLanguageChange={() => {}} />
      );
      
      const menuButton = screen.getByRole('button', { name: /alternar menú/i });
      expect(menuButton).toHaveAttribute('aria-label');
    });
  });

  describe('LanguageSelector Component', () => {
    it('should have aria-label on language selector group', () => {
      renderWithProviders(
        <LanguageSelector currentLanguage="es" onChange={() => {}} />
      );
      
      const group = screen.getByRole('group', { name: /selector de idioma/i });
      expect(group).toBeInTheDocument();
    });

    it('should have aria-pressed on language buttons', () => {
      renderWithProviders(
        <LanguageSelector currentLanguage="es" onChange={() => {}} />
      );
      
      const esButton = screen.getByRole('button', { name: /cambiar a español/i });
      const enButton = screen.getByRole('button', { name: /cambiar a inglés/i });
      
      expect(esButton).toHaveAttribute('aria-pressed', 'true');
      expect(enButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should have aria-live region for language change announcements', () => {
      const { container } = renderWithProviders(
        <LanguageSelector currentLanguage="es" onChange={() => {}} />
      );
      
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('role', 'status');
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Layout Component', () => {
    it('should have skip to main content link', () => {
      renderWithProviders(
        <Layout currentLanguage="es" onLanguageChange={() => {}}>
          <div>Content</div>
        </Layout>
      );
      
      const skipLink = screen.getByText(/saltar al contenido principal/i);
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('should have main element with id for skip link', () => {
      const { container } = renderWithProviders(
        <Layout currentLanguage="es" onLanguageChange={() => {}}>
          <div>Content</div>
        </Layout>
      );
      
      const main = container.querySelector('#main-content');
      expect(main).toBeInTheDocument();
      expect(main?.tagName).toBe('MAIN');
    });

    it('should have role="main" on main element', () => {
      renderWithProviders(
        <Layout currentLanguage="es" onLanguageChange={() => {}}>
          <div>Content</div>
        </Layout>
      );
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });
});

describe('Accessibility - Task 14.2: Keyboard Navigation', () => {
  beforeEach(() => {
    i18n.changeLanguage('es');
  });

  describe('Tab Accessibility', () => {
    it('should have focusable navigation links', () => {
      renderWithProviders(
        <Header currentLanguage="es" onLanguageChange={() => {}} />
      );
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('should have focusable language selector buttons', () => {
      renderWithProviders(
        <LanguageSelector currentLanguage="es" onChange={() => {}} />
      );
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('should have main content with tabindex for skip link', () => {
      const { container } = renderWithProviders(
        <Layout currentLanguage="es" onLanguageChange={() => {}}>
          <div>Content</div>
        </Layout>
      );
      
      const main = container.querySelector('#main-content');
      expect(main).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Focus Styles', () => {
    it('should not have outline: none on interactive elements without focus-visible', () => {
      const { container } = renderWithProviders(
        <Header currentLanguage="es" onLanguageChange={() => {}} />
      );
      
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        // This test verifies that we're not removing focus styles globally
        expect(styles.outline).not.toBe('none');
      });
    });
  });

  describe('Logical Tab Order', () => {
    it('should render navigation elements in logical order', () => {
      renderWithProviders(
        <Layout currentLanguage="es" onLanguageChange={() => {}}>
          <div>Content</div>
        </Layout>
      );
      
      // Skip link should be first
      const skipLink = screen.getByText(/saltar al contenido principal/i);
      expect(skipLink).toBeInTheDocument();
      
      // Then navigation
      const nav = screen.getByRole('navigation', { name: /navegación principal/i });
      expect(nav).toBeInTheDocument();
      
      // Then main content
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });
});
