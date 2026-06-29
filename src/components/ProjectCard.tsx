import { useTranslation } from 'react-i18next';
import { OptimizedImage } from './OptimizedImage';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';

  return (
    <article
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in"
      role="button"
      tabIndex={0}
      aria-label={`${t('projects.viewDetails')}: ${project.title[currentLang]}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative overflow-hidden aspect-video">
        <OptimizedImage
          src={project.image}
          alt={project.title[currentLang]}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2 line-clamp-2">
          {project.title[currentLang]}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {project.shortDescription[currentLang]}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
