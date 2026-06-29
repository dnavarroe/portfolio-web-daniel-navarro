import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import SkillsPage from './SkillsPage';
import ProjectDetailPage from './ProjectDetailPage';
import '../test/setup';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.loading': 'Cargando...',
        'common.error': 'Error',
        'home.title': 'Inicio',
        'projects.title': 'Mis Proyectos',
        'projects.subtitle': 'Portafolio de proyectos',
        'skills.title': 'Habilidades y Experiencia',
        'skills.subtitle': 'Mi formación, experiencia y competencias técnicas',
        'skills.technical': 'Habilidades Técnicas',
        'skills.education': 'Formación Académica',
        'skills.certifications': 'Certificaciones',
        'skills.experience': 'Experiencia Laboral'
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'es'
    }
  })
}));

// Mock ContentLoader
vi.mock('../services/ContentLoader', () => ({
  ContentLoader: {
    loadPersonalInfo: vi.fn().mockResolvedValue({
      name: 'Daniel Navarro',
      photo: '/content/images/profile.jpg',
      summary: {
        es: 'Resumen en español',
        en: 'Summary in English'
      },
      contacts: {
        email: 'test@example.com',
        linkedin: 'https://linkedin.com/in/test',
        github: 'https://github.com/test'
      },
      featuredSkills: []
    }),
    loadProjects: vi.fn().mockResolvedValue([
      {
        id: 'project-1',
        title: { es: 'Proyecto 1', en: 'Project 1' },
        shortDescription: { es: 'Descripción corta', en: 'Short description' },
        fullDescription: { es: 'Descripción completa', en: 'Full description' },
        image: '/content/images/projects/project-1.jpg',
        technologies: ['Python', 'React'],
        date: '2024-01-15',
        featured: true
      }
    ]),
    loadProject: vi.fn().mockResolvedValue({
      id: 'project-1',
      title: { es: 'Proyecto 1', en: 'Project 1' },
      shortDescription: { es: 'Descripción corta', en: 'Short description' },
      fullDescription: { es: 'Descripción completa', en: 'Full description' },
      image: '/content/images/projects/project-1.jpg',
      technologies: ['Python', 'React'],
      date: '2024-01-15',
      featured: true
    }),
    loadSkills: vi.fn().mockResolvedValue({
      technical: {
        categories: [
          {
            id: 'cat-1',
            name: { es: 'Categoría 1', en: 'Category 1' },
            skills: [
              {
                id: 'skill-1',
                name: { es: 'Habilidad 1', en: 'Skill 1' },
                level: 'expert',
                category: 'cat-1'
              }
            ]
          }
        ]
      },
      education: {
        education: [
          {
            id: 'edu-1',
            institution: { es: 'Universidad', en: 'University' },
            degree: { es: 'Licenciatura', en: 'Bachelor' },
            year: '2020'
          }
        ]
      },
      certifications: {
        certifications: [
          {
            id: 'cert-1',
            name: { es: 'Certificación', en: 'Certification' },
            issuer: { es: 'Emisor', en: 'Issuer' },
            year: '2023'
          }
        ]
      },
      experience: {
        experience: [
          {
            id: 'exp-1',
            company: { es: 'Empresa', en: 'Company' },
            position: { es: 'Posición', en: 'Position' },
            period: '2021-2023',
            description: { es: 'Descripción', en: 'Description' }
          }
        ]
      }
    })
  }
}));

// Mock useParams for ProjectDetailPage
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ projectId: 'project-1' }),
    useNavigate: () => vi.fn()
  };
});

