// Common types for the portfolio application

export type LocalizedString = {
  es: string;
  en: string;
};

export interface PersonalInfo {
  name: string;
  photo: string;
  summary: LocalizedString;
  contacts: {
    email: string;
    linkedin: string;
    github: string;
  };
  featuredSkills?: string[];
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

export interface Education {
  id: string;
  institution: LocalizedString;
  degree: LocalizedString;
  year: string;
}

export interface Certification {
  id: string;
  name: LocalizedString;
  issuer: LocalizedString;
  year: string;
}

export interface Experience {
  id: string;
  company: LocalizedString;
  position: LocalizedString;
  period: string;
  description: LocalizedString;
}

// Component Props Types

export interface LayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  currentLanguage: 'es' | 'en';
  onLanguageChange: (lang: 'es' | 'en') => void;
}

export interface LanguageSelectorProps {
  currentLanguage: 'es' | 'en';
  onChange: (lang: 'es' | 'en') => void;
}

export interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

export interface SkillCardProps {
  skill: Skill;
}

export interface OptimizedImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

// Aggregate data types

export interface SkillCategory {
  id: string;
  name: LocalizedString;
  skills: Skill[];
}

export interface TechnicalSkillsData {
  categories: SkillCategory[];
}

export interface EducationData {
  education: Education[];
}

export interface CertificationsData {
  certifications: Certification[];
}

export interface ExperienceData {
  experience: Experience[];
}

export interface SkillsData {
  technical: TechnicalSkillsData;
  education: EducationData;
  certifications: CertificationsData;
  experience: ExperienceData;
}
