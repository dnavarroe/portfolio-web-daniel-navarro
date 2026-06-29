import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ProjectsPage from './ProjectsPage';
import { ContentLoader } from '../services/ContentLoader';
import type { Project } from '../types';

const stableT = (key: string) => {
  const translations: Record<string, string> = {
    'projects.title': 'My Projects',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'errors.projectsLoadFailed': 'Failed to load projects',
    'projects.noProjects': 'No projects available.'
  };
  return translations[key] || key;
};

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: stableT,
    i18n: {
      language: 'es'
    }
  })
}));

vi.mock('../services/ContentLoader', () => ({
  ContentLoader: {
    loadProjects: vi.fn()
  }
}));

const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: { es: 'Proyecto 1', en: 'Project 1' },
    shortDescription: { es: 'Descripción 1', en: 'Description 1' },
    fullDescription: { es: 'Descripción completa 1', en: 'Full description 1' },
    image: '/image1.jpg',
    technologies: ['Python', 'React'],
    date: '2024-01-15'
  },
  {
    id: 'project-2',
    title: { es: 'Proyecto 2', en: 'Project 2' },
    shortDescription: { es: 'Descripción 2', en: 'Description 2' },
    fullDescription: { es: 'Descripción completa 2', en: 'Full description 2' },
    image: '/image2.jpg',
    technologies: ['TypeScript', 'Node.js'],
    date: '2023-12-01'
  }
];

describe('ProjectsPage', () => {
  beforeEach(() => {
    // Set default mock implementation BEFORE clearing
    vi.mocked(ContentLoader.loadProjects).mockResolvedValue(mockProjects);
    vi.clearAllMocks();
    // Re-set after clearing
    vi.mocked(ContentLoader.loadProjects).mockResolvedValue(mockProjects);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <HelmetProvider>
        <BrowserRouter>{component}</BrowserRouter>
      </HelmetProvider>
    );
  };

  it('should display loading state initially', () => {
    vi.mocked(ContentLoader.loadProjects).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithRouter(<ProjectsPage />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should load and display projects', async () => {
    vi.mocked(ContentLoader.loadProjects).mockResolvedValue(mockProjects);

    renderWithRouter(<ProjectsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Proyecto 1')).toBeInTheDocument();
      expect(screen.getByText('Proyecto 2')).toBeInTheDocument();
    });
  });

  it('should display page title', async () => {
    vi.mocked(ContentLoader.loadProjects).mockResolvedValue(mockProjects);

    renderWithRouter(<ProjectsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('My Projects')).toBeInTheDocument();
    });
  });

  it('should display error state and retry button when loading fails', async () => {
    vi.mocked(ContentLoader.loadProjects).mockRejectedValue(
      new Error('Network error')
    );

    renderWithRouter(<ProjectsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load projects')).toBeInTheDocument();
      expect(screen.getByText('Intentar de nuevo')).toBeInTheDocument();
    });
  });

  it('should render projects in a grid layout', async () => {
    vi.mocked(ContentLoader.loadProjects).mockResolvedValue(mockProjects);

    const { container } = renderWithRouter(<ProjectsPage />);
    
    await waitFor(() => {
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid?.className).toContain('grid-cols-1');
      expect(grid?.className).toContain('md:grid-cols-2');
      expect(grid?.className).toContain('lg:grid-cols-3');
    });
  });

  it('should display empty state when no projects', async () => {
    vi.mocked(ContentLoader.loadProjects).mockResolvedValue([]);

    renderWithRouter(<ProjectsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No hay proyectos disponibles en este momento.')).toBeInTheDocument();
    });
  });

  it('should render correct number of project cards', async () => {
    vi.mocked(ContentLoader.loadProjects).mockResolvedValue(mockProjects);

    const { container } = renderWithRouter(<ProjectsPage />);
    
    await waitFor(() => {
      const cards = container.querySelectorAll('article');
      expect(cards).toHaveLength(2);
    });
  });

  it('should call ContentLoader.loadProjects on mount', async () => {
    vi.mocked(ContentLoader.loadProjects).mockResolvedValue(mockProjects);

    renderWithRouter(<ProjectsPage />);
    
    await waitFor(() => {
      expect(ContentLoader.loadProjects).toHaveBeenCalledTimes(1);
    });
  });
});