describe('SEO Integration Tests', () => {
  beforeEach(() => {
    // Clear document head before each test
    document.head.innerHTML = '';
    document.title = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('HomePage SEO', () => {
    it('should render SEO meta tags on HomePage', async () => {
      render(
        <HelmetProvider>
          <BrowserRouter>
            <HomePage />
          </BrowserRouter>
        </HelmetProvider>
      );

      await waitFor(() => {
        expect(document.title).toContain('Daniel Navarro - Portfolio');
      });

      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription).toBeTruthy();
    });

    it('should include Person structured data on HomePage', async () => {
      render(
        <HelmetProvider>
          <BrowserRouter>
            <HomePage />
          </BrowserRouter>
        </HelmetProvider>
      );

      await waitFor(() => {
        const script = document.querySelector('script[type="application/ld+json"]');
        expect(script).toBeTruthy();
        expect(script?.textContent).toContain('"@type":"Person"');
      });
    });

    it('should include Open Graph tags on HomePage', async () => {
      render(
        <HelmetProvider>
          <BrowserRouter>
            <HomePage />
          </BrowserRouter>
        </HelmetProvider>
      );

      await waitFor(() => {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogType = document.querySelector('meta[property="og:type"]');
        expect(ogTitle).toBeTruthy();
        expect(ogType?.getAttribute('content')).toBe('website');
      });
    });
  });

  describe('ProjectDetailPage SEO', () => {
    it('should render project-specific SEO meta tags', async () => {
      render(
        <HelmetProvider>
          <BrowserRouter>
            <ProjectDetailPage />
          </BrowserRouter>
        </HelmetProvider>
      );

      await waitFor(() => {
        expect(document.title).toContain('Proyecto 1');
      });

      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription?.getAttribute('content')).toBe('Descripción corta');
    });

    it('should include CreativeWork structured data on ProjectDetailPage', async () => {
      render(
        <HelmetProvider>
          <BrowserRouter>
            <ProjectDetailPage />
          </BrowserRouter>
        </HelmetProvider>
      );

      await waitFor(() => {
        const script = document.querySelector('script[type="application/ld+json"]');
        expect(script).toBeTruthy();
        expect(script?.textContent).toContain('"@type":"CreativeWork"');
      });
    });

    it('should set article type for project pages', async () => {
      render(
        <HelmetProvider>
          <BrowserRouter>
            <ProjectDetailPage />
          </BrowserRouter>
        </HelmetProvider>
      );

      await waitFor(() => {
        const ogType = document.querySelector('meta[property="og:type"]');
        expect(ogType?.getAttribute('content')).toBe('article');
      });
    });
  });

  describe('SkillsPage SEO', () => {
    it('should render SEO meta tags on SkillsPage', async () => {
      render(
        <HelmetProvider>
          <BrowserRouter>
            <SkillsPage />
          </BrowserRouter>
        </HelmetProvider>
      );

      await waitFor(() => {
        expect(document.title).toContain('Habilidades y Experiencia');
      });

      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription).toBeTruthy();
    });
  });

  describe('Meta Tags Validation', () => {
    it('should have unique titles for each page', async () => {
      const titles: string[] = [];

      // HomePage
      const { unmount: unmount1 } = render(
        <HelmetProvider>
          <BrowserRouter>
            <HomePage />
          </BrowserRouter>
        </HelmetProvider>
      );
      await waitFor(() => {
        expect(document.title).not.toBe('');
      }, { timeout: 5000 });
      titles.push(document.title);
      unmount1();

      // SkillsPage
      document.title = '';
      document.head.innerHTML = '';
      const { unmount: unmount2 } = render(
        <HelmetProvider>
          <BrowserRouter>
            <SkillsPage />
          </BrowserRouter>
        </HelmetProvider>
      );
      await waitFor(() => {
        expect(document.title).not.toBe('');
      }, { timeout: 5000 });
      titles.push(document.title);
      unmount2();

      // All titles should be different
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
    });

    it('should include required Open Graph tags on all pages', async () => {
      const pages = [
        <HomePage />,
        <SkillsPage />
      ];

      for (const component of pages) {
        document.head.innerHTML = '';
        
        const { unmount } = render(
          <HelmetProvider>
            <BrowserRouter>
              {component}
            </BrowserRouter>
          </HelmetProvider>
        );

        // Wait for Open Graph tags to be rendered
        await waitFor(() => {
          const ogTitle = document.querySelector('meta[property="og:title"]');
          const ogDescription = document.querySelector('meta[property="og:description"]');
          const ogImage = document.querySelector('meta[property="og:image"]');
          const ogUrl = document.querySelector('meta[property="og:url"]');

          expect(ogTitle).toBeTruthy();
          expect(ogDescription).toBeTruthy();
          expect(ogImage).toBeTruthy();
          expect(ogUrl).toBeTruthy();
        }, { timeout: 10000 });

        unmount();
      }
    }, 25000); // Increase test timeout to 25 seconds
  });
});
