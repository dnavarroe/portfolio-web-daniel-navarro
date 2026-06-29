import { describe, it, expect } from 'vitest';
import { 
  generatePersonStructuredData, 
  generateProjectStructuredData,
  generateWebsiteStructuredData 
} from './structuredData';
import type { Project } from '../types';

describe('Structured Data Utilities', () => {
  describe('generatePersonStructuredData', () => {
    it('should generate valid Person schema in Spanish', () => {
      const data = generatePersonStructuredData('es');

      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('Person');
      expect(data.name).toBe('Daniel Navarro');
      expect(data.jobTitle).toBe('Científico de Datos');
      expect(data.description).toContain('Científico de datos');
      expect(data.sameAs).toBeInstanceOf(Array);
      expect(data.sameAs.length).toBeGreaterThan(0);
    });

    it('should generate valid Person schema in English', () => {
      const data = generatePersonStructuredData('en');

      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('Person');
      expect(data.name).toBe('Daniel Navarro');
      expect(data.jobTitle).toBe('Data Scientist');
      expect(data.description).toContain('Data scientist');
      expect(data.sameAs).toBeInstanceOf(Array);
    });

    it('should include social media links', () => {
      const data = generatePersonStructuredData('es');

      expect(data.sameAs).toContain('https://linkedin.com/in/daniel-navarro');
      expect(data.sameAs).toContain('https://github.com/danielnavarro');
    });

    it('should include image and url', () => {
      const data = generatePersonStructuredData('es');

      expect(data.image).toContain('/content/images/profile.jpg');
      expect(data.url).toBeDefined();
    });
  });

  describe('generateProjectStructuredData', () => {
    const mockProject: Project = {
      id: 'test-project',
      title: {
        es: 'Proyecto de Prueba',
        en: 'Test Project'
      },
      shortDescription: {
        es: 'Descripción corta en español',
        en: 'Short description in English'
      },
      fullDescription: {
        es: 'Descripción completa en español',
        en: 'Full description in English'
      },
      image: '/content/images/projects/test.jpg',
      technologies: ['Python', 'React', 'TypeScript'],
      date: '2024-01-15',
      featured: true
    };

    it('should generate valid CreativeWork schema in Spanish', () => {
      const data = generateProjectStructuredData(mockProject, 'es');

      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('CreativeWork');
      expect(data.name).toBe('Proyecto de Prueba');
      expect(data.description).toBe('Descripción corta en español');
      expect(data.dateCreated).toBe('2024-01-15');
    });

    it('should generate valid CreativeWork schema in English', () => {
      const data = generateProjectStructuredData(mockProject, 'en');

      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('CreativeWork');
      expect(data.name).toBe('Test Project');
      expect(data.description).toBe('Short description in English');
    });

    it('should include author information', () => {
      const data = generateProjectStructuredData(mockProject, 'es');

      expect(data.author).toBeDefined();
      expect(data.author['@type']).toBe('Person');
      expect(data.author.name).toBe('Daniel Navarro');
    });

    it('should include technologies as keywords', () => {
      const data = generateProjectStructuredData(mockProject, 'es');

      expect(data.keywords).toBe('Python, React, TypeScript');
    });

    it('should include project image with full URL', () => {
      const data = generateProjectStructuredData(mockProject, 'es');

      expect(data.image).toContain('/content/images/projects/test.jpg');
    });
  });

  describe('generateWebsiteStructuredData', () => {
    it('should generate valid WebSite schema in Spanish', () => {
      const data = generateWebsiteStructuredData('es');

      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('WebSite');
      expect(data.name).toBe('Daniel Navarro - Portfolio');
      expect(data.description).toContain('Portafolio profesional');
      expect(data.inLanguage).toEqual(['es']);
    });

    it('should generate valid WebSite schema in English', () => {
      const data = generateWebsiteStructuredData('en');

      expect(data['@context']).toBe('https://schema.org');
      expect(data['@type']).toBe('WebSite');
      expect(data.name).toBe('Daniel Navarro - Portfolio');
      expect(data.description).toContain('Professional portfolio');
      expect(data.inLanguage).toEqual(['en']);
    });

    it('should include author information', () => {
      const data = generateWebsiteStructuredData('es');

      expect(data.author).toBeDefined();
      expect(data.author['@type']).toBe('Person');
      expect(data.author.name).toBe('Daniel Navarro');
    });

    it('should include website URL', () => {
      const data = generateWebsiteStructuredData('es');

      expect(data.url).toBeDefined();
    });
  });
});
