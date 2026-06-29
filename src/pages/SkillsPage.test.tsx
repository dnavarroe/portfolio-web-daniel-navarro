import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import i18n from '../i18n/config';
import SkillsPage from './SkillsPage';
import { ContentLoader } from '../services/ContentLoader';
import type { SkillsData } from '../types';
import fc from 'fast-check';

// Mock ContentLoader
vi.mock('../services/ContentLoader');

describe('SkillsPage', () => {
  beforeEach(() => {
    i18n.changeLanguage('es');
    vi.clearAllMocks();
  });

  const mockSkillsData: SkillsData = {
    technical: {
      categories: [
        {
          id: 'data-science',
          name: { es: 'Ciencia de Datos', en: 'Data Science' },
          skills: [
            {
              id: 'python',
              name: { es: 'Python', en: 'Python' },
              category: 'data-science',
              level: 'expert',
              icon: '🐍',
            },
            {
              id: 'r',
              name: { es: 'R', en: 'R' },
              category: 'data-science',
              level: 'advanced',
            },
          ],
        },
        {
          id: 'web-dev',
          name: { es: 'Desarrollo Web', en: 'Web Development' },
          skills: [
            {
              id: 'react',
              name: { es: 'React', en: 'React' },
              category: 'web-dev',
              level: 'intermediate',
            },
          ],
        },
      ],
    },
    education: {
      education: [
        {
          id: 'edu-1',
          institution: { es: 'Universidad Nacional', en: 'National University' },
          degree: { es: 'Licenciatura en Ciencias', en: 'Bachelor of Science' },
          year: '2020',
        },
      ],
    },
    certifications: {
      certifications: [
        {
          id: 'cert-1',
          name: { es: 'Certificación Data Science', en: 'Data Science Certification' },
          issuer: { es: 'Coursera', en: 'Coursera' },
          year: '2023',
        },
      ],
    },
    experience: {
      experience: [
        {
          id: 'exp-1',
          company: { es: 'Tech Corp', en: 'Tech Corp' },
          position: { es: 'Analista de Datos', en: 'Data Analyst' },
          period: '2021-2023',
          description: { es: 'Análisis de datos', en: 'Data analysis' },
        },
      ],
    },
  };

  const renderSkillsPage = () => {
    return render(
      <HelmetProvider>
        <I18nextProvider i18n={i18n}>
          <SkillsPage />
        </I18nextProvider>
      </HelmetProvider>
    );
  };

  describe('Loading State', () => {
    it('should display loading indicator while fetching data', () => {
      vi.mocked(ContentLoader.loadSkills).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderSkillsPage();

      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when loading fails', async () => {
      const errorMessage = 'Failed to load skills data';
      vi.mocked(ContentLoader.loadSkills).mockRejectedValue(
        new Error(errorMessage)
      );

      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Error al cargar el contenido')).toBeInTheDocument();
      });
    });
  });

  describe('Successful Data Loading', () => {
    beforeEach(() => {
      vi.mocked(ContentLoader.loadSkills).mockResolvedValue(mockSkillsData);
    });

    it('should display page title and subtitle', async () => {
      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Habilidades y Experiencia')).toBeInTheDocument();
        expect(screen.getByText(i18n.t('skills.subtitle'))).toBeInTheDocument();
      });
    });

    it('should display technical skills section', async () => {
      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Habilidades Técnicas')).toBeInTheDocument();
      });
    });

    it('should display all skill categories', async () => {
      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Ciencia de Datos')).toBeInTheDocument();
        expect(screen.getByText('Desarrollo Web')).toBeInTheDocument();
      });
    });

    it('should display all skills within categories', async () => {
      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Python')).toBeInTheDocument();
        expect(screen.getByText('R')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
      });
    });

    it('should display education section', async () => {
      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Formación Académica')).toBeInTheDocument();
        expect(screen.getByText('Universidad Nacional')).toBeInTheDocument();
        expect(screen.getByText('Licenciatura en Ciencias')).toBeInTheDocument();
        expect(screen.getByText('2020')).toBeInTheDocument();
      });
    });

    it('should display certifications section', async () => {
      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Certificaciones')).toBeInTheDocument();
        expect(screen.getByText('Certificación Data Science')).toBeInTheDocument();
        expect(screen.getByText('Coursera')).toBeInTheDocument();
        expect(screen.getByText('2023')).toBeInTheDocument();
      });
    });

    it('should display experience section', async () => {
      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Experiencia Laboral')).toBeInTheDocument();
        expect(screen.getByText('Tech Corp')).toBeInTheDocument();
        expect(screen.getByText('Analista de Datos')).toBeInTheDocument();
        expect(screen.getByText('2021-2023')).toBeInTheDocument();
        expect(screen.getByText('Análisis de datos')).toBeInTheDocument();
      });
    });
  });

  describe('Localization', () => {
    beforeEach(() => {
      vi.mocked(ContentLoader.loadSkills).mockResolvedValue(mockSkillsData);
    });

    it('should display content in Spanish when language is es', async () => {
      i18n.changeLanguage('es');
      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Ciencia de Datos')).toBeInTheDocument();
        expect(screen.getByText('Universidad Nacional')).toBeInTheDocument();
        expect(screen.getByText('Analista de Datos')).toBeInTheDocument();
      });
    });

    it('should display content in English when language is en', async () => {
      i18n.changeLanguage('en');
      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Data Science')).toBeInTheDocument();
        expect(screen.getByText('National University')).toBeInTheDocument();
        expect(screen.getByText('Data Analyst')).toBeInTheDocument();
      });
    });
  });

  describe('Section Organization', () => {
    beforeEach(() => {
      vi.mocked(ContentLoader.loadSkills).mockResolvedValue(mockSkillsData);
    });

    it('should have clearly differentiated sections with proper headings', async () => {
      renderSkillsPage();

      await waitFor(() => {
        const technicalHeading = screen.getByRole('heading', { name: 'Habilidades Técnicas' });
        const educationHeading = screen.getByRole('heading', { name: 'Formación Académica' });
        const certificationsHeading = screen.getByRole('heading', { name: 'Certificaciones' });
        const experienceHeading = screen.getByRole('heading', { name: 'Experiencia Laboral' });

        expect(technicalHeading).toBeInTheDocument();
        expect(educationHeading).toBeInTheDocument();
        expect(certificationsHeading).toBeInTheDocument();
        expect(experienceHeading).toBeInTheDocument();
      });
    });

    it('should use semantic HTML with proper ARIA labels', async () => {
      vi.mocked(ContentLoader.loadSkills).mockResolvedValue(mockSkillsData);
      
      renderSkillsPage();

      await waitFor(() => {
        const technicalSection = screen.getByRole('region', { name: 'Habilidades Técnicas' });
        const educationSection = screen.getByRole('region', { name: 'Formación Académica' });
        const certificationsSection = screen.getByRole('region', { name: 'Certificaciones' });
        const experienceSection = screen.getByRole('region', { name: 'Experiencia Laboral' });

        expect(technicalSection).toBeInTheDocument();
        expect(educationSection).toBeInTheDocument();
        expect(certificationsSection).toBeInTheDocument();
        expect(experienceSection).toBeInTheDocument();
      });
    });
  });

  describe('Grid Layout', () => {
    beforeEach(() => {
      vi.mocked(ContentLoader.loadSkills).mockResolvedValue(mockSkillsData);
    });

    it('should render skills in a grid layout', async () => {
      const { container } = renderSkillsPage();

      await waitFor(() => {
        const grids = container.querySelectorAll('.grid');
        expect(grids.length).toBeGreaterThan(0);
      });
    });

    it('should render certifications in a grid layout', async () => {
      renderSkillsPage();

      await waitFor(() => {
        const certSection = screen.getByRole('heading', { name: 'Certificaciones' }).parentElement;
        const grid = certSection?.querySelector('.grid');
        expect(grid).toBeInTheDocument();
      });
    });
  });

  describe('Bug Condition Exploration - Grid Query Before Data Load', () => {
    /**
     * **Validates: Requirements 2.1, 2.2**
     * 
     * Property 1: Bug Condition - Grid Query Before Data Load
     * 
     * This test explores the bug condition where querying for `.grid` elements
     * immediately after render (before async data loading completes) returns
     * an empty NodeList.
     * 
     * CRITICAL: This test is EXPECTED TO FAIL on unfixed code.
     * The failure confirms the bug exists.
     * 
     * Expected counterexample: querySelectorAll('.grid') returns NodeList with length 0
     * when query executes before ContentLoader.loadSkills resolves and component renders.
     */
    it('Property 1: Grid elements should be found after data loads', async () => {
      await fc.assert(
        fc.asyncProperty(fc.constant(mockSkillsData), async (skillsData) => {
          // Setup: Mock ContentLoader to return skills data
          vi.mocked(ContentLoader.loadSkills).mockResolvedValue(skillsData);
          
          // Render the component
          const { container, unmount } = renderSkillsPage();
          
          // Wait for data to load by checking for the technical skills heading
          await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Habilidades Técnicas' })).toBeInTheDocument();
          });
          
          // Now query for grid elements after data has loaded
          const grids = container.querySelectorAll('.grid');
          
          // This assertion verifies the EXPECTED behavior:
          // Grid elements SHOULD be found after data loads
          expect(grids.length).toBeGreaterThan(0);
          
          // Clean up after each run
          unmount();
        }),
        { numRuns: 10 }
      );
    });
  });

  describe('ContentLoader Integration', () => {
    it('should call ContentLoader.loadSkills on mount', async () => {
      vi.mocked(ContentLoader.loadSkills).mockResolvedValue(mockSkillsData);

      renderSkillsPage();

      await waitFor(() => {
        expect(ContentLoader.loadSkills).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle empty skills data gracefully', async () => {
      const emptyData: SkillsData = {
        technical: { categories: [] },
        education: { education: [] },
        certifications: { certifications: [] },
        experience: { experience: [] },
      };

      vi.mocked(ContentLoader.loadSkills).mockResolvedValue(emptyData);

      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Habilidades Técnicas')).toBeInTheDocument();
      });
    });
  });

  describe('Preservation Property - Other Tests Unchanged', () => {
    /**
     * **Validates: Requirements 3.1, 3.2, 3.3**
     * 
     * Property 2: Preservation - Other Tests Unchanged
     * 
     * This test verifies that all non-grid-layout tests continue to pass
     * with the current implementation on UNFIXED code. This establishes
     * the baseline behavior that must be preserved after the fix.
     * 
     * IMPORTANT: This test is EXPECTED TO PASS on unfixed code.
     * The pass confirms the baseline behavior to preserve.
     * 
     * Specifically, this test verifies:
     * - The certifications grid test continues to work with its current query pattern
     * - All other SkillsPage tests pass without modification
     * - The component continues to use Tailwind CSS utility classes
     */
    it('Property 2: Certifications grid test continues to work correctly', async () => {
      vi.mocked(ContentLoader.loadSkills).mockResolvedValue(mockSkillsData);
      
      renderSkillsPage();

      // This is the WORKING pattern from the certifications grid test
      // It uses getByRole which implicitly waits for the heading to render
      await waitFor(() => {
        const certSection = screen.getByRole('heading', { name: 'Certificaciones' }).parentElement;
        const grid = certSection?.querySelector('.grid');
        expect(grid).toBeInTheDocument();
      });
      
      // Verify the grid uses Tailwind CSS utility classes
      await waitFor(() => {
        const certSection = screen.getByRole('heading', { name: 'Certificaciones' }).parentElement;
        const grid = certSection?.querySelector('.grid');
        expect(grid?.className).toMatch(/grid/);
      });
    });

    it('Property 2: All data loading and rendering tests continue to pass', async () => {
      vi.mocked(ContentLoader.loadSkills).mockResolvedValue(mockSkillsData);
      
      renderSkillsPage();

      // Verify all sections render correctly (baseline behavior)
      await waitFor(() => {
        // Page title and subtitle
        expect(screen.getByText('Habilidades y Experiencia')).toBeInTheDocument();
        expect(screen.getByText(i18n.t('skills.subtitle'))).toBeInTheDocument();
        
        // Technical skills section
        expect(screen.getByText('Habilidades Técnicas')).toBeInTheDocument();
        expect(screen.getByText('Ciencia de Datos')).toBeInTheDocument();
        expect(screen.getByText('Desarrollo Web')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();
        expect(screen.getByText('R')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        
        // Education section
        expect(screen.getByText('Formación Académica')).toBeInTheDocument();
        expect(screen.getByText('Universidad Nacional')).toBeInTheDocument();
        expect(screen.getByText('Licenciatura en Ciencias')).toBeInTheDocument();
        
        // Certifications section
        expect(screen.getByText('Certificaciones')).toBeInTheDocument();
        expect(screen.getByText('Certificación Data Science')).toBeInTheDocument();
        
        // Experience section
        expect(screen.getByText('Experiencia Laboral')).toBeInTheDocument();
        expect(screen.getByText('Tech Corp')).toBeInTheDocument();
        expect(screen.getByText('Analista de Datos')).toBeInTheDocument();
      });
    });

    it('Property 2: Section organization with semantic HTML continues to work', async () => {
      vi.mocked(ContentLoader.loadSkills).mockResolvedValue(mockSkillsData);
      
      renderSkillsPage();

      // Verify semantic HTML structure (baseline behavior)
      await waitFor(() => {
        const technicalHeading = screen.getByRole('heading', { name: 'Habilidades Técnicas' });
        const educationHeading = screen.getByRole('heading', { name: 'Formación Académica' });
        const certificationsHeading = screen.getByRole('heading', { name: 'Certificaciones' });
        const experienceHeading = screen.getByRole('heading', { name: 'Experiencia Laboral' });

        expect(technicalHeading).toBeInTheDocument();
        expect(educationHeading).toBeInTheDocument();
        expect(certificationsHeading).toBeInTheDocument();
        expect(experienceHeading).toBeInTheDocument();
        
        // Verify ARIA labels - use the actual heading text, not the id
        const technicalSection = screen.getByRole('region', { name: 'Habilidades Técnicas' });
        const educationSection = screen.getByRole('region', { name: 'Formación Académica' });
        const certificationsSection = screen.getByRole('region', { name: 'Certificaciones' });
        const experienceSection = screen.getByRole('region', { name: 'Experiencia Laboral' });

        expect(technicalSection).toBeInTheDocument();
        expect(educationSection).toBeInTheDocument();
        expect(certificationsSection).toBeInTheDocument();
        expect(experienceSection).toBeInTheDocument();
      });
    });

    it('Property 2: Localization continues to work correctly', async () => {
      vi.mocked(ContentLoader.loadSkills).mockResolvedValue(mockSkillsData);
      
      // Test Spanish localization
      i18n.changeLanguage('es');
      const { unmount } = renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Ciencia de Datos')).toBeInTheDocument();
        expect(screen.getByText('Universidad Nacional')).toBeInTheDocument();
        expect(screen.getByText('Analista de Datos')).toBeInTheDocument();
      });
      
      unmount();
      
      // Test English localization
      i18n.changeLanguage('en');
      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Data Science')).toBeInTheDocument();
        expect(screen.getByText('National University')).toBeInTheDocument();
        expect(screen.getByText('Data Analyst')).toBeInTheDocument();
      });
    });

    it('Property 2: Error and loading states continue to work', async () => {
      // Test loading state
      vi.mocked(ContentLoader.loadSkills).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { unmount } = renderSkillsPage();
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
      
      unmount();
      vi.clearAllMocks();
      
      // Test error state
      const errorMessage = 'Failed to load skills data';
      vi.mocked(ContentLoader.loadSkills).mockRejectedValue(
        new Error(errorMessage)
      );

      renderSkillsPage();

      await waitFor(() => {
        expect(screen.getByText('Error al cargar el contenido')).toBeInTheDocument();
      });
    });
  });
});
