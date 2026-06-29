# Plan de Implementación: Portafolio Web Personal

## Visión General

Este plan desglosa la implementación del portafolio web personal de Daniel Navarro en tareas incrementales. El proyecto utiliza React + Vite + TypeScript + Tailwind CSS, con soporte bilingüe (Español/Inglés) y despliegue en GitHub Pages.

## Tareas

- [x] 1. Configurar estructura del proyecto y dependencias base
  - Inicializar proyecto con Vite + React + TypeScript
  - Instalar dependencias: react-router-dom, react-i18next, tailwind CSS, vitest, fast-check
  - Configurar Tailwind CSS con tema personalizado (colores, fuentes, animaciones)
  - Configurar Vitest para testing
  - Crear estructura de carpetas: src/components, src/pages, src/services, src/i18n, src/types, public/content
  - _Requisitos: 11.2_

- [x] 2. Implementar sistema de tipos y modelos de datos
  - [x] 2.1 Crear interfaces TypeScript para todos los modelos de datos
    - Definir tipos: LocalizedString, PersonalInfo, Project, Skill, Education, Certification, Experience
    - Crear tipos para props de componentes principales
    - _Requisitos: 7.2, 8.2_
  
  - [ ]* 2.2 Escribir test de propiedad para validación de estructura de proyectos
    - **Propiedad 10: Carga válida de archivos de proyecto**
    - **Valida: Requisitos 7.1, 7.2, 7.3**

- [x] 3. Configurar sistema de internacionalización (i18n)
  - [x] 3.1 Configurar react-i18next con detección de idioma y persistencia
    - Crear archivo de configuración i18n con fallback a español
    - Configurar detección desde localStorage y navegador
    - Implementar persistencia de preferencia de idioma
    - _Requisitos: 6.1, 6.5, 6.6_
  
  - [x] 3.2 Crear archivos de traducción para español e inglés
    - Crear src/i18n/locales/es.json con todas las traducciones
    - Crear src/i18n/locales/en.json con todas las traducciones
    - Incluir traducciones para navegación, home, proyectos, habilidades, errores
    - _Requisitos: 6.2, 6.3_
  
  - [ ]* 3.3 Escribir test de propiedad para localización de contenido
    - **Propiedad 8: Localización correcta de contenido**
    - **Valida: Requisitos 6.2, 6.3**
  
  - [ ]* 3.4 Escribir test de propiedad para persistencia de idioma
    - **Propiedad 9: Persistencia de preferencia de idioma (Round-trip)**
    - **Valida: Requisitos 6.5**

- [x] 4. Implementar servicio de carga de contenido
  - [x] 4.1 Crear ContentLoader con métodos para cargar todos los tipos de contenido
    - Implementar loadPersonalInfo(), loadProjects(), loadProject(id), loadSkills()
    - Implementar caché de contenido para evitar cargas duplicadas
    - Implementar ordenamiento de proyectos por fecha
    - Manejar errores de carga con mensajes descriptivos
    - _Requisitos: 3.6, 7.1, 7.3, 8.1, 8.3_
  
  - [x] 4.2 Crear scripts de validación de contenido para build time
    - Implementar validateProject() para verificar campos requeridos y formato
    - Implementar validateSkill() para verificar campos requeridos
    - Validar formato de fechas (ISO 8601)
    - Validar existencia de archivos de imágenes
    - Validar presencia de traducciones en ambos idiomas
    - _Requisitos: 7.4, 8.4_
  
  - [ ]* 4.3 Escribir test de propiedad para ordenamiento cronológico
    - **Propiedad 2: Ordenamiento cronológico de proyectos**
    - **Valida: Requisitos 3.6**
  
  - [ ]* 4.4 Escribir test de propiedad para validación de archivos inválidos
    - **Propiedad 11: Validación de archivos de proyecto inválidos**
    - **Propiedad 13: Validación de archivos de habilidad inválidos**
    - **Valida: Requisitos 7.4, 8.4**
  
  - [ ]* 4.5 Escribir tests unitarios para ContentLoader
    - Test de caché de contenido
    - Test de manejo de errores
    - Test de ordenamiento con casos edge

- [x] 5. Checkpoint - Verificar servicios base
  - Asegurarse de que todos los tests pasen, preguntar al usuario si surgen dudas.

