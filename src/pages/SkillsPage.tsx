import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentLoader } from '../services/ContentLoader';
import { SkillCard } from '../components/SkillCard';
import SEO from '../components/SEO';
import type { SkillsData } from '../types';

function SkillsPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';
  const [skillsData, setSkillsData] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSkillsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ContentLoader.loadSkills();
        setSkillsData(data);
      } catch (err) {
        console.error('Error loading skills data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadSkillsData();
  }, []);

  if (loading) {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !skillsData) {
    return (
      <div className="animate-fade-in">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold mb-2">{t('errors.loadFailed')}</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12">
      <SEO
        title={t('skills.title')}
        description={t('skills.subtitle')}
      />
      
      {/* Page Title */}
      <header>
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">
          {t('skills.title')}
        </h1>
        <p className="text-gray-600 text-lg">
          {t('skills.subtitle')}
        </p>
      </header>

      {/* Technical Skills Section */}
      <section aria-labelledby="technical-skills-heading">
        <h2 id="technical-skills-heading" className="text-2xl font-heading font-bold text-gray-900 mb-6">
          {t('skills.technical')}
        </h2>
        
        <div className="space-y-8">
          {skillsData.technical.categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                {category.name[currentLang]}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section aria-labelledby="education-heading" className="bg-gray-50 rounded-lg p-6">
        <h2 id="education-heading" className="text-2xl font-heading font-bold text-gray-900 mb-6">
          {t('skills.education')}
        </h2>
        
        <div className="space-y-4">
          {skillsData.education.education.map((edu) => (
            <div key={edu.id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {edu.degree[currentLang]}
              </h3>
              <p className="text-gray-700 mb-1">
                {edu.institution[currentLang]}
              </p>
              <p className="text-sm text-gray-500">
                {edu.year}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section aria-labelledby="certifications-heading">
        <h2 id="certifications-heading" className="text-2xl font-heading font-bold text-gray-900 mb-6">
          {t('skills.certifications')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillsData.certifications.certifications.map((cert) => (
            <div key={cert.id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow duration-200 border-l-4 border-primary-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {cert.name[currentLang]}
              </h3>
              <p className="text-gray-700 mb-1">
                {cert.issuer[currentLang]}
              </p>
              <p className="text-sm text-gray-500">
                {cert.year}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section aria-labelledby="experience-heading" className="bg-gray-50 rounded-lg p-6">
        <h2 id="experience-heading" className="text-2xl font-heading font-bold text-gray-900 mb-6">
          {t('skills.experience')}
        </h2>
        
        <div className="space-y-6">
          {skillsData.experience.experience.map((exp) => (
            <div key={exp.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {exp.position[currentLang]}
                  </h3>
                  <p className="text-lg text-gray-700">
                    {exp.company[currentLang]}
                  </p>
                </div>
                <p className="text-sm text-gray-500 md:text-right mt-2 md:mt-0">
                  {exp.period}
                </p>
              </div>
              <p className="text-gray-600">
                {exp.description[currentLang]}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SkillsPage;
