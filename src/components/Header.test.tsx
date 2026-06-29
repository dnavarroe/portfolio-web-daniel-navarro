import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import Header from './Header';

const renderHeader = (currentLanguage: 'es' | 'en' = 'es') => {
  const mockOnLanguageChange = vi.fn();
  return {
    ...render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Header
            currentLanguage={currentLanguage}
            onLanguageChange={mockOnLanguageChange}
          />
        </I18nextProvider>
      </BrowserRouter>
    ),
    mockOnLanguageChange,
  };
};

describe('Header', () => {
  it('should render the app title', () => {
    renderHeader();
    expect(screen.getByText('Portfolio - Daniel Navarro')).toBeInTheDocument();
  });

  it('should render all navigation links', () => {
    renderHeader();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  it('should render language selector', () => {
    renderHeader();
    expect(screen.getAllByText('ES').length).toBeGreaterThan(0);
    expect(screen.getAllByText('EN').length).toBeGreaterThan(0);
  });

  it('should toggle mobile menu when hamburger button is clicked', () => {
    renderHeader();
    
    // Mobile menu should be hidden initially
    const mobileNav = screen.queryByRole('navigation', { name: 'Mobile navigation' });
    expect(mobileNav).not.toBeInTheDocument();

    // Click hamburger button
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(menuButton);

    // Mobile menu should be visible
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();

    // Click again to close
    fireEvent.click(menuButton);

    // Mobile menu should be hidden again
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });

  it('should have proper semantic HTML', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header element
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('should have accessible mobile menu button', () => {
    renderHeader();
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });
});
