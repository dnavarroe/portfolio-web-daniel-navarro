import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import LanguageSelector from './LanguageSelector';

describe('LanguageSelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    localStorage.clear();
  });

  it('should render both language buttons', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSelector currentLanguage="es" onChange={mockOnChange} />
      </I18nextProvider>
    );

    expect(screen.getByText('ES')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('should highlight the current language', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSelector currentLanguage="es" onChange={mockOnChange} />
      </I18nextProvider>
    );

    const esButton = screen.getByText('ES');
    const enButton = screen.getByText('EN');

    expect(esButton).toHaveClass('bg-primary-600', 'text-white');
    expect(enButton).toHaveClass('bg-gray-100', 'text-gray-700');
  });

  it('should call onChange when clicking a language button', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSelector currentLanguage="es" onChange={mockOnChange} />
      </I18nextProvider>
    );

    const enButton = screen.getByText('EN');
    fireEvent.click(enButton);

    expect(mockOnChange).toHaveBeenCalledWith('en');
  });

  it('should persist language preference in localStorage', () => {
    const { rerender } = render(
      <I18nextProvider i18n={i18n}>
        <LanguageSelector currentLanguage="es" onChange={mockOnChange} />
      </I18nextProvider>
    );

    expect(localStorage.getItem('language')).toBe('es');

    rerender(
      <I18nextProvider i18n={i18n}>
        <LanguageSelector currentLanguage="en" onChange={mockOnChange} />
      </I18nextProvider>
    );

    expect(localStorage.getItem('language')).toBe('en');
  });

  it('should have proper ARIA attributes', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSelector currentLanguage="es" onChange={mockOnChange} />
      </I18nextProvider>
    );

    const esButton = screen.getByLabelText('Switch to Spanish');
    const enButton = screen.getByLabelText('Switch to English');

    expect(esButton).toHaveAttribute('aria-pressed', 'true');
    expect(enButton).toHaveAttribute('aria-pressed', 'false');
  });
});
