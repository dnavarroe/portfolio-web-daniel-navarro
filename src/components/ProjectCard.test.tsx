import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../types';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'es'
    }
  })
}));

describe('ProjectCard', () => {
  const mockProject: Project = {
    id: 'test-1',
    title: {
      es: 'Proyecto de Prueba',
      en: 'Test Project'
    },
    shortDescription: {
      es: 'Descripción corta en español',
      en: 'Short description in English'
    },
    fullDescription: {
      es: 'Descripción completa',
      en: 'Full description'
    },
    image: '/test-image.jpg',
    technologies: ['Python', 'React', 'TypeScript'],
    date: '2024-01-15'
  };

  it('should render project title in current language', () => {
    const onClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={onClick} />);
    
    expect(screen.getByText('Proyecto de Prueba')).toBeInTheDocument();
  });

  it('should render project short description', () => {
    const onClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={onClick} />);
    
    expect(screen.getByText('Descripción corta en español')).toBeInTheDocument();
  });

  it('should render all technologies as badges', () => {
    const onClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={onClick} />);
    
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should render project image with correct alt text', () => {
    const onClick = vi.fn();
    const { container } = render(<ProjectCard project={mockProject} onClick={onClick} />);
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img?.alt).toBe('Proyecto de Prueba');
  });

  it('should call onClick when card is clicked', () => {
    const onClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={onClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when Enter key is pressed', () => {
    const onClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={onClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when Space key is pressed', () => {
    const onClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={onClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: ' ' });
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    const onClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={onClick} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-label');
  });

  it('should render as an article element', () => {
    const onClick = vi.fn();
    const { container } = render(<ProjectCard project={mockProject} onClick={onClick} />);
    
    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();
  });

  it('should apply hover effect classes', () => {
    const onClick = vi.fn();
    const { container } = render(<ProjectCard project={mockProject} onClick={onClick} />);
    
    const article = container.querySelector('article');
    expect(article?.className).toContain('hover:shadow-xl');
    expect(article?.className).toContain('hover:-translate-y-1');
  });
});
