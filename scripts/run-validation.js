#!/usr/bin/env node
/**
 * Simple Node.js script to run content validation at build time
 * This script loads and validates all content files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple validation functions (duplicated from TypeScript for standalone execution)

function validateLocalizedString(value, fieldName, fileName, errors) {
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

function validateDateFormat(date, fileName, errors) {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!iso8601Regex.test(date)) {
    errors.push({
      file: fileName,
      field: 'date',
      message: `Invalid date format '${date}' (expected ISO 8601 format: YYYY-MM-DD)`,
    });
    return false;
  }

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

function validateProject(project, fileName, errors) {
  let isValid = true;

  if (!project.id || typeof project.id !== 'string' || project.id.trim() === '') {
    errors.push({ file: fileName, field: 'id', message: 'Missing or empty id field' });
    isValid = false;
  }

  if (!validateLocalizedString(project.title, 'title', fileName, errors)) {
    isValid = false;
  }

  if (!validateLocalizedString(project.shortDescription, 'shortDescription', fileName, errors)) {
    isValid = false;
  }

  if (!validateLocalizedString(project.fullDescription, 'fullDescription', fileName, errors)) {
    isValid = false;
  }

  if (!project.image || typeof project.image !== 'string' || project.image.trim() === '') {
    errors.push({ file: fileName, field: 'image', message: 'Missing or empty image field' });
    isValid = false;
  }

  if (!project.technologies || !Array.isArray(project.technologies)) {
    errors.push({ file: fileName, field: 'technologies', message: 'Missing or invalid technologies field (expected array)' });
    isValid = false;
  } else {
    project.technologies.forEach((tech, index) => {
      if (typeof tech !== 'string' || tech.trim() === '') {
        errors.push({ file: fileName, field: `technologies[${index}]`, message: 'Technology must be a non-empty string' });
        isValid = false;
      }
    });
  }

  if (!project.date || typeof project.date !== 'string') {
    errors.push({ file: fileName, field: 'date', message: 'Missing or invalid date field' });
    isValid = false;
  } else {
    if (!validateDateFormat(project.date, fileName, errors)) {
      isValid = false;
    }
  }

  return isValid;
}

function validateSkill(skill, fileName, skillIndex, errors) {
  let isValid = true;
  const prefix = skillIndex !== undefined ? `skills[${skillIndex}]` : '';

  if (!skill.id || typeof skill.id !== 'string' || skill.id.trim() === '') {
    errors.push({ file: fileName, field: prefix ? `${prefix}.id` : 'id', message: 'Missing or empty id field' });
    isValid = false;
  }

  if (!validateLocalizedString(skill.name, prefix ? `${prefix}.name` : 'name', fileName, errors)) {
    isValid = false;
  }

  if (!skill.category || typeof skill.category !== 'string' || skill.category.trim() === '') {
    errors.push({ file: fileName, field: prefix ? `${prefix}.category` : 'category', message: 'Missing or empty category field' });
    isValid = false;
  }

  const validLevels = ['basic', 'intermediate', 'advanced', 'expert'];
  if (!skill.level || !validLevels.includes(skill.level)) {
    errors.push({ file: fileName, field: prefix ? `${prefix}.level` : 'level', message: `Invalid level '${skill.level}' (expected one of: ${validLevels.join(', ')})` });
    isValid = false;
  }

  return isValid;
}

function validateProjects(errors) {
  const projectsDir = path.join(process.cwd(), 'public', 'content', 'projects');
  
  if (!fs.existsSync(projectsDir)) {
    console.error(`❌ Projects directory not found: ${projectsDir}`);
    return false;
  }

  const manifestPath = path.join(projectsDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error(`❌ Project manifest not found: ${manifestPath}`);
    return false;
  }

  let manifest;
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);
  } catch (error) {
    console.error(`❌ Failed to parse manifest.json: ${error.message}`);
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
      errors.push({ file, field: 'file', message: `Project file listed in manifest but not found: ${filePath}` });
      allValid = false;
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const project = JSON.parse(content);
      
      if (!validateProject(project, file, errors)) {
        allValid = false;
      }
    } catch (error) {
      errors.push({ file, field: 'file', message: `Failed to parse JSON: ${error.message}` });
      allValid = false;
    }
  }

  return allValid;
}

function validateTechnicalSkills(errors) {
  const skillsPath = path.join(process.cwd(), 'public', 'content', 'skills', 'technical.json');
  
  if (!fs.existsSync(skillsPath)) {
    console.error(`❌ Technical skills file not found: ${skillsPath}`);
    return false;
  }

  console.log(`\n🎯 Validating technical skills...`);

  try {
    const content = fs.readFileSync(skillsPath, 'utf-8');
    const data = JSON.parse(content);

    if (!data.categories || !Array.isArray(data.categories)) {
      errors.push({ file: 'technical.json', field: 'categories', message: 'Missing or invalid categories field (expected array)' });
      return false;
    }

    let allValid = true;
    data.categories.forEach((category, catIndex) => {
      if (!category.id || typeof category.id !== 'string') {
        errors.push({ file: 'technical.json', field: `categories[${catIndex}].id`, message: 'Missing or invalid category id' });
        allValid = false;
      }

      if (!validateLocalizedString(category.name, `categories[${catIndex}].name`, 'technical.json', errors)) {
        allValid = false;
      }

      if (!category.skills || !Array.isArray(category.skills)) {
        errors.push({ file: 'technical.json', field: `categories[${catIndex}].skills`, message: 'Missing or invalid skills field (expected array)' });
        allValid = false;
      } else {
        category.skills.forEach((skill, skillIndex) => {
          if (!validateSkill(skill, 'technical.json', skillIndex, errors)) {
            allValid = false;
          }
        });
      }
    });

    return allValid;
  } catch (error) {
    errors.push({ file: 'technical.json', field: 'file', message: `Failed to parse JSON: ${error.message}` });
    return false;
  }
}

function main() {
  console.log('🔍 Starting content validation...\n');

  const errors = [];
  const projectsValid = validateProjects(errors);
  const skillsValid = validateTechnicalSkills(errors);

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

main();
