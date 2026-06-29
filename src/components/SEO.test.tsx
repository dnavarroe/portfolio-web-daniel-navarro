import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './SEO';
import '../test/setup';

// Mock useTranslation
const mockT = (key: string) => {
  const translations: Record<string, string> = {
    'meta.description': 'Test portfolio description'
  };
  return translations[key] || key;
};

const mockI18n = {
  language: 'es'
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: mockI18n
  })
}));

describe('SEO Component', () => {
  beforeEach(() => {
    // Reset language and document before each test
    mockI18n.language = 'es';
    document.head.innerHTML = '';
    document.title = '';
  });

  it('should render custom title when provided', async () => {
    render(
      <HelmetProvider>
        <SEO title="Custom Page" />
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(document.title).toContain('Custom Page');
      expect(document.title).toContain('Daniel Navarro - Portfolio');
    });
  });

  it('should render custom description when provided', async () => {
    render(
      <HelmetProvider>
        <SEO description="Custom description for testing" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription?.getAttribute('content')).toBe('Custom description for testing');
    });
  });

  it('should render Open Graph meta tags', async () => {
    render(
      <HelmetProvider>
        <SEO 
          title="Test Page"
          description="Test description"
          image="https://example.com/image.jpg"
        />
      </HelmetProvider>
    );

    await waitFor(() => {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogType = document.querySelector('meta[property="og:type"]');

      expect(ogTitle?.getAttribute('content')).toContain('Test Page');
      expect(ogDescription?.getAttribute('content')).toBe('Test description');
      expect(ogImage?.getAttribute('content')).toBe('https://example.com/image.jpg');
      expect(ogType?.getAttribute('content')).toBe('website');
    });
  });

  it('should render Twitter Card meta tags', async () => {
    render(
      <HelmetProvider>
        <SEO 
          title="Test Page"
          description="Test description"
          image="https://example.com/image.jpg"
        />
      </HelmetProvider>
    );

    await waitFor(() => {
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');

      expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
      expect(twitterTitle?.getAttribute('content')).toContain('Test Page');
      expect(twitterDescription?.getAttribute('content')).toBe('Test description');
      expect(twitterImage?.getAttribute('content')).toBe('https://example.com/image.jpg');
    });
  });

  it('should set correct locale for Spanish', async () => {
    mockI18n.language = 'es';
    
    render(
      <HelmetProvider>
        <SEO />
      </HelmetProvider>
    );

    await waitFor(() => {
      const ogLocale = document.querySelector('meta[property="og:locale"]');
      expect(ogLocale?.getAttribute('content')).toBe('es_ES');
    });
  });

  it('should set correct locale for English', async () => {
    mockI18n.language = 'en';
    
    render(
      <HelmetProvider>
        <SEO />
      </HelmetProvider>
    );

    await waitFor(() => {
      const ogLocale = document.querySelector('meta[property="og:locale"]');
      expect(ogLocale?.getAttribute('content')).toBe('en_US');
    });
  });

  it('should render structured data when provided', async () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Daniel Navarro"
    };

    render(
      <HelmetProvider>
        <SEO structuredData={structuredData} />
      </HelmetProvider>
    );

    await waitFor(() => {
      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();
      expect(script?.textContent).toContain('"@type":"Person"');
      expect(script?.textContent).toContain('"name":"Daniel Navarro"');
    });
  });

  it('should set article type when specified', async () => {
    render(
      <HelmetProvider>
        <SEO type="article" />
      </HelmetProvider>
    );

    await waitFor(() => {
      const ogType = document.querySelector('meta[property="og:type"]');
      expect(ogType?.getAttribute('content')).toBe('article');
    });
  });

  it('should use default image when no image provided', async () => {
    render(
      <HelmetProvider>
        <SEO />
      </HelmetProvider>
    );

    await waitFor(() => {
      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage?.getAttribute('content')).toContain('/content/images/og-image.jpg');
    });
  });

  it('should set html lang attribute based on current language', async () => {
    mockI18n.language = 'en';
    
    render(
      <HelmetProvider>
        <SEO />
      </HelmetProvider>
    );

    await waitFor(() => {
      const htmlLang = document.documentElement.getAttribute('lang');
      expect(htmlLang).toBe('en');
    });
  });
});
