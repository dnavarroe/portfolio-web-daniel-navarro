import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ProjectDetailPage from './ProjectDetailPage';
import { ContentLoader } from '../services/ContentLoader';
import type { Project } from '../types';

// Mock ContentLoader
vi.mock('../services/ContentLoader', () => ({
  ContentLoader: {
    loadProject: vi.fn(),
  },
}));

// Mock OptimizedImage component
vi.mock('../components/OptimizedImage', () => ({
  OptimizedImage: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} data-testid="optimized-image" />
  ),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
    },
  }),
}));

const mockProject: Project = {
  id: 'test-project',
  title: {
    es: 'Proyecto de Prueba',
    en: 'Test Project',
  },
  shortDescription: {
    es: 'Descripción corta',
    en: 'Short description',
  },
  fullDescription: {
    es: 'Esta es una descripción completa del proyecto de prueba.',
    en: 'This is a full description of the test project.',
  },
  image: '/images/test-project.jpg',
  images: ['/images/test-1.jpg', '/images/test-2.jpg'],
  technologies: ['React', 'TypeScript', 'Vite'],
  date: '2024-01-15',
  featured: true,
  links: {
    github: 'https://github.com/test/project',
    demo: 'https://demo.test.com',
  },
};

describe('ProjectDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (projectId: string) => {
    return render(
      <HelmetProvider>
        <MemoryRouter initialEntries={[`/projects/${projectId}`]}>
          <Routes>
            <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );
  };

  it('should show loading state initially', () => {
    vi.mocked(ContentLoader.loadProject).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithRouter('test-project');

    expect(screen.getByText(/common.loading/i)).toBeInTheDocument();
  });

  it('should load and display project details', async () => {
    vi.mocked(ContentLoader.loadProject).mockResolvedValue(mockProject);

    renderWithRouter('test-project');

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    expect(screen.getByText('This is a full description of the test project.')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();
  });

  it('should not display project images on detail page', async () => {
    vi.mocked(ContentLoader.loadProject).mockResolvedValue(mockProject);

    renderWithRouter('test-project');

    await waitFor(() => {
      expect(screen.queryByTestId('optimized-image')).not.toBeInTheDocument();
    });
  });

  it('should display project links when available', async () => {
    vi.mocked(ContentLoader.loadProject).mockResolvedValue(mockProject);

    renderWithRouter('test-project');

    await waitFor(() => {
      const githubLink = screen.getByText(/projects.sourceCode/i).closest('a');
      const demoLink = screen.getByText(/projects.liveDemo/i).closest('a');

      expect(githubLink).toHaveAttribute('href', 'https://github.com/test/project');
      expect(demoLink).toHaveAttribute('href', 'https://demo.test.com');
    });
  });

  it('should not display links section when no links are available', async () => {
    const projectWithoutLinks = { ...mockProject, links: undefined };
    vi.mocked(ContentLoader.loadProject).mockResolvedValue(projectWithoutLinks);

    renderWithRouter('test-project');

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    expect(screen.queryByText(/projects.sourceCode/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/projects.liveDemo/i)).not.toBeInTheDocument();
  });

  it('should show 404 error when project is not found', async () => {
    vi.mocked(ContentLoader.loadProject).mockRejectedValue(
      new Error('Project not found')
    );

    renderWithRouter('non-existent-project');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /projects.notFound/i })).toBeInTheDocument();
    });
  });

  it('should have back to projects button', async () => {
    vi.mocked(ContentLoader.loadProject).mockResolvedValue(mockProject);

    renderWithRouter('test-project');

    await waitFor(() => {
      const backButton = screen.getByText(/projects.backToList/i);
      expect(backButton).toBeInTheDocument();
    });
  });

  it('should display technologies as badges', async () => {
    vi.mocked(ContentLoader.loadProject).mockResolvedValue(mockProject);

    renderWithRouter('test-project');

    await waitFor(() => {
      mockProject.technologies.forEach((tech) => {
        const badge = screen.getByText(tech);
        expect(badge).toBeInTheDocument();
        expect(badge.className).toContain('bg-primary-100');
      });
    });
  });

  it('should open external links in new tab', async () => {
    vi.mocked(ContentLoader.loadProject).mockResolvedValue(mockProject);

    renderWithRouter('test-project');

    await waitFor(() => {
      const githubLink = screen.getByText(/projects.sourceCode/i).closest('a');
      const demoLink = screen.getByText(/projects.liveDemo/i).closest('a');

      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(demoLink).toHaveAttribute('target', '_blank');
      expect(demoLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
