/**
 * Content validation script for build time
 * Validates all content JSON files to ensure they meet requirements
 * 
 * This script validates:
 * - Project files have all required fields and correct format
 * - Skill files have all required fields
 * - Date format is ISO 8601 (YYYY-MM-DD)
 * - Image file paths exist
 * - Both Spanish (es) and English (en) translations are present
 * 
 * Exits with code 1 if validation fails, 0 if all validations pass
 */

import * as fs from 'fs';
import * as path from 'path';

const __dirname = process.cwd();

// Types for validation
interface LocalizedString {
  es: string;
  en: string;
}

interface Project {
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

interface Skill {
  id: string;
  name: LocalizedString;
  category: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  icon?: string;
}

interface ValidationError {
  file: string;
  field: string;
  message: string;
}

// Validation results
const errors: ValidationError[] = [];
const warnings: string[] = [];

/**
 * Validate that a LocalizedString has both es and en translations
 */
function validateLocalizedString(
  value: any,
  fieldName: string,
  fileName: string
): boolean {
  if (!value || typeof value !== 'object') {
    errors.push({
      file: fileName,
      field: fieldName,
      message: `Missing or invalid LocalizedString (expected object with 'es' and 'en' properties)`,
    });
    return false;
  }

  if (!value.es || typeof value.es !== 'string' || value.es.trim() === '') {
    errors.push({
      file: fileName,
      field: `${fieldName}.es`,
      message: `Missing or empty Spanish translation`,
    });
    return false;
  }

  if (!value.en || typeof value.en !== 'string' || value.en.trim() === '') {
    errors.push({
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
function validateDateFormat(date: string, fileName: string): boolean {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!iso8601Regex.test(date)) {
    errors.push({
      file: fileName,
      field: 'date',
      message: `Invalid date format '${date}' (expected ISO 8601 format: YYYY-MM-DD)`,
    });
    return false;
  }

  // Validate that the date is actually valid
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    errors.push({
      file: fileName,
      field: 'date',
      message: `Invalid date value '${date}' (date does not exist)`,
    });
    return false;
  }

  return true;
}

/**
 * Check if an image file exists
 */
function validateImageExists(imagePath: string, fileName: string, fieldName: string): boolean {
  // Remove leading slash and resolve relative to public directory
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const publicDir = path.join(__dirname, '..', 'public');
  const fullPath = path.join(publicDir, cleanPath);

  if (!fs.existsSync(fullPath)) {
    errors.push({
      file: fileName,
      field: fieldName,
      message: `Image file not found: ${imagePath} (looked in: ${fullPath})`,
    });
    return false;
  }

  return true;
}

/**
 * Validate a project file
 */
export function validateProject(project: any, fileName: string): boolean {
  let isValid = true;

  // Validate id
  if (!project.id || typeof project.id !== 'string' || project.id.trim() === '') {
    errors.push({
      file: fileName,
      field: 'id',
      message: 'Missing or empty id field',
    });
    isValid = false;
  }

  // Validate title (LocalizedString)
  if (!validateLocalizedString(project.title, 'title', fileName)) {
    isValid = false;
  }

  // Validate shortDescription (LocalizedString)
  if (!validateLocalizedString(project.shortDescription, 'shortDescription', fileName)) {
    isValid = false;
  }

  // Validate fullDescription (LocalizedString)
  if (!validateLocalizedString(project.fullDescription, 'fullDescription', fileName)) {
    isValid = false;
  }

  // Validate image
  if (!project.image || typeof project.image !== 'string' || project.image.trim() === '') {
    errors.push({
      file: fileName,
      field: 'image',
      message: 'Missing or empty image field',
    });
    isValid = false;
  } else {
    // Check if image file exists
    validateImageExists(project.image, fileName, 'image');
  }

  // Validate images array (optional)
  if (project.images) {
    if (!Array.isArray(project.images)) {
      errors.push({
        file: fileName,
        field: 'images',
        message: 'images field must be an array',
      });
      isValid = false;
    } else {
      project.images.forEach((img: any, index: number) => {
        if (typeof img !== 'string' || img.trim() === '') {
          errors.push({
            file: fileName,
            field: `images[${index}]`,
            message: 'Image path must be a non-empty string',
          });
          isValid = false;
        } else {
          validateImageExists(img, fileName, `images[${index}]`);
        }
      });
    }
  }

  // Validate technologies
  if (!project.technologies || !Array.isArray(project.technologies)) {
    errors.push({
      file: fileName,
      field: 'technologies',
      message: 'Missing or invalid technologies field (expected array)',
    });
    isValid = false;
  } else if (project.technologies.length === 0) {
    warnings.push(`${fileName}: technologies array is empty`);
  } else {
    project.technologies.forEach((tech: any, index: number) => {
      if (typeof tech !== 'string' || tech.trim() === '') {
        errors.push({
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
    errors.push({
      file: fileName,
      field: 'date',
      message: 'Missing or invalid date field',
    });
    isValid = false;
  } else {
    if (!validateDateFormat(project.date, fileName)) {
      isValid = false;
    }
  }

  // Validate optional featured field
  if (project.featured !== undefined && typeof project.featured !== 'boolean') {
    errors.push({
      file: fileName,
      field: 'featured',
      message: 'featured field must be a boolean',
    });
    isValid = false;
  }

  // Validate optional links field
  if (project.links !== undefined) {
    if (typeof project.links !== 'object' || project.links === null) {
      errors.push({
        file: fileName,
        field: 'links',
        message: 'links field must be an object',
      });
      isValid = false;
    } else {
      if (project.links.github !== undefined && typeof project.links.github !== 'string') {
        errors.push({
          file: fileName,
          field: 'links.github',
          message: 'links.github must be a string',
        });
        isValid = false;
      }
      if (project.links.demo !== undefined && typeof project.links.demo !== 'string') {
        errors.push({
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
 * Validate a skill file
 */
export function validateSkill(skill: any, fileName: string, skillIndex?: number): boolean {
  let isValid = true;
  const prefix = skillIndex !== undefined ? `skills[${skillIndex}]` : '';

  // Validate id
  if (!skill.id || typeof skill.id !== 'string' || skill.id.trim() === '') {
    errors.push({
      file: fileName,
      field: prefix ? `${prefix}.id` : 'id',
      message: 'Missing or empty id field',
    });
    isValid = false;
  }

  // Validate name (LocalizedString)
  if (!validateLocalizedString(skill.name, prefix ? `${prefix}.name` : 'name', fileName)) {
    isValid = false;
  }

  // Validate category
  if (!skill.category || typeof skill.category !== 'string' || skill.category.trim() === '') {
    errors.push({
      file: fileName,
      field: prefix ? `${prefix}.category` : 'category',
      message: 'Missing or empty category field',
    });
    isValid = false;
  }

  // Validate level
  const validLevels = ['basic', 'intermediate', 'advanced', 'expert'];
  if (!skill.level || !validLevels.includes(skill.level)) {
    errors.push({
      file: fileName,
      field: prefix ? `${prefix}.level` : 'level',
      message: `Invalid level '${skill.level}' (expected one of: ${validLevels.join(', ')})`,
    });
    isValid = false;
  }

  // Validate optional icon field
  if (skill.icon !== undefined && (typeof skill.icon !== 'string' || skill.icon.trim() === '')) {
    errors.push({
      file: fileName,
      field: prefix ? `${prefix}.icon` : 'icon',
      message: 'icon field must be a non-empty string if provided',
    });
    isValid = false;
  }

  return isValid;
}

/**
 * Validate all project files
 */
function validateProjects(): boolean {
  const projectsDir = path.join(__dirname, '..', 'public', 'content', 'projects');
  
  if (!fs.existsSync(projectsDir)) {
    console.error(`❌ Projects directory not found: ${projectsDir}`);
    return false;
  }

  // Read manifest.json
  const manifestPath = path.join(projectsDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error(`❌ Project manifest not found: ${manifestPath}`);
    return false;
  }

  let manifest: { files: string[] };
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);
  } catch (error) {
    console.error(`❌ Failed to parse manifest.json: ${error}`);
    return false;
  }

  if (!manifest.files || !Array.isArray(manifest.files)) {
    console.error(`❌ Invalid manifest.json: 'files' field must be an array`);
    return false;
  }

  console.log(`\n📋 Validating ${manifest.files.length} project file(s)...`);

  let allValid = true;
  for (const file of manifest.files) {
    const filePath = path.join(projectsDir, file);
    
    if (!fs.existsSync(filePath)) {
      errors.push({
        file,
        field: 'file',
        message: `Project file listed in manifest but not found: ${filePath}`,
      });
      allValid = false;
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const project = JSON.parse(content);
      
      if (!validateProject(project, file)) {
        allValid = false;
      }
    } catch (error) {
      errors.push({
        file,
        field: 'file',
        message: `Failed to parse JSON: ${error}`,
      });
      allValid = false;
    }
  }

  return allValid;
}

/**
 * Validate technical skills file
 */
function validateTechnicalSkills(): boolean {
  const skillsPath = path.join(__dirname, '..', 'public', 'content', 'skills', 'technical.json');
  
  if (!fs.existsSync(skillsPath)) {
    console.error(`❌ Technical skills file not found: ${skillsPath}`);
    return false;
  }

  console.log(`\n🎯 Validating technical skills...`);

  try {
    const content = fs.readFileSync(skillsPath, 'utf-8');
    const data = JSON.parse(content);

    if (!data.categories || !Array.isArray(data.categories)) {
      errors.push({
        file: 'technical.json',
        field: 'categories',
        message: 'Missing or invalid categories field (expected array)',
      });
      return false;
    }

    let allValid = true;
    data.categories.forEach((category: any, catIndex: number) => {
      // Validate category id
      if (!category.id || typeof category.id !== 'string') {
        errors.push({
          file: 'technical.json',
          field: `categories[${catIndex}].id`,
          message: 'Missing or invalid category id',
        });
        allValid = false;
      }

      // Validate category name
      if (!validateLocalizedString(category.name, `categories[${catIndex}].name`, 'technical.json')) {
        allValid = false;
      }

      // Validate skills array
      if (!category.skills || !Array.isArray(category.skills)) {
        errors.push({
          file: 'technical.json',
          field: `categories[${catIndex}].skills`,
          message: 'Missing or invalid skills field (expected array)',
        });
        allValid = false;
      } else {
        category.skills.forEach((skill: any, skillIndex: number) => {
          if (!validateSkill(skill, 'technical.json', skillIndex)) {
            allValid = false;
          }
        });
      }
    });

    return allValid;
  } catch (error) {
    errors.push({
      file: 'technical.json',
      field: 'file',
      message: `Failed to parse JSON: ${error}`,
    });
    return false;
  }
}

/**
 * Main validation function
 */
function main(): void {
  console.log('🔍 Starting content validation...\n');

  const projectsValid = validateProjects();
  const skillsValid = validateTechnicalSkills();

  // Print warnings
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach((warning) => {
      console.log(`   ${warning}`);
    });
  }

  // Print errors
  if (errors.length > 0) {
    console.log('\n❌ Validation failed with the following errors:\n');
    errors.forEach((error) => {
      console.log(`   File: ${error.file}`);
      console.log(`   Field: ${error.field}`);
      console.log(`   Error: ${error.message}`);
      console.log('');
    });
    console.log(`Total errors: ${errors.length}\n`);
    process.exit(1);
  }

  if (projectsValid && skillsValid) {
    console.log('\n✅ All content validation passed!\n');
    process.exit(0);
  } else {
    console.log('\n❌ Content validation failed!\n');
    process.exit(1);
  }
}

// Run validation
main();
