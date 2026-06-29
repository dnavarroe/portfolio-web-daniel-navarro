# SEO Implementation Documentation

## Overview

This document describes the SEO (Search Engine Optimization) implementation for the Daniel Navarro Portfolio website. The implementation includes meta tags, Open Graph tags, Twitter Cards, structured data (JSON-LD), sitemap.xml, and robots.txt.

## Components

### 1. SEO Component (`src/components/SEO.tsx`)

The SEO component is a reusable React component that manages all meta tags and structured data for each page.

**Features:**
- Dynamic page titles with site branding
- Meta description tags
- Open Graph tags for social media sharing
- Twitter Card tags
- Structured data (JSON-LD) support
- Language-aware locale settings
- Automatic fallback to default values

**Usage:**
```tsx
import SEO from '../components/SEO';

<SEO
  title="Page Title"
  description="Page description"
  image="https://example.com/image.jpg"
  type="website" // or "article"
  structuredData={structuredDataObject}
/>
```

**Props:**
- `title` (optional): Page-specific title (will be appended to site title)
- `description` (optional): Page description (falls back to default)
- `image` (optional): Page image URL (falls back to default OG image)
- `url` (optional): Canonical URL (defaults to current URL)
- `type` (optional): Open Graph type - "website" or "article" (default: "website")
- `structuredData` (optional): JSON-LD structured data object

### 2. Structured Data Utilities (`src/utils/structuredData.ts`)

Helper functions to generate Schema.org structured data in JSON-LD format.

**Functions:**

#### `generatePersonStructuredData(lang: 'es' | 'en')`
Generates Person schema for the homepage.

**Returns:**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Daniel Navarro",
  "url": "...",
  "image": "...",
  "jobTitle": "Data Scientist",
  "description": "...",
  "sameAs": ["linkedin-url", "github-url"]
}
```

#### `generateProjectStructuredData(project: Project, lang: 'es' | 'en')`
Generates CreativeWork schema for project detail pages.

**Returns:**
```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Project Name",
  "description": "Project description",
  "image": "...",
  "author": {
    "@type": "Person",
    "name": "Daniel Navarro"
  },
  "dateCreated": "2024-01-15",
  "keywords": "Python, React, TypeScript"
}
```

#### `generateWebsiteStructuredData(lang: 'es' | 'en')`
Generates WebSite schema for general pages.

**Returns:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Daniel Navarro - Portfolio",
  "url": "...",
  "description": "...",
  "author": {
    "@type": "Person",
    "name": "Daniel Navarro"
  },
  "inLanguage": ["es"]
}
```

## Page Integration

### HomePage
- **Title**: "Inicio | Daniel Navarro - Portfolio"
- **Description**: Personal summary from content
- **Structured Data**: Person schema
- **Type**: website

### ProjectsPage
- **Title**: "Mis Proyectos | Daniel Navarro - Portfolio"
- **Description**: Default meta description
- **Structured Data**: None (list page)
- **Type**: website

### ProjectDetailPage
- **Title**: "[Project Title] | Daniel Navarro - Portfolio"
- **Description**: Project short description
- **Image**: Project image
- **Structured Data**: CreativeWork schema
- **Type**: article

### SkillsPage
- **Title**: "Habilidades y Experiencia | Daniel Navarro - Portfolio"
- **Description**: Skills subtitle
- **Structured Data**: None
- **Type**: website

## Static Files

### sitemap.xml (`public/sitemap.xml`)

XML sitemap for search engines listing all main pages.

**Structure:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://danielnavarro.github.io/portfolio-web-daniel-navarro/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://danielnavarro.github.io/portfolio-web-daniel-navarro/#/projects</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://danielnavarro.github.io/portfolio-web-daniel-navarro/#/skills</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Note**: Uses hash-based URLs (#/) because the site uses HashRouter for GitHub Pages compatibility.

### robots.txt (`public/robots.txt`)

Robots exclusion protocol file allowing all search engines to index the site.

**Content:**
```
User-agent: *
Allow: /

Sitemap: https://danielnavarro.github.io/portfolio-web-daniel-navarro/sitemap.xml
```

## Meta Tags Generated

### Basic Meta Tags
- `<title>`: Unique, descriptive title for each page
- `<meta name="description">`: Page-specific description
- `<html lang="...">`: Language attribute (es or en)

### Open Graph Tags (Facebook, LinkedIn, etc.)
- `og:title`: Page title
- `og:description`: Page description
- `og:image`: Page image
- `og:url`: Canonical URL
- `og:type`: Content type (website or article)
- `og:locale`: Language locale (es_ES or en_US)