- [x] 6. Crear componentes de layout y navegación
  - [x] 6.1 Implementar componente App con React Router
    - Configurar HashRouter para compatibilidad con GitHub Pages
    - Definir rutas: /, /projects, /projects/:projectId, /skills
    - Inicializar i18n en el componente raíz
    - Implementar Error Boundary para captura de errores
    - _Requisitos: 1.1, 1.2, 1.3, 11.1_
  
  - [x] 6.2 Implementar componente Layout
    - Crear estructura con Header, main content area y Footer
    - Aplicar estilos base con Tailwind CSS
    - _Requisitos: 1.1, 1.2, 1.3_
  
  - [x] 6.3 Implementar componente Header con navegación
    - Crear navegación principal con enlaces a Home, Proyectos, Habilidades
    - Resaltar página activa
    - Implementar navegación responsive (hamburger menu en móvil)
    - _Requisitos: 1.1, 1.2, 1.3, 10.1_
  
  - [x] 6.4 Implementar componente LanguageSelector
    - Crear selector de idioma con opciones Español/Inglés
    - Manejar cambio de idioma y actualizar i18n
    - Persistir preferencia en localStorage
    - Mostrar idioma activo visualmente
    - _Requisitos: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 6.5 Escribir test de propiedad para HTML semántico
    - **Propiedad 17: Uso de HTML semántico**
    - **Valida: Requisitos 13.4**
  
  - [ ]* 6.6 Escribir tests unitarios para navegación
    - Test de resaltado de página activa
    - Test de navegación responsive
    - Test de cambio de idioma

- [x] 7. Implementar componente de imagen optimizada
  - [x] 7.1 Crear componente OptimizedImage con soporte WebP y lazy loading
    - Implementar picture element con source WebP y fallback JPEG
    - Configurar lazy loading por defecto
    - Manejar errores de carga con imagen placeholder
    - Incluir atributo alt requerido
    - _Requisitos: 12.2, 12.4, 13.1_
  
  - [ ]* 7.2 Escribir test de propiedad para texto alternativo en imágenes
    - **Propiedad 16: Texto alternativo en imágenes**
    - **Valida: Requisitos 13.1**
  
  - [ ]* 7.3 Escribir test de propiedad para lazy loading
    - **Propiedad 15: Lazy loading de imágenes**
    - **Valida: Requisitos 12.4**
  
  - [ ]* 7.4 Escribir test de propiedad para optimización de formato
    - **Propiedad 14: Optimización de formato de imágenes**
    - **Valida: Requisitos 12.2**

- [x] 8. Implementar página Home
  - [x] 8.1 Crear componente HomePage con todas las secciones
    - Cargar información personal con ContentLoader
    - Mostrar foto personal con OptimizedImage
    - Mostrar nombre completo y resumen profesional
    - Mostrar enlaces de contacto (email, LinkedIn, GitHub) con iconos
    - Mostrar preview de últimos 3 proyectos destacados
    - Mostrar resumen de 6 habilidades principales
    - Aplicar animaciones sutiles (fade-in, slide-up)
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 9.3_
  
  - [ ]* 8.2 Escribir tests unitarios para HomePage
    - Test de visualización de exactamente 3 proyectos destacados
    - Test de visualización de exactamente 6 habilidades principales
    - Test de presencia de foto y enlaces de contacto

- [x] 9. Implementar página de Proyectos
  - [x] 9.1 Crear componente ProjectCard
    - Mostrar título, descripción breve, imagen y tecnologías
    - Implementar hover effects y animaciones
    - Manejar click para navegación a detalle
    - Aplicar diseño responsive (1 columna móvil, 2 tablet, 3 desktop)
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5, 9.3, 10.1, 10.2, 10.3_
  
  - [x] 9.2 Crear componente ProjectsPage
    - Cargar lista de proyectos con ContentLoader
    - Renderizar ProjectCard para cada proyecto
    - Implementar grid responsive
    - Manejar estados de carga y error
    - _Requisitos: 3.1, 3.6_
  
  - [ ]* 9.3 Escribir test de propiedad para renderizado completo de tarjetas
    - **Propiedad 1: Renderizado completo de tarjetas de proyecto**
    - **Valida: Requisitos 3.2, 3.3, 3.4, 3.5**
  
  - [ ]* 9.4 Escribir tests unitarios para ProjectsPage
    - Test de grid responsive
    - Test de manejo de lista vacía
    - Test de estados de carga y error

