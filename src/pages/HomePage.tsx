import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ContentLoader } from '../services/ContentLoader';
import { OptimizedImage } from '../components/OptimizedImage';
import SEO from '../components/SEO';
import { generatePersonStructuredData } from '../utils/structuredData';
import type { PersonalInfo, Project, Skill } from '../types';

function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [mainSkills, setMainSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load personal info
      const personal = await ContentLoader.loadPersonalInfo();
      setPersonalInfo(personal);

      // Load projects and get first 3 featured ones
      const projects = await ContentLoader.loadProjects();
      const featured = projects.filter(p => p.featured).slice(0, 3);
      // If less than 3 featured, fill with most recent projects
      if (featured.length < 3) {
        const remaining = projects.filter(p => !p.featured).slice(0, 3 - featured.length);
        setFeaturedProjects([...featured, ...remaining]);
      } else {
        setFeaturedProjects(featured);
      }

      // Load skills and get first 6 main skills
      const skillsData = await ContentLoader.loadSkills();
      const allSkills: Skill[] = [];
      skillsData.technical.categories.forEach(category => {
        allSkills.push(...category.skills);
      });
      
      // If personal info has featuredSkills, use those IDs
      if (personal.featuredSkills && personal.featuredSkills.length > 0) {
        const featured = personal.featuredSkills
          .map(id => allSkills.find(s => s.id === id))
          .filter((s): s is Skill => s !== undefined)
          .slice(0, 6);
        setMainSkills(featured);
      } else {
        // Otherwise, take first 6 skills
        setMainSkills(allSkills.slice(0, 6));
      }

    } catch (err) {
      console.error('Error loading home page content:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">{t('common.loading', 'Cargando...')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600">
          {t('common.error', 'Error')}: {error}
        </div>
      </div>
    );
  }

  if (!personalInfo) {
    return null;
  }

  const currentLang = i18n.language as 'es' | 'en';

  return (
    <div className="animate-fade-in">
      <SEO
        title={t('nav.home')}
        description={personalInfo.summary[currentLang]}
        structuredData={generatePersonStructuredData(currentLang)}
      />
      
      {/* Hero Section - Personal Info */}
      <section className="mb-16 animate-slide-up">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <OptimizedImage
              src={personalInfo.photo}
              alt={personalInfo.name}
              className="w-48 h-48 rounded-full object-cover shadow-lg"
              loading="eager"
            />
          </div>

          {/* Personal Info */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-lg text-gray-600 mb-2">
              {t('home.greeting')}
            </p>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              {personalInfo.name}
            </h1>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl">
              {personalInfo.summary[currentLang]}
            </p>

            {/* Contact Links */}
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href={`mailto:${personalInfo.contacts.email}`}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                aria-label={`Email: ${personalInfo.contacts.email}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{t('home.contact')}</span>
              </a>

              <a
                href={personalInfo.contacts.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              <a
                href={personalInfo.contacts.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
            {t('home.featuredProjects')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                data-testid="featured-project"
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
                role="button"
                tabIndex={0}
                aria-label={`${t('projects.viewDetails')}: ${project.title[currentLang]}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/projects/${project.id}`);
                  }
                }}
              >
                <OptimizedImage
                  src={project.image}
                  alt={project.title[currentLang]}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                    {project.title[currentLang]}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {project.shortDescription[currentLang]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/projects')}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              aria-label={t('projects.viewAll')}
            >
              {t('projects.viewAll', 'Ver todos los proyectos')}
            </button>
          </div>
        </section>
      )}

      {/* Main Skills Section */}
      {mainSkills.length > 0 && (
        <section className="mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
            {t('home.mainSkills')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mainSkills.map((skill) => (
              <div
                key={skill.id}
                data-testid="main-skill"
                className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow"
              >
                {skill.icon && (
                  <div className="text-4xl mb-2 flex justify-center">
                    {skill.icon.startsWith('/') || skill.icon.startsWith('http') ? (
                      <img src={skill.icon} alt={skill.name[currentLang]} className="w-10 h-10 object-contain" />
                    ) : (
                      skill.icon
                    )}
                  </div>
                )}
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {skill.name[currentLang]}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    skill.level === 'expert'
                      ? 'bg-green-100 text-green-700'
                      : skill.level === 'advanced'
                      ? 'bg-blue-100 text-blue-700'
                      : skill.level === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {t(`skills.level.${skill.level}`)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/skills')}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              aria-label={t('skills.viewAll')}
            >
              {t('skills.viewAll', 'Ver todas las habilidades')}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
