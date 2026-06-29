import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import { SkillCard } from './SkillCard';
import type { Skill } from '../types';

describe('SkillCard', () => {
  beforeEach(() => {
    i18n.changeLanguage('es');
  });

  const createMockSkill = (overrides?: Partial<Skill>): Skill => ({
    id: 'skill-1',
    name: {
      es: 'Python',
      en: 'Python',
    },
    category: 'programming',
    level: 'expert',
    icon: '🐍',
    ...overrides,
  });

  const renderSkillCard = (skill: Skill) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <SkillCard skill={skill} />
      </I18nextProvider>
    );
  };

  describe('Basic Rendering', () => {
    it('should render skill name in current language', () => {
      const skill = createMockSkill();
      renderSkillCard(skill);

      expect(screen.getByText('Python')).toBeInTheDocument();
    });

    it('should render skill level', () => {
      const skill = createMockSkill({ level: 'expert' });
      renderSkillCard(skill);

      expect(screen.getByText('Experto')).toBeInTheDocument();
    });

    it('should render icon when provided', () => {
      const skill = createMockSkill({ icon: '🐍' });
      renderSkillCard(skill);

      const icon = screen.getByRole('img', { name: 'Python' });
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('🐍');
    });

    it('should not render icon container when icon is not provided', () => {
      const skill = createMockSkill({ icon: undefined });
      const { container } = renderSkillCard(skill);

      const iconContainer = container.querySelector('[role="img"]');
      expect(iconContainer).not.toBeInTheDocument();
    });
  });

  describe('Level Visualization', () => {
    it('should render progress bar for expert level at 100%', () => {
      const skill = createMockSkill({ level: 'expert' });
      renderSkillCard(skill);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });

    it('should render progress bar for advanced level at 75%', () => {
      const skill = createMockSkill({ level: 'advanced' });
      renderSkillCard(skill);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    });

    it('should render progress bar for intermediate level at 50%', () => {
      const skill = createMockSkill({ level: 'intermediate' });
      renderSkillCard(skill);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('should render progress bar for basic level at 25%', () => {
      const skill = createMockSkill({ level: 'basic' });
      renderSkillCard(skill);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '25');
    });

    it('should have correct aria-label on progress bar', () => {
      const skill = createMockSkill({
        name: { es: 'JavaScript', en: 'JavaScript' },
        level: 'advanced',
      });
      renderSkillCard(skill);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-label', 'JavaScript - Avanzado');
    });
  });

  describe('Localization', () => {
    it('should display skill name in Spanish when language is es', () => {
      i18n.changeLanguage('es');
      const skill = createMockSkill({
        name: { es: 'Ciencia de Datos', en: 'Data Science' },
      });
      renderSkillCard(skill);

      expect(screen.getByText('Ciencia de Datos')).toBeInTheDocument();
      expect(screen.queryByText('Data Science')).not.toBeInTheDocument();
    });

    it('should display skill name in English when language is en', () => {
      i18n.changeLanguage('en');
      const skill = createMockSkill({
        name: { es: 'Ciencia de Datos', en: 'Data Science' },
      });
      renderSkillCard(skill);

      expect(screen.getByText('Data Science')).toBeInTheDocument();
      expect(screen.queryByText('Ciencia de Datos')).not.toBeInTheDocument();
    });

    it('should display level label in Spanish', () => {
      i18n.changeLanguage('es');
      const skill = createMockSkill({ level: 'intermediate' });
      renderSkillCard(skill);

      expect(screen.getByText('Intermedio')).toBeInTheDocument();
    });

    it('should display level label in English', () => {
      i18n.changeLanguage('en');
      const skill = createMockSkill({ level: 'intermediate' });
      renderSkillCard(skill);

      expect(screen.getByText('Intermediate')).toBeInTheDocument();
    });
  });

  describe('Styling and Visual Feedback', () => {
    it('should have hover effect classes', () => {
      const skill = createMockSkill();
      const { container } = renderSkillCard(skill);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('hover:shadow-md');
      expect(card).toHaveClass('transition-shadow');
    });

    it('should apply correct color for expert level', () => {
      const skill = createMockSkill({ level: 'expert' });
      const { container } = renderSkillCard(skill);

      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveClass('bg-green-500');
    });

    it('should apply correct color for advanced level', () => {
      const skill = createMockSkill({ level: 'advanced' });
      const { container } = renderSkillCard(skill);

      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveClass('bg-blue-500');
    });

    it('should apply correct color for intermediate level', () => {
      const skill = createMockSkill({ level: 'intermediate' });
      const { container } = renderSkillCard(skill);

      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveClass('bg-yellow-500');
    });

    it('should apply correct color for basic level', () => {
      const skill = createMockSkill({ level: 'basic' });
      const { container } = renderSkillCard(skill);

      const progressBar = container.querySelector('[role="progressbar"]');
      expect(progressBar).toHaveClass('bg-gray-400');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on progress bar', () => {
      const skill = createMockSkill();
      renderSkillCard(skill);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-label');
    });

    it('should have semantic HTML structure', () => {
      const skill = createMockSkill();
      const { container } = renderSkillCard(skill);

      const heading = container.querySelector('h3');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Python');
    });
  });
});
