# Content Validation Scripts

This directory contains scripts for validating content JSON files at build time.

## Files

- `run-validation.js` - Standalone Node.js script that validates all content files
- `validate-content.ts` - TypeScript version with detailed validation logic (for reference)
- `validate-content.test.ts` - Unit tests for validation functions

## Usage

### Running Validation Manually

```bash
node scripts/run-validation.js
```

### Running Validation as Part of Build

The validation script is automatically run during the build process:

```bash
npm run build
```

This will:
1. Run content validation (`npm run validate:content`)
2. Compile TypeScript (`tsc`)
3. Build the project (`vite build`)

If validation fails, the build will stop and display descriptive error messages.

### Running Validation Tests

```bash
npm test -- scripts/validate-content.test.ts --run
```

## What Gets Validated

### Project Files (`public/content/projects/*.json`)

Required fields:
- `id` (string): Unique project identifier
- `title` (LocalizedString): Project title in Spanish and English
- `shortDescription` (LocalizedString): Brief description (max 100 words)
- `fullDescription` (LocalizedString): Complete description
- `image` (string): Path to main project image
- `technologies` (string[]): Array of technology names
- `date` (string): Project date in ISO 8601 format (YYYY-MM-DD)

Optional fields:
- `images` (string[]): Additional project images
- `featured` (boolean): Whether project is featured
- `links.github` (string): GitHub repository URL
- `links.demo` (string): Live demo URL

### Skill Files (`public/content/skills/technical.json`)

Each skill must have:
- `id` (string): Unique skill identifier
- `name` (LocalizedString): Skill name in Spanish and English
- `category` (string): Skill category
- `level` (string): One of: 'basic', 'intermediate', 'advanced', 'expert'

Optional fields:
- `icon` (string): Icon identifier

### LocalizedString Format

All LocalizedString fields must have both Spanish and English translations:

```json
{
  "es": "Texto en español",
  "en": "Text in English"
}
```

### Date Format

Dates must be in ISO 8601 format: `YYYY-MM-DD`

Examples:
- ✅ `2024-01-15`
- ✅ `2023-12-31`
- ❌ `01/15/2024`
- ❌ `2024-1-5`
- ❌ `15-01-2024`

## Error Messages

The validation script provides descriptive error messages indicating:
- Which file has the error
- Which field is problematic
- What the specific issue is

Example output:

```
❌ Validation failed with the following errors:

   File: project-1.json
   Field: date
   Error: Invalid date format '01/15/2024' (expected ISO 8601 format: YYYY-MM-DD)

   File: project-2.json
   Field: title.es
   Error: Missing or empty Spanish translation

Total errors: 2
```

## Adding New Validations

To add new validation rules:

1. Update `src/utils/contentValidation.ts` with the new validation logic
2. Add corresponding tests in `scripts/validate-content.test.ts`
3. Update `scripts/run-validation.js` if the validation needs to run at build time
4. Update this README with the new validation rules

## Integration with CI/CD

The validation script is designed to work in CI/CD pipelines:
- Returns exit code 0 on success
- Returns exit code 1 on failure
- Outputs clear error messages to stdout

This ensures that invalid content cannot be deployed.
