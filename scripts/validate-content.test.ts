import { describe, it, expect, beforeEach } from 'vitest';
import { ContentValidator } from '../src/utils/contentValidation';

describe('ContentValidator - validateProject', () => {
  let validator: ContentValidator;

  beforeEach(() => {
    validator = new ContentValidator();
  });

  it('should validate a valid project', () => {
    const validProject = {
      id: 'test-project',
      title: { es: 'Proyecto Test', en: 'Test Project' },
      shortDescription: { es: 'Descripción corta', en: 'Short description' },
      fullDescription: { es: 'Descripción completa', en: 'Full description' },
      image: '/content/images/test.jpg',
      technologies: ['React', 'TypeScript'],
      date: '2024-01-15',
    };

    const result = validator.validateProject(validProject, 'test-project.json');
    expect(result).toBe(true);
    expect(validator.getErrors()).toHaveLength(0);
  });

  it('should fail when id is missing', () => {
    const invalidProject = {
      title: { es: 'Proyecto', en: 'Project' },
      shortDescription: { es: 'Desc', en: 'Desc' },
      fullDescription: { es: 'Full', en: 'Full' },
      image: '/img.jpg',
      technologies: ['React'],
      date: '2024-01-15',
    };

    const result = validator.validateProject(invalidProject, 'test.json');
    expect(result).toBe(false);
    expect(validator.getErrors().length).toBeGreaterThan(0);
  });

  it('should fail when title is missing Spanish translation', () => {
    const invalidProject = {
      id: 'test',
      title: { en: 'Project' },
      shortDescription: { es: 'Desc', en: 'Desc' },
      fullDescription: { es: 'Full', en: 'Full' },
      image: '/img.jpg',
      technologies: ['React'],
      date: '2024-01-15',
    };

    const result = validator.validateProject(invalidProject, 'test.json');
    expect(result).toBe(false);
    const errors = validator.getErrors();
    expect(errors.some(e => e.field.includes('title') && e.message.includes('Spanish'))).toBe(true);
  });

  it('should fail when title is missing English translation', () => {
    const invalidProject = {
      id: 'test',
      title: { es: 'Proyecto' },
      shortDescription: { es: 'Desc', en: 'Desc' },
      fullDescription: { es: 'Full', en: 'Full' },
      image: '/img.jpg',
      technologies: ['React'],
      date: '2024-01-15',
    };

    const result = validator.validateProject(invalidProject, 'test.json');
    expect(result).toBe(false);
    const errors = validator.getErrors();
    expect(errors.some(e => e.field.includes('title') && e.message.includes('English'))).toBe(true);
  });

  it('should fail when shortDescription is missing', () => {
    const invalidProject = {
      id: 'test',
      title: { es: 'Proyecto', en: 'Project' },
      fullDescription: { es: 'Full', en: 'Full' },
      image: '/img.jpg',
      technologies: ['React'],
      date: '2024-01-15',
    };

    const result = validator.validateProject(invalidProject, 'test.json');
    expect(result).toBe(false);
  });

  it('should fail when fullDescription is missing', () => {
    const invalidProject = {
      id: 'test',
      title: { es: 'Proyecto', en: 'Project' },
      shortDescription: { es: 'Desc', en: 'Desc' },
      image: '/img.jpg',
      technologies: ['React'],
      date: '2024-01-15',
    };

    const result = validator.validateProject(invalidProject, 'test.json');
    expect(result).toBe(false);
  });

  it('should fail when image is missing', () => {
    const invalidProject = {
      id: 'test',
      title: { es: 'Proyecto', en: 'Project' },
      shortDescription: { es: 'Desc', en: 'Desc' },
      fullDescription: { es: 'Full', en: 'Full' },
      technologies: ['React'],
      date: '2024-01-15',
    };

    const result = validator.validateProject(invalidProject, 'test.json');
    expect(result).toBe(false);
  });

  it('should fail when technologies is not an array', () => {
    const invalidProject = {
      id: 'test',
      title: { es: 'Proyecto', en: 'Project' },
      shortDescription: { es: 'Desc', en: 'Desc' },
      fullDescription: { es: 'Full', en: 'Full' },
      image: '/img.jpg',
      technologies: 'React',
      date: '2024-01-15',
    };

    const result = validator.validateProject(invalidProject, 'test.json');
    expect(result).toBe(false);
  });

  it('should fail when date is missing', () => {
    const invalidProject = {
      id: 'test',
      title: { es: 'Proyecto', en: 'Project' },
      shortDescription: { es: 'Desc', en: 'Desc' },
      fullDescription: { es: 'Full', en: 'Full' },
      image: '/img.jpg',
      technologies: ['React'],
    };

    const result = validator.validateProject(invalidProject, 'test.json');
    expect(result).toBe(false);
  });

  it('should fail when date format is invalid', () => {
    const invalidProject = {
      id: 'test',
      title: { es: 'Proyecto', en: 'Project' },
      shortDescription: { es: 'Desc', en: 'Desc' },
      fullDescription: { es: 'Full', en: 'Full' },
      image: '/img.jpg',
      technologies: ['React'],
      date: '01/15/2024',
    };

    const result = validator.validateProject(invalidProject, 'test.json');
    expect(result).toBe(false);
  });

  it('should fail when date is not ISO 8601 format', () => {
    const invalidProject = {
      id: 'test',
      title: { es: 'Proyecto', en: 'Project' },
      shortDescription: { es: 'Desc', en: 'Desc' },
      fullDescription: { es: 'Full', en: 'Full' },
      image: '/img.jpg',
      technologies: ['React'],
      date: '2024-1-5',
    };

    const result = validator.validateProject(invalidProject, 'test.json');
    expect(result).toBe(false);
  });

  it('should accept valid optional fields', () => {
    const validProject = {
      id: 'test',
      title: { es: 'Proyecto', en: 'Project' },
      shortDescription: { es: 'Desc', en: 'Desc' },
      fullDescription: { es: 'Full', en: 'Full' },
      image: '/img.jpg',
      images: ['/img1.jpg', '/img2.jpg'],
      technologies: ['React'],
      date: '2024-01-15',
      featured: true,
      links: {
        github: 'https://github.com/test',
        demo: 'https://demo.test.com',
      },
    };

    const result = validator.validateProject(validProject, 'test.json');
    expect(result).toBe(true);
  });
});

