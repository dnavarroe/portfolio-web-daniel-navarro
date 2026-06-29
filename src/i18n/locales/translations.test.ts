import { describe, it, expect } from 'vitest';
import es from './es.json';
import en from './en.json';

/**
 * Tests for translation files
 * Validates Requirements 6.2, 6.3
 */
describe('Translation Files', () => {
  describe('Spanish translations (es.json)', () => {
    it('should have navigation translations', () => {
      expect(es.nav).toBeDefined();
      expect(es.nav.home).toBe('Inicio');
      expect(es.nav.projects).toBe('Proyectos');
      expect(es.nav.skills).toBe('Habilidades');
    });

    it('should have home page translations', () => {
      expect(es.home).toBeDefined();
      expect(es.home.greeting).toBeDefined();
      expect(es.home.contact).toBeDefined();
      expect(es.home.featuredProjects).toBeDefined();
      expect(es.home.mainSkills).toBeDefined();
    });

    it('should have projects section translations', () => {
      expect(es.projects).toBeDefined();
      expect(es.projects.title).toBeDefined();
      expect(es.projects.viewDetails).toBeDefined();
      expect(es.projects.backToList).toBeDefined();
      expect(es.projects.technologies).toBeDefined();
      expect(es.projects.links).toBeDefined();
    });

    it('should have skills section translations', () => {
      expect(es.skills).toBeDefined();
      expect(es.skills.title).toBeDefined();
      expect(es.skills.technical).toBeDefined();
      expect(es.skills.education).toBeDefined();
      expect(es.skills.certifications).toBeDefined();
      expect(es.skills.experience).toBeDefined();
    });

    it('should have skill level translations', () => {
      expect(es.skills.level).toBeDefined();
      expect(es.skills.level.basic).toBe('Básico');
      expect(es.skills.level.intermediate).toBe('Intermedio');
      expect(es.skills.level.advanced).toBe('Avanzado');
      expect(es.skills.level.expert).toBe('Experto');
    });

    it('should have error messages', () => {
      expect(es.errors).toBeDefined();
      expect(es.errors.projectsLoadFailed).toBeDefined();
    });
  });

  describe('English translations (en.json)', () => {
    it('should have navigation translations', () => {
      expect(en.nav).toBeDefined();
      expect(en.nav.home).toBe('Home');
      expect(en.nav.projects).toBe('Projects');
      expect(en.nav.skills).toBe('Skills');
    });

    it('should have home page translations', () => {
      expect(en.home).toBeDefined();
      expect(en.home.greeting).toBeDefined();
      expect(en.home.contact).toBeDefined();
      expect(en.home.featuredProjects).toBeDefined();
      expect(en.home.mainSkills).toBeDefined();
    });

    it('should have projects section translations', () => {
      expect(en.projects).toBeDefined();
      expect(en.projects.title).toBeDefined();
      expect(en.projects.viewDetails).toBeDefined();
      expect(en.projects.backToList).toBeDefined();
      expect(en.projects.technologies).toBeDefined();
      expect(en.projects.links).toBeDefined();
    });

    it('should have skills section translations', () => {
      expect(en.skills).toBeDefined();
      expect(en.skills.title).toBeDefined();
      expect(en.skills.technical).toBeDefined();
      expect(en.skills.education).toBeDefined();
      expect(en.skills.certifications).toBeDefined();
      expect(en.skills.experience).toBeDefined();
    });

    it('should have skill level translations', () => {
      expect(en.skills.level).toBeDefined();
      expect(en.skills.level.basic).toBe('Basic');
      expect(en.skills.level.intermediate).toBe('Intermediate');
      expect(en.skills.level.advanced).toBe('Advanced');
      expect(en.skills.level.expert).toBe('Expert');
    });

    it('should have error messages', () => {
      expect(en.errors).toBeDefined();
      expect(en.errors.projectsLoadFailed).toBeDefined();
    });
  });

  describe('Translation parity', () => {
    it('should have the same structure in both languages', () => {
      const esKeys = Object.keys(es);
      const enKeys = Object.keys(en);
      
      expect(esKeys.sort()).toEqual(enKeys.sort());
    });

    it('should have matching navigation keys', () => {
      const esNavKeys = Object.keys(es.nav);
      const enNavKeys = Object.keys(en.nav);
      
      expect(esNavKeys.sort()).toEqual(enNavKeys.sort());
    });

    it('should have matching home keys', () => {
      const esHomeKeys = Object.keys(es.home);
      const enHomeKeys = Object.keys(en.home);
      
      expect(esHomeKeys.sort()).toEqual(enHomeKeys.sort());
    });

    it('should have matching projects keys', () => {
      const esProjectsKeys = Object.keys(es.projects);
      const enProjectsKeys = Object.keys(en.projects);
      
      expect(esProjectsKeys.sort()).toEqual(enProjectsKeys.sort());
    });

    it('should have matching skills keys', () => {
      const esSkillsKeys = Object.keys(es.skills);
      const enSkillsKeys = Object.keys(en.skills);
      
      expect(esSkillsKeys.sort()).toEqual(enSkillsKeys.sort());
    });

    it('should have matching skill level keys', () => {
      const esLevelKeys = Object.keys(es.skills.level);
      const enLevelKeys = Object.keys(en.skills.level);
      
      expect(esLevelKeys.sort()).toEqual(enLevelKeys.sort());
    });
  });
});