### Twitter Card Tags
- `twitter:card`: summary_large_image
- `twitter:title`: Page title
- `twitter:description`: Page description
- `twitter:image`: Page image

### Structured Data
- `<script type="application/ld+json">`: JSON-LD structured data

## Testing

### Unit Tests

**SEO Component Tests** (`src/components/SEO.test.tsx`):
- ✅ Renders custom title when provided
- ✅ Renders custom description when provided
- ✅ Renders Open Graph meta tags
- ✅ Renders Twitter Card meta tags
- ✅ Sets correct locale for Spanish
- ✅ Sets correct locale for English
- ✅ Renders structured data when provided
- ✅ Sets article type when specified
- ✅ Uses default image when no image provided
- ✅ Sets html lang attribute based on current language

**Structured Data Tests** (`src/utils/structuredData.test.ts`):
- ✅ Generates valid Person schema in Spanish
- ✅ Generates valid Person schema in English
- ✅ Includes social media links
- ✅ Includes image and url
- ✅ Generates valid CreativeWork schema in Spanish
- ✅ Generates valid CreativeWork schema in English
- ✅ Includes author information
- ✅ Includes technologies as keywords
- ✅ Includes project image with full URL
- ✅ Generates valid WebSite schema in Spanish
- ✅ Generates valid WebSite schema in English
- ✅ Includes website URL

**Integration Tests** (`src/pages/SEOIntegration.test.tsx`):
- ✅ Renders SEO meta tags on all pages
- ✅ Includes structured data on appropriate pages
- ✅ Includes Open Graph tags on all pages
- ✅ Has unique titles for each page
- ✅ Includes required Open Graph tags on all pages

### Running Tests

```bash
# Run all SEO-related tests
npm test -- src/components/SEO.test.tsx src/utils/structuredData.test.ts src/pages/SEOIntegration.test.tsx --run

# Run with coverage
npm run test:coverage
```

## Requirements Validation

This implementation validates the following requirements from the design document:

### Requirement 14.1: Meta tags de descripción
✅ Each page includes a unique meta description tag

### Requirement 14.2: Open Graph tags
✅ All pages include Open Graph tags for social media sharing

### Requirement 14.3: sitemap.xml
✅ sitemap.xml file created in public folder

### Requirement 14.4: robots.txt
✅ robots.txt file created in public folder

### Requirement 14.5: Títulos únicos y descriptivos
✅ Each page has a unique, descriptive title

### Requirement 14.6: Structured data (JSON-LD)
✅ Person schema on HomePage
✅ CreativeWork schema on ProjectDetailPage

## Best Practices Implemented

1. **Unique Titles**: Each page has a unique, descriptive title
2. **Descriptive Meta Descriptions**: Each page has a relevant description
3. **Open Graph Images**: All pages include appropriate images for social sharing
4. **Structured Data**: Proper Schema.org markup for Person and CreativeWork
5. **Language Awareness**: Meta tags adapt to current language (Spanish/English)
6. **Canonical URLs**: Each page specifies its canonical URL
7. **Sitemap**: XML sitemap for search engine crawlers
8. **Robots.txt**: Proper robots exclusion protocol file

## Future Enhancements

Potential improvements for future iterations:

1. **Dynamic Sitemap Generation**: Generate sitemap.xml dynamically based on content
2. **Additional Structured Data**: Add more schema types (Organization, BreadcrumbList)
3. **Rich Snippets**: Implement FAQ or HowTo schemas where applicable
4. **Social Media Previews**: Add specific preview images for each project
5. **Meta Keywords**: Consider adding keyword meta tags (though less important now)
6. **Canonical Tags**: Add explicit canonical link tags
7. **Alternate Language Tags**: Add hreflang tags for bilingual content

## Maintenance

### Updating URLs
When deploying to a different domain or repository:

1. Update `sitemap.xml` URLs
2. Update `robots.txt` sitemap URL
3. No code changes needed (SEO component uses `window.location.origin`)

### Adding New Pages
When adding new pages:

1. Add SEO component to the page
2. Provide appropriate title and description
3. Add structured data if applicable
4. Update sitemap.xml with new URL
5. Add tests for the new page's SEO

### Updating Structured Data
When updating structured data schemas:

1. Update utility functions in `src/utils/structuredData.ts`
2. Update tests in `src/utils/structuredData.test.ts`
3. Validate with [Google's Rich Results Test](https://search.google.com/test/rich-results)

## Resources

- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google Search Central](https://developers.google.com/search)
- [react-helmet-async Documentation](https://github.com/staylor/react-helmet-async)
