/**
 * Content validation utilities for build time validation
 * Can be used both in tests and in build scripts
 */

export interface LocalizedString {
  es: string;
  en: string;
}

export interface Project {
  id: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  fullDescription: LocalizedString;
  image: string;
  images?: string[];
  technologies: string[];
  date: string;
  featured?: boolean;
  links?: {
    github?: string;
    demo?: string;
  };
}

export interface Skill {
  id: string;
  name: LocalizedString;
  category: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  icon?: string;
}

export interface ValidationError {
  file: string;
  field: string;
  message: string;
}

export class ContentValidator {
  private errors: ValidationError[] = [];

  getErrors(): ValidationError[] {
    return this.errors;
  }

  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Validate that a LocalizedString has both es and en translations
   */
  validateLocalizedString(
    value: any,
    fieldName: string,
    fileName: string
  ): boolean {
    if (!value || typeof value !== 'object') {
      this.errors.push({
        file: fileName,
        field: fieldName,
        message: `Missing or invalid LocalizedString (expected object with 'es' and 'en' properties)`,
      });
      return false;
    }

    if (!value.es || typeof value.es !== 'string' || value.es.trim() === '') {
      this.errors.push({
        file: fileName,
        field: `${fieldName}.es`,
        message: `Missing or empty Spanish translation`,
      });
      return false;
    }

    if (!value.en || typeof value.en !== 'string' || value.en.trim() === '') {
      this.errors.push({
        file: fileName,
        field: `${fieldName}.en`,
        message: `Missing or empty English translation`,
      });
      return false;
    }

    return true;
  }

  /**
   * Validate date format is ISO 8601 (YYYY-MM-DD)
   */
  validateDateFormat(date: string, fileName: string): boolean {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}$/;
    
    if (!iso8601Regex.test(date)) {
      this.errors.push({
        file: fileName,
        field: 'date',
        message: `Invalid date format '${date}' (expected ISO 8601 format: YYYY-MM-DD)`,
      });
      return false;
    }

    // Validate that the date is actually valid
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      this.errors.push({
        file: fileName,
        field: 'date',
        message: `Invalid date value '${date}' (date does not exist)`,
      });
      return false;
    }

    return true;
  }

  /**
   * Validate a project object
   */
  validateProject(project: any, fileName: string): boolean {
    let isValid = true;

    // Validate id
    if (!project.id || typeof project.id !== 'string' || project.id.trim() === '') {
      this.errors.push({
        file: fileName,
        field: 'id',
        message: 'Missing or empty id field',
      });
      isValid = false;
    }

    // Validate title (LocalizedString)
    if (!this.validateLocalizedString(project.title, 'title', fileName)) {
      isValid = false;
    }

    // Validate shortDescription (LocalizedString)
    if (!this.validateLocalizedString(project.shortDescription, 'shortDescription', fileName)) {
      isValid = false;
    }

    // Validate fullDescription (LocalizedString)
    if (!this.validateLocalizedString(project.fullDescription, 'fullDescription', fileName)) {
      isValid = false;
    }

    // Validate image
    if (!project.image || typeof project.image !== 'string' || project.image.trim() === '') {
      this.errors.push({
        file: fileName,
        field: 'image',
        message: 'Missing or empty image field',
      });
      isValid = false;
    }

    // Validate images array (optional)
    if (project.images !== undefined) {
      if (!Array.isArray(project.images)) {
        this.errors.push({
          file: fileName,
          field: 'images',
          message: 'images field must be an array',
        });
        isValid = false;
      } else {
        project.images.forEach((img: any, index: number) => {
          if (typeof img !== 'string' || img.trim() === '') {
            this.errors.push({
              file: fileName,
              field: `images[${index}]`,
              message: 'Image path must be a non-empty string',
            });
            isValid = false;
          }
        });
      }
    }

    // Validate technologies
    if (!project.technologies || !Array.isArray(project.technologies)) {
      this.errors.push({
        file: fileName,
        field: 'technologies',
        message: 'Missing or invalid technologies field (expected array)',
      });
      isValid = false;
    } else {
      project.technologies.forEach((tech: any, index: number) => {
        if (typeof tech !== 'string' || tech.trim() === '') {
          this.errors.push({
            file: fileName,
            field: `technologies[${index}]`,
            message: 'Technology must be a non-empty string',
          });
          isValid = false;
        }
      });
    }

    // Validate date
    if (!project.date || typeof project.date !== 'string') {
      this.errors.push({
        file: fileName,
        field: 'date',
        message: 'Missing or invalid date field',
      });
      isValid = false;
    } else {
      if (!this.validateDateFormat(project.date, fileName)) {
        isValid = false;
      }
    }

    // Validate optional featured field
    if (project.featured !== undefined && typeof project.featured !== 'boolean') {
      this.errors.push({
        file: fileName,
        field: 'featured',
        message: 'featured field must be a boolean',
      });
      isValid = false;
    }

    // Validate optional links field
    if (project.links !== undefined) {
      if (typeof project.links !== 'object' || project.links === null) {
        this.errors.push({
          file: fileName,
          field: 'links',
          message: 'links field must be an object',
        });
        isValid = false;
      } else {
        if (project.links.github !== undefined && typeof project.links.github !== 'string') {
          this.errors.push({
            file: fileName,
            field: 'links.github',
            message: 'links.github must be a string',
          });
          isValid = false;
        }
        if (project.links.demo !== undefined && typeof project.links.demo !== 'string') {
          this.errors.push({
            file: fileName,
            field: 'links.demo',
            message: 'links.demo must be a string',
          });
          isValid = false;
        }
      }
    }

    return isValid;
  }

  /**
   * Validate a skill object
   */
  validateSkill(skill: any, fileName: string, skillIndex?: number): boolean {
    let isValid = true;
    const prefix = skillIndex !== undefined ? `skills[${skillIndex}]` : '';

    // Validate id
    if (!skill.id || typeof skill.id !== 'string' || skill.id.trim() === '') {
      this.errors.push({
        file: fileName,
        field: prefix ? `${prefix}.id` : 'id',
        message: 'Missing or empty id field',
      });
      isValid = false;
    }

    // Validate name (LocalizedString)
    if (!this.validateLocalizedString(skill.name, prefix ? `${prefix}.name` : 'name', fileName)) {
      isValid = false;
    }

    // Validate category
    if (!skill.category || typeof skill.category !== 'string' || skill.category.trim() === '') {
      this.errors.push({
        file: fileName,
        field: prefix ? `${prefix}.category` : 'category',
        message: 'Missing or empty category field',
      });
      isValid = false;
    }

    // Validate level
    const validLevels = ['basic', 'intermediate', 'advanced', 'expert'];
    if (!skill.level || !validLevels.includes(skill.level)) {
      this.errors.push({
        file: fileName,
        field: prefix ? `${prefix}.level` : 'level',
        message: `Invalid level '${skill.level}' (expected one of: ${validLevels.join(', ')})`,
      });
      isValid = false;
    }

    // Validate optional icon field
    if (skill.icon !== undefined && (typeof skill.icon !== 'string' || skill.icon.trim() === '')) {
      this.errors.push({
        file: fileName,
        field: prefix ? `${prefix}.icon` : 'icon',
        message: 'icon field must be a non-empty string if provided',
      });
      isValid = false;
    }

    return isValid;
  }
}