- [x] 10. Implementar vista detallada de Proyecto
  - [x] 10.1 Crear componente ProjectDetail
    - Cargar proyecto específico por ID con ContentLoader
    - Mostrar título completo, descripción completa, imágenes, tecnologías
    - Mostrar enlaces a código fuente y demo cuando estén disponibles
    - Implementar botón "Volver a Proyectos"
    - Renderizar descripción en Markdown si es necesario
    - Manejar proyecto no encontrado con página 404
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [ ]* 10.2 Escribir test de propiedad para vista detallada completa
    - **Propiedad 3: Renderizado completo de vista detallada de proyecto**
    - **Valida: Requisitos 4.2, 4.3, 4.4, 4.5, 4.6**
  
  - [ ]* 10.3 Escribir tests unitarios para ProjectDetail
    - Test de navegación a proyecto inexistente
    - Test de botón volver
    - Test de visualización de enlaces opcionales

- [x] 11. Checkpoint - Verificar funcionalidad de proyectos
  - Asegurarse de que todos los tests pasen, preguntar al usuario si surgen dudas.

- [x] 12. Implementar página de Habilidades
  - [x] 12.1 Crear componente SkillCard
    - Mostrar nombre de habilidad, categoría y nivel de dominio
    - Implementar visualización de nivel (barra de progreso o badges)
    - Mostrar icono si está disponible
    - _Requisitos: 5.1, 5.2_
  
  - [x] 12.2 Crear componente SkillsPage con todas las secciones
    - Cargar datos de habilidades con ContentLoader
    - Sección de habilidades técnicas organizadas por categorías
    - Sección de formación académica con institución, título y año
    - Sección de certificaciones con nombre, emisor y año
    - Sección de experiencia laboral con empresa, puesto y período
    - Organizar contenido en secciones claramente diferenciadas
    - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 12.3 Escribir tests de propiedad para renderizado de habilidades
    - **Propiedad 4: Renderizado completo de habilidades técnicas**
    - **Propiedad 5: Renderizado completo de formación académica**
    - **Propiedad 6: Renderizado completo de certificaciones**
    - **Propiedad 7: Renderizado completo de experiencia laboral**
    - **Valida: Requisitos 5.1, 5.2, 5.3, 5.4, 5.5**
  
  - [ ]* 12.4 Escribir tests unitarios para SkillsPage
    - Test de organización por categorías
    - Test de visualización de niveles
    - Test de secciones diferenciadas

- [x] 13. Implementar componente SEO y metadatos
  - [x] 13.1 Crear componente SEO con React Helmet
    - Configurar meta tags de descripción por página
    - Configurar Open Graph tags para redes sociales
    - Configurar Twitter Card tags
    - Implementar structured data JSON-LD para Person y CreativeWork
    - Generar títulos únicos y descriptivos por página
    - _Requisitos: 14.1, 14.2, 14.5, 14.6_
  
  - [x] 13.2 Crear archivos sitemap.xml y robots.txt
    - Generar sitemap.xml con todas las rutas principales
    - Crear robots.txt permitiendo indexación
    - _Requisitos: 14.3, 14.4_
  
  - [ ]* 13.3 Escribir test de propiedad para meta tags completos
    - **Propiedad 19: Meta tags completos por página**
    - **Valida: Requisitos 14.1, 14.2, 14.5**
  
  - [ ]* 13.4 Escribir test de propiedad para structured data
    - **Propiedad 20: Structured data JSON-LD**
    - **Valida: Requisitos 14.6**
  
  - [ ]* 13.5 Escribir tests unitarios para SEO
    - Test de existencia de sitemap.xml
    - Test de existencia de robots.txt
    - Test de títulos únicos por página

- [x] 14. Implementar accesibilidad y atributos ARIA
  - [x] 14.1 Agregar atributos ARIA a elementos interactivos
    - Agregar aria-label a botones sin texto visible
    - Agregar aria-current a navegación activa
    - Agregar aria-live para anuncios dinámicos (cambio de idioma)
    - Implementar skip to main content link
    - _Requisitos: 13.5, 13.6_
  
  - [x] 14.2 Asegurar navegación por teclado completa
    - Verificar que todos los elementos interactivos sean accesibles con Tab
    - Implementar focus visible con outline personalizado
    - Asegurar orden lógico de tabulación
    - _Requisitos: 13.2_
  
  - [ ]* 14.3 Escribir test de propiedad para atributos ARIA
    - **Propiedad 18: Atributos ARIA en elementos interactivos**
    - **Valida: Requisitos 13.5**
  
  - [ ]* 14.4 Escribir tests de accesibilidad con jest-axe
    - Test de HomePage sin violaciones de accesibilidad
    - Test de ProjectsPage sin violaciones
    - Test de SkillsPage sin violaciones
    - Test de contraste de color mínimo 4.5:1
    - _Requisitos: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

