import { describe, it, expect, beforeEach } from 'vitest';
import i18n from './config';

/**
 * Tests for i18n configuration
 * Validates Requirements 6.1, 6.5, 6.6
 */
describe('i18n Configuration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should have Spanish as fallback language', () => {
    const fallbackLng = i18n.options.fallbackLng;
    // fallbackLng can be a string or an array
    if (Array.isArray(fallbackLng)) {
      expect(fallbackLng).toContain('es');
    } else {
      expect(fallbackLng).toBe('es');
    }
  });

  it('should have both Spanish and English resources loaded', () => {
    const languages = Object.keys(i18n.options.resources || {});
    expect(languages).toContain('es');
    expect(languages).toContain('en');
  });

  it('should configure detection order with localStorage first, then navigator', () => {
    const detectionOptions = i18n.options.detection;
    expect(detectionOptions?.order).toEqual(['localStorage', 'navigator']);
  });

  it('should configure localStorage as cache', () => {
    const detectionOptions = i18n.options.detection;
    expect(detectionOptions?.caches).toContain('localStorage');
  });

  it('should have interpolation escapeValue set to false', () => {
    expect(i18n.options.interpolation?.escapeValue).toBe(false);
  });

  it('should persist language preference in localStorage', async () => {
    // Change language to English
    await i18n.changeLanguage('en');
    
    // Check that it's stored in localStorage
    const storedLanguage = localStorage.getItem('i18nextLng');
    expect(storedLanguage).toBe('en');
  });

  it('should persist language preference when changing to Spanish', async () => {
    // Change language to Spanish
    await i18n.changeLanguage('es');
    
    // Check that it's stored in localStorage
    const storedLanguage = localStorage.getItem('i18nextLng');
    expect(storedLanguage).toBe('es');
  });
});
