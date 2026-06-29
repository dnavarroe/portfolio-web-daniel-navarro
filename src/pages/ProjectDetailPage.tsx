import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentLoader } from '../services/ContentLoader';
import SEO from '../components/SEO';
import { generateProjectStructuredData } from '../utils/structuredData';
import type { Project } from '../types';

function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) {
        setError('notFound');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const projectData = await ContentLoader.loadProject(projectId);
        setProject(projectData);
      } catch (err) {
        console.error('Failed to load project:', err);
        setError('notFound');
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [projectId]);

  const currentLang = i18n.language as 'es' | 'en';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600 text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="animate-fade-in">
        <button
          onClick={() => navigate('/projects')}
          className="mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 transition-colors"
          aria-label={t('projects.backToList')}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t('projects.backToList')}
        </button>
        <div className="text-center py-12">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">
            {t('projects.notFound')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('projects.notFoundDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <SEO
        title={project.title[currentLang]}
        description={project.shortDescription[currentLang]}
        image={`${window.location.origin}${project.image}`}
        type="article"
        structuredData={generateProjectStructuredData(project, currentLang)}
      />
      
      {/* Back button */}
      <button
        onClick={() => navigate('/projects')}
        className="mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 transition-colors"
        aria-label={t('projects.backToList')}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {t('projects.backToList')}
      </button>

      {/* Project title */}
      <h1 className="text-4xl font-heading font-bold text-gray-900 mb-6">
        {project.title[currentLang]}
      </h1>


      {/* Technologies */}
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">
          {t('projects.technologies')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Full description */}
      <div className="mb-8">
        <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
          {project.fullDescription[currentLang]}
        </div>
      </div>


      {/* Links */}
      {project.links && (project.links.github || project.links.demo) && (
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">
            {t('projects.links')}
          </h2>
          <div className="flex flex-wrap gap-4">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {t('projects.sourceCode')}
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                {t('projects.liveDemo')}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetailPage;