describe('ContentValidator - validateSkill', () => {
  let validator: ContentValidator;

  beforeEach(() => {
    validator = new ContentValidator();
  });

  it('should validate a valid skill', () => {
    const validSkill = {
      id: 'python',
      name: { es: 'Python', en: 'Python' },
      category: 'programming',
      level: 'expert',
    };

    const result = validator.validateSkill(validSkill, 'technical.json');
    expect(result).toBe(true);
    expect(validator.getErrors()).toHaveLength(0);
  });

  it('should fail when id is missing', () => {
    const invalidSkill = {
      name: { es: 'Python', en: 'Python' },
      category: 'programming',
      level: 'expert',
    };

    const result = validator.validateSkill(invalidSkill, 'technical.json');
    expect(result).toBe(false);
  });

  it('should fail when name is missing Spanish translation', () => {
    const invalidSkill = {
      id: 'python',
      name: { en: 'Python' },
      category: 'programming',
      level: 'expert',
    };

    const result = validator.validateSkill(invalidSkill, 'technical.json');
    expect(result).toBe(false);
  });

  it('should fail when name is missing English translation', () => {
    const invalidSkill = {
      id: 'python',
      name: { es: 'Python' },
      category: 'programming',
      level: 'expert',
    };

    const result = validator.validateSkill(invalidSkill, 'technical.json');
    expect(result).toBe(false);
  });

  it('should fail when category is missing', () => {
    const invalidSkill = {
      id: 'python',
      name: { es: 'Python', en: 'Python' },
      level: 'expert',
    };

    const result = validator.validateSkill(invalidSkill, 'technical.json');
    expect(result).toBe(false);
  });

  it('should fail when level is invalid', () => {
    const invalidSkill = {
      id: 'python',
      name: { es: 'Python', en: 'Python' },
      category: 'programming',
      level: 'master',
    };

    const result = validator.validateSkill(invalidSkill, 'technical.json');
    expect(result).toBe(false);
  });

  it('should accept valid level values', () => {
    const levels = ['basic', 'intermediate', 'advanced', 'expert'];
    
    levels.forEach((level) => {
      validator.clearErrors();
      const skill = {
        id: 'test',
        name: { es: 'Test', en: 'Test' },
        category: 'test',
        level,
      };

      const result = validator.validateSkill(skill, 'technical.json');
      expect(result).toBe(true);
    });
  });

  it('should accept optional icon field', () => {
    const validSkill = {
      id: 'python',
      name: { es: 'Python', en: 'Python' },
      category: 'programming',
      level: 'expert',
      icon: 'python-icon',
    };

    const result = validator.validateSkill(validSkill, 'technical.json');
    expect(result).toBe(true);
  });
});
