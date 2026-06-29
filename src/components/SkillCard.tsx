import { useTranslation } from 'react-i18next';
import type { Skill } from '../types';

interface SkillCardProps {
  skill: Skill;
}

const resolveImagePath = (path: string): string => {
  if (path.startsWith('/')) {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}${path}`;
  }
  return path;
};

export function SkillCard({ skill }: SkillCardProps) {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';

  // Map skill level to visual representation
  const getLevelColor = (level: Skill['level']): string => {
    switch (level) {
      case 'expert':
        return 'bg-green-500';
      case 'advanced':
        return 'bg-blue-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'basic':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getLevelWidth = (level: Skill['level']): string => {
    switch (level) {
      case 'expert':
        return 'w-full';
      case 'advanced':
        return 'w-3/4';
      case 'intermediate':
        return 'w-1/2';
      case 'basic':
        return 'w-1/4';
      default:
        return 'w-1/4';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-3">
        {skill.icon && (
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-50 rounded-lg">
            {skill.icon.startsWith('/') || skill.icon.startsWith('http') ? (
              <img
                src={resolveImagePath(skill.icon)}
                alt={skill.name[currentLang]}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <span className="text-2xl" role="img" aria-label={skill.name[currentLang]}>
                {skill.icon}
              </span>
            )}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {skill.name[currentLang]}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">
            {t(`skills.level.${skill.level}`)}
          </p>
          
          {/* Progress bar visualization */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${getLevelColor(skill.level)} ${getLevelWidth(skill.level)} transition-all duration-300`}
              role="progressbar"
              aria-valuenow={
                skill.level === 'expert' ? 100 :
                skill.level === 'advanced' ? 75 :
                skill.level === 'intermediate' ? 50 : 25
              }
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${skill.name[currentLang]} - ${t(`skills.level.${skill.level}`)}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