- [x] 15. Crear archivos de contenido de ejemplo
  - [x] 15.1 Crear archivo personal.json con información de Daniel
    - Incluir nombre, foto, resumen en ambos idiomas, contactos
    - Incluir lista de IDs de habilidades destacadas
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.6_
  
  - [x] 15.2 Crear archivos de ejemplo para proyectos
    - Crear al menos 3 archivos project-*.json con todos los campos requeridos
    - Incluir traducciones en español e inglés
    - Marcar al menos 3 proyectos como featured
    - Crear manifest.json con lista de archivos de proyectos
    - _Requisitos: 7.1, 7.2, 7.5_
  
  - [x] 15.3 Crear archivos de ejemplo para habilidades
    - Crear technical.json con categorías y habilidades
    - Crear education.json con formación académica
    - Crear certifications.json con certificaciones
    - Crear experience.json con experiencia laboral
    - _Requisitos: 8.1, 8.2, 8.5_
  
  - [x] 15.4 Agregar imágenes de ejemplo
    - Agregar foto de perfil en public/content/images/
    - Agregar imágenes de proyectos en public/content/images/projects/
    - Agregar imagen placeholder para errores
    - Optimizar imágenes para web (formato WebP y JPEG)
    - _Requisitos: 2.1, 3.4, 12.2_
  
  - [ ]* 15.5 Escribir test de propiedad para carga válida de contenido
    - **Propiedad 12: Carga válida de archivos de habilidad**
    - **Valida: Requisitos 8.1, 8.2, 8.3**

- [x] 16. Checkpoint - Verificar contenido y accesibilidad
  - Asegurarse de que todos los tests pasen, preguntar al usuario si surgen dudas.

- [x] 17. Configurar build y optimización para producción
  - [x] 17.1 Configurar Vite para GitHub Pages
    - Configurar base URL para repositorio de GitHub
    - Configurar build output en carpeta dist
    - Configurar code splitting y minificación
    - Configurar optimización de assets (imágenes, CSS, JS)
    - _Requisitos: 11.1, 11.2, 12.3_
  
  - [x] 17.2 Configurar Tailwind CSS para producción
    - Configurar purge de CSS no utilizado
    - Configurar minificación de CSS
    - _Requisitos: 12.3_
  
  - [x] 17.3 Implementar optimizaciones de rendimiento
    - Configurar lazy loading de rutas con React.lazy
    - Configurar preload de recursos críticos
    - Verificar que el bundle inicial sea menor a 2MB
    - _Requisitos: 12.1, 12.3, 12.5_

- [x] 18. Configurar GitHub Actions para despliegue automático
  - [x] 18.1 Crear workflow de testing
    - Crear .github/workflows/test.yml
    - Configurar ejecución de tests en push y pull request
    - Configurar reporte de cobertura
    - _Requisitos: 11.3_
  
  - [x] 18.2 Crear workflow de despliegue
    - Crear .github/workflows/deploy.yml
    - Configurar build y despliegue automático a GitHub Pages en push a main
    - Configurar permisos necesarios para GitHub Pages
    - _Requisitos: 11.3, 11.4_

- [x] 19. Crear documentación del proyecto
  - [x] 19.1 Crear README.md completo
    - Incluir descripción del proyecto
    - Incluir instrucciones de instalación y desarrollo
    - Incluir instrucciones para agregar nuevos proyectos y habilidades
    - Incluir instrucciones de configuración de GitHub Pages
    - Incluir comandos disponibles (dev, build, test, preview)
    - _Requisitos: 7.5, 8.5, 11.5_
  
  - [x] 19.2 Crear plantillas de ejemplo para contenido
    - Crear template-project.json con estructura y comentarios
    - Crear template-skill.json con estructura y comentarios
    - Documentar campos requeridos y opcionales
    - _Requisitos: 7.5, 8.5_

- [x] 20. Checkpoint final - Verificar proyecto completo
  - Ejecutar todos los tests y verificar cobertura
  - Verificar build de producción exitoso
  - Verificar que no hay errores de TypeScript
  - Verificar que no hay warnings de accesibilidad
  - Asegurarse de que todos los tests pasen, preguntar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos específicos que implementa para trazabilidad
- Los checkpoints aseguran validación incremental del progreso
- Los tests de propiedad validan comportamientos universales con múltiples inputs generados
- Los tests unitarios validan casos específicos y ejemplos concretos
- La implementación sigue un enfoque incremental: servicios base → componentes → páginas → optimización → despliegue
