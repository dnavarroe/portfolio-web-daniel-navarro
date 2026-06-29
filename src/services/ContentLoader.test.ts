import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContentLoader } from './ContentLoader';
import type { PersonalInfo, Project, SkillsData } from '../types';

// Mock fetch globally
const mockFetch = vi.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

describe('ContentLoader', () => {
  beforeEach(() => {
    // Clear cache before each test
    ContentLoader.clearCache();
    // Reset all mocks
    vi.clearAllMocks();
  });

  describe('loadPersonalInfo', () => {
    it('should load personal info successfully', async () => {
      const mockPersonalInfo: PersonalInfo = {
        name: 'Daniel Navarro',
        photo: '/content/images/profile.jpg',
        summary: {
          es: 'Resumen en español',
          en: 'Summary in English',
        },
        contacts: {
          email: 'daniel@example.com',
          linkedin: 'https://linkedin.com/in/daniel',
          github: 'https://github.com/daniel',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPersonalInfo,
      } as Response);

      const result = await ContentLoader.loadPersonalInfo();

      expect(result).toEqual(mockPersonalInfo);
      expect(mockFetch).toHaveBeenCalledWith('/content/personal.json');
    });

    it('should throw descriptive error on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(ContentLoader.loadPersonalInfo()).rejects.toThrow(
        'Failed to load /content/personal.json: HTTP 404: Not Found'
      );
    });
  });

  describe('loadProjects', () => {
    it('should load and sort projects by date (most recent first)', async () => {
      const mockManifest = {
        files: ['project-1.json', 'project-2.json', 'project-3.json'],
      };

      const mockProjects: Project[] = [
        {
          id: 'project-1',
          title: { es: 'Proyecto 1', en: 'Project 1' },
          shortDescription: { es: 'Desc 1', en: 'Desc 1' },
          fullDescription: { es: 'Full 1', en: 'Full 1' },
          image: '/img1.jpg',
          technologies: ['Python'],
          date: '2023-01-15',
        },
        {
          id: 'project-2',
          title: { es: 'Proyecto 2', en: 'Project 2' },
          shortDescription: { es: 'Desc 2', en: 'Desc 2' },
          fullDescription: { es: 'Full 2', en: 'Full 2' },
          image: '/img2.jpg',
          technologies: ['JavaScript'],
          date: '2024-06-20',
        },
        {
          id: 'project-3',
          title: { es: 'Proyecto 3', en: 'Project 3' },
          shortDescription: { es: 'Desc 3', en: 'Desc 3' },
          fullDescription: { es: 'Full 3', en: 'Full 3' },
          image: '/img3.jpg',
          technologies: ['TypeScript'],
          date: '2024-01-10',
        },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockManifest,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockProjects[0],
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockProjects[1],
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockProjects[2],
        } as Response);

      const result = await ContentLoader.loadProjects();

      // Should be sorted by date descending (most recent first)
      expect(result).toHaveLength(3);
      expect(result[0].date).toBe('2024-06-20'); // Most recent
      expect(result[1].date).toBe('2024-01-10');
      expect(result[2].date).toBe('2023-01-15'); // Oldest
    });

    it('should throw descriptive error when manifest fails to load', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(ContentLoader.loadProjects()).rejects.toThrow(
        'Failed to load projects'
      );
    });

    it('should handle empty project list', async () => {
      const mockManifest = { files: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockManifest,
      } as Response);

      const result = await ContentLoader.loadProjects();

      expect(result).toEqual([]);
    });
  });

  describe('loadProject', () => {
    it('should load a single project by ID', async () => {
      const mockProject: Project = {
        id: 'test-project',
        title: { es: 'Proyecto Test', en: 'Test Project' },
        shortDescription: { es: 'Desc', en: 'Desc' },
        fullDescription: { es: 'Full', en: 'Full' },
        image: '/img.jpg',
        technologies: ['React'],
        date: '2024-01-01',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProject,
      } as Response);

      const result = await ContentLoader.loadProject('test-project');

      expect(result).toEqual(mockProject);
      expect(mockFetch).toHaveBeenCalledWith(
        '/content/projects/test-project.json'
      );
    });

    it('should throw descriptive error with project ID when not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(ContentLoader.loadProject('nonexistent')).rejects.toThrow(
        "Failed to load project 'nonexistent'"
      );
    });
  });

  describe('loadSkills', () => {
    it('should load all skills data from multiple files', async () => {
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
                },
              ],
            },
          ],
        },
        education: {
          education: [
            {
              id: 'edu-1',
              institution: { es: 'Universidad', en: 'University' },
              degree: { es: 'Licenciatura', en: 'Bachelor' },
              year: '2020',
            },
          ],
        },
        certifications: {
          certifications: [
            {
              id: 'cert-1',
              name: { es: 'Certificación', en: 'Certification' },
              issuer: { es: 'Coursera', en: 'Coursera' },
              year: '2023',
            },
          ],
        },
        experience: {
          experience: [
            {
              id: 'exp-1',
              company: { es: 'Empresa', en: 'Company' },
              position: { es: 'Analista', en: 'Analyst' },
              period: '2021-2023',
              description: { es: 'Descripción', en: 'Description' },
            },
          ],
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSkillsData.technical,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSkillsData.education,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSkillsData.certifications,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSkillsData.experience,
        } as Response);

      const result = await ContentLoader.loadSkills();

      expect(result).toEqual(mockSkillsData);
      expect(mockFetch).toHaveBeenCalledTimes(4);
      expect(mockFetch).toHaveBeenCalledWith('/content/skills/technical.json');
      expect(mockFetch).toHaveBeenCalledWith('/content/skills/education.json');
      expect(mockFetch).toHaveBeenCalledWith(
        '/content/skills/certifications.json'
      );
      expect(mockFetch).toHaveBeenCalledWith('/content/skills/experience.json');
    });

    it('should throw descriptive error when any skills file fails to load', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ categories: [] }),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        } as Response);

      await expect(ContentLoader.loadSkills()).rejects.toThrow(
        'Failed to load skills data'
      );
    });
  });

  describe('caching', () => {
    it('should cache loaded content and not fetch again', async () => {
      const mockPersonalInfo: PersonalInfo = {
        name: 'Daniel Navarro',
        photo: '/photo.jpg',
        summary: { es: 'Resumen', en: 'Summary' },
        contacts: {
          email: 'test@example.com',
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPersonalInfo,
      } as Response);

      // First call - should fetch
      const result1 = await ContentLoader.loadPersonalInfo();
      expect(result1).toEqual(mockPersonalInfo);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const result2 = await ContentLoader.loadPersonalInfo();
      expect(result2).toEqual(mockPersonalInfo);
      expect(mockFetch).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it('should clear cache when clearCache is called', async () => {
      const mockPersonalInfo: PersonalInfo = {
        name: 'Daniel Navarro',
        photo: '/photo.jpg',
        summary: { es: 'Resumen', en: 'Summary' },
        contacts: {
          email: 'test@example.com',
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockPersonalInfo,
      } as Response);

      // First call
      await ContentLoader.loadPersonalInfo();
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Clear cache
      ContentLoader.clearCache();

      // Second call - should fetch again
      await ContentLoader.loadPersonalInfo();
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('error handling', () => {
    it('should handle network errors with descriptive messages', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(ContentLoader.loadPersonalInfo()).rejects.toThrow(
        'Failed to load /content/personal.json: Network error'
      );
    });

    it('should handle JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as unknown as Response);

      await expect(ContentLoader.loadPersonalInfo()).rejects.toThrow(
        'Failed to load /content/personal.json: Invalid JSON'
      );
    });
  });

  describe('project sorting edge cases', () => {
    it('should handle projects with same date', async () => {
      const mockManifest = { files: ['p1.json', 'p2.json'] };
      const sameDate = '2024-01-01';

      const projects: Project[] = [
        {
          id: 'p1',
          title: { es: 'P1', en: 'P1' },
          shortDescription: { es: 'D1', en: 'D1' },
          fullDescription: { es: 'F1', en: 'F1' },
          image: '/i1.jpg',
          technologies: ['T1'],
          date: sameDate,
        },
        {
          id: 'p2',
          title: { es: 'P2', en: 'P2' },
          shortDescription: { es: 'D2', en: 'D2' },
          fullDescription: { es: 'F2', en: 'F2' },
          image: '/i2.jpg',
          technologies: ['T2'],
          date: sameDate,
        },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockManifest,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => projects[0],
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => projects[1],
        } as Response);

      const result = await ContentLoader.loadProjects();

      expect(result).toHaveLength(2);
      // Both should have the same date
      expect(result[0].date).toBe(sameDate);
      expect(result[1].date).toBe(sameDate);
    });

    it('should handle single project', async () => {
      const mockManifest = { files: ['p1.json'] };
      const project: Project = {
        id: 'p1',
        title: { es: 'P1', en: 'P1' },
        shortDescription: { es: 'D1', en: 'D1' },
        fullDescription: { es: 'F1', en: 'F1' },
        image: '/i1.jpg',
        technologies: ['T1'],
        date: '2024-01-01',
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockManifest,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => project,
        } as Response);

      const result = await ContentLoader.loadProjects();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(project);
    });
  });
});
