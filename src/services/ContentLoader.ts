import type {
  PersonalInfo,
  Project,
  SkillsData,
  TechnicalSkillsData,
  EducationData,
  CertificationsData,
  ExperienceData,
} from '../types';

/**
 * ContentLoader service for loading content from JSON files
 * Implements caching to avoid duplicate loads
 * Handles errors with descriptive messages
 */
export class ContentLoader {
  private static cache: Map<string, unknown> = new Map();

  /**
   * Load personal information from /content/personal.json
   * @returns Promise<PersonalInfo>
   * @throws Error with descriptive message if loading fails
   */
  static async loadPersonalInfo(): Promise<PersonalInfo> {
    return this.loadJSON<PersonalInfo>('/content/personal.json');
  }

  /**
   * Load all projects from /content/projects/*.json files
   * Uses manifest.json to get list of project files
   * Sorts projects by date (most recent first)
   * @returns Promise<Project[]> sorted by date descending
   * @throws Error with descriptive message if loading fails
   */
  static async loadProjects(): Promise<Project[]> {
    try {
      const projectFiles = await this.getProjectFiles();
      const projects = await Promise.all(
        projectFiles.map((file) =>
          this.loadJSON<Project>(`/content/projects/${file}`)
        )
      );

      // Sort projects by date (most recent first)
      return projects.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
    } catch (error) {
      throw new Error(
        `Failed to load projects: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load a single project by ID from /content/projects/{id}.json
   * @param id - Project ID
   * @returns Promise<Project>
   * @throws Error with descriptive message if loading fails or project not found
   */
  static async loadProject(id: string): Promise<Project> {
    try {
      return await this.loadJSON<Project>(`/content/projects/${id}.json`);
    } catch (error) {
      throw new Error(
        `Failed to load project '${id}': ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load all skills data from multiple files:
   * - /content/skills/technical.json
   * - /content/skills/education.json
   * - /content/skills/certifications.json
   * - /content/skills/experience.json
   * @returns Promise<SkillsData>
   * @throws Error with descriptive message if loading fails
   */
  static async loadSkills(): Promise<SkillsData> {
    try {
      const [technical, education, certifications, experience] =
        await Promise.all([
          this.loadJSON<TechnicalSkillsData>('/content/skills/technical.json'),
          this.loadJSON<EducationData>('/content/skills/education.json'),
          this.loadJSON<CertificationsData>(
            '/content/skills/certifications.json'
          ),
          this.loadJSON<ExperienceData>('/content/skills/experience.json'),
        ]);

      return {
        technical,
        education,
        certifications,
        experience,
      };
    } catch (error) {
      throw new Error(
        `Failed to load skills data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load JSON file from given path with caching
   * @param path - Path to JSON file relative to public directory
   * @returns Promise<T> parsed JSON data
   * @throws Error if fetch fails or JSON parsing fails
   */
  private static resolvePath(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const baseUrl = import.meta.env.BASE_URL || '/';
    return `${baseUrl}${cleanPath}`;
  }

  private static async loadJSON<T>(path: string): Promise<T> {
    const resolvedPath = this.resolvePath(path);
    // Check cache first
    if (this.cache.has(resolvedPath)) {
      return this.cache.get(resolvedPath) as T;
    }

    try {
      const response = await fetch(resolvedPath);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      
      // Store in cache
      this.cache.set(resolvedPath, data);
      
      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load ${path}: ${error.message}`);
      }
      throw new Error(`Failed to load ${path}: Unknown error`);
    }
  }

  /**
   * Get list of project files from manifest.json
   * @returns Promise<string[]> array of project filenames
   * @throws Error if manifest.json cannot be loaded
   */
  private static async getProjectFiles(): Promise<string[]> {
    try {
      const manifest = await this.loadJSON<{ files: string[] }>(
        '/content/projects/manifest.json'
      );
      return manifest.files;
    } catch (error) {
      throw new Error(
        `Failed to load project manifest: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Clear the content cache
   * Useful for testing or forcing reload of content
   */
  static clearCache(): void {
    this.cache.clear();
  }
}
