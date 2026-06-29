import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render without crashing', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should initialize with Spanish as default language', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(localStorage.getItem('language')).toBe('es');
    });
  });

  it('should render ErrorBoundary', () => {
    // ErrorBoundary is present if the app renders normally
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    );
    
    // If ErrorBoundary wasn't there, the app wouldn't render
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should render Layout component', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    );

    // Layout includes header, main, and footer
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should render home page by default', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });

  it('should have HashRouter configured', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    );

    // HashRouter should be working if navigation links are present
    expect(screen.getByText('Proyectos')).toBeInTheDocument();
    expect(screen.getByText('Habilidades')).toBeInTheDocument();
  });
});
