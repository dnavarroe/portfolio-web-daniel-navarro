import type { Project } from '../types';

export function generatePersonStructuredData(lang: 'es' | 'en') {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Daniel Navarro",
    "url": window.location.origin,
    "image": `${window.location.origin}/content/images/profile.jpg`,
    "jobTitle": lang === 'es' ? "Científico de Datos" : "Data Scientist",
    "description": lang === 'es' 
      ? "Científico de datos especializado en análisis de datos y machine learning"
      : "Data scientist specialized in data analysis and machine learning",
    "sameAs": [
      "https://linkedin.com/in/daniel-navarro",
      "https://github.com/danielnavarro"
    ]
  };
}

export function generateProjectStructuredData(project: Project, lang: 'es' | 'en') {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title[lang],
    "description": project.shortDescription[lang],
    "image": `${window.location.origin}${project.image}`,
    "author": {
      "@type": "Person",
      "name": "Daniel Navarro"
    },
    "dateCreated": project.date,
    "keywords": project.technologies.join(', ')
  };
}

export function generateWebsiteStructuredData(lang: 'es' | 'en') {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Daniel Navarro - Portfolio",
    "url": window.location.origin,
    "description": lang === 'es'
      ? "Portafolio profesional de Daniel Navarro, científico de datos"
      : "Professional portfolio of Daniel Navarro, data scientist",
    "author": {
      "@type": "Person",
      "name": "Daniel Navarro"
    },
    "inLanguage": [lang]
  };
}
