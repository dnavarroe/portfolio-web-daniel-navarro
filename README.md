# Portfolio Web - Daniel Navarro

Portafolio personal bilingüe (Español/Inglés) construido con React, TypeScript y Tailwind CSS. Un sitio web moderno y optimizado para mostrar proyectos de ciencia de datos, habilidades técnicas y experiencia profesional.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Desarrollo](#-instalación-y-desarrollo)
- [Comandos Disponibles](#-comandos-disponibles)
- [Gestión de Contenido](#-gestión-de-contenido)
- [Despliegue en GitHub Pages](#-despliegue-en-github-pages)
- [Testing](#-testing)
- [Optimizaciones](#-optimizaciones)

## 🎯 Descripción del Proyecto

Este portafolio web es una Single Page Application (SPA) que presenta:

- **Página Principal**: Resumen profesional con foto, enlaces de contacto, proyectos destacados y habilidades principales
- **Sección de Proyectos**: Lista completa de proyectos de ciencia de datos con vista detallada
- **Sección de Habilidades**: Habilidades técnicas organizadas por categorías, formación académica, certificaciones y experiencia laboral
- **Soporte Bilingüe**: Contenido completo en Español e Inglés con cambio dinámico de idioma
- **Diseño Responsivo**: Optimizado para móvil, tablet y escritorio
- **Accesibilidad**: Cumple con estándares WCAG para navegación por teclado y lectores de pantalla

## 🛠 Stack Tecnológico

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite (desarrollo rápido y build optimizado)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Routing**: React Router v6 con HashRouter (compatible con GitHub Pages)
- **Internacionalización**: react-i18next + i18next-browser-languagedetector
- **SEO**: react-helmet-async para meta tags dinámicos
- **Testing**: Vitest + @testing-library/react + fast-check (property-based testing)
- **Linting**: ESLint con configuración TypeScript
- **Deployment**: GitHub Actions + GitHub Pages

## 📁 Estructura del Proyecto

```
portfolio-web-daniel-navarro/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions para despliegue automático
├── public/
│   ├── content/                # Contenido del portafolio (JSON)
│   │   ├── personal.json       # Información personal
│   │   ├── projects/           # Proyectos individuales
│   │   │   ├── manifest.json   # Índice de proyectos
│   │   │   └── *.json          # Archivos de proyecto
│   │   ├── skills/             # Habilidades y experiencia
│   │   │   ├── technical.json  # Habilidades técnicas
│   │   │   ├── education.json  # Formación académica
│   │   │   ├── certifications.json
│   │   │   └── experience.json
│   │   └── images/             # Imágenes del portafolio
│   ├── robots.txt              # Configuración para crawlers
│   └── sitemap.xml             # Mapa del sitio para SEO
├── src/
│   ├── components/             # Componentes reutilizables
│   │   ├── Header.tsx          # Navegación principal
│   │   ├── Footer.tsx          # Pie de página
│   │   ├── LanguageSelector.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── SkillCard.tsx
│   │   ├── SEO.tsx             # Componente para meta tags
│   │   └── ...
│   ├── pages/                  # Componentes de página
│   │   ├── HomePage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ProjectDetail.tsx
│   │   └── SkillsPage.tsx
│   ├── services/               # Servicios de negocio
│   │   └── contentLoader.ts    # Carga de contenido JSON
│   ├── i18n/                   # Configuración de internacionalización
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── es.json         # Traducciones en español
│   │       └── en.json         # Traducciones en inglés
│   ├── types/                  # Definiciones de tipos TypeScript
│   │   └── content.ts
│   ├── utils/                  # Funciones de utilidad
│   ├── test/                   # Configuración de tests
│   ├── App.tsx                 # Componente raíz
│   ├── main.tsx                # Punto de entrada
│   └── index.css               # Estilos globales
├── scripts/                    # Scripts de utilidad
│   ├── validate-content.ts     # Validación de archivos JSON
│   └── run-validation.js       # Ejecutor de validación
├── docs/                       # Documentación adicional
├── template-project.json       # Plantilla para nuevos proyectos
├── template-skill.json         # Plantilla para nuevas habilidades
├── package.json
├── vite.config.ts              # Configuración de Vite
├── vitest.config.ts            # Configuración de tests
├── tailwind.config.js          # Configuración de Tailwind
├── tsconfig.json               # Configuración de TypeScript
└── README.md                   # Este archivo
```

## 🚀 Instalación y Desarrollo

### Requisitos Previos

- Node.js 18 o superior
- npm 9 o superior

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/[tu-usuario]/portfolio-web-daniel-navarro.git
cd portfolio-web-daniel-navarro
```

2. Instala las dependencias:
```bash
npm install
```

### Desarrollo Local

Inicia el servidor de desarrollo:
```bash
npm run dev
```

El sitio estará disponible en `http://localhost:5173`

Características del modo desarrollo:
- Hot Module Replacement (HMR) - cambios instantáneos sin recargar
- Source maps para debugging
- Mensajes de error detallados

## 📝 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Crea el build de producción optimizado |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run lint` | Ejecuta ESLint para verificar calidad del código |
| `npm run test` | Ejecuta los tests en modo watch |
| `npm run test:coverage` | Ejecuta tests y genera reporte de cobertura |
| `npm run test:ui` | Abre la interfaz visual de Vitest |
| `npm run validate:content` | Valida todos los archivos JSON de contenido |

### Proceso de Build

El comando `npm run build` ejecuta:

1. **Validación de contenido**: Verifica que todos los archivos JSON sean válidos
2. **Compilación TypeScript**: Verifica tipos en todo el código
3. **Build de Vite**: Genera bundle optimizado en `/dist`

El build incluye:
- Minificación de JavaScript y CSS
- Tree-shaking para eliminar código no usado
- Code splitting para carga optimizada
- Optimización de imágenes
- Generación de source maps (opcional)

## 📄 Gestión de Contenido

El contenido del portafolio se gestiona mediante archivos JSON en `public/content/`. Esto permite actualizar el contenido sin modificar código.

### Agregar un Nuevo Proyecto

1. Copia la plantilla `template-project.json` a `public/content/projects/`:
```bash
cp template-project.json public/content/projects/mi-nuevo-proyecto.json
```

2. Edita el archivo con la información de tu proyecto:
   - Completa todos los campos requeridos (marcados con `REQUIRED`)
   - Traduce el contenido a ambos idiomas (español e inglés)
   - Agrega las imágenes en `public/content/images/projects/`

3. Actualiza `public/content/projects/manifest.json`:
```json
{
  "files": [
    "proyecto-existente.json",
    "mi-nuevo-proyecto.json"
  ]
}
```

4. Valida el contenido:
```bash
npm run validate:content
```

5. Si la validación es exitosa, el proyecto aparecerá automáticamente en el sitio

**Campos requeridos para proyectos:**
- `id`: Identificador único (kebab-case)
- `title`: Título en español e inglés
- `shortDescription`: Descripción breve (máx 100 palabras)
- `fullDescription`: Descripción completa
- `image`: Ruta a la imagen principal
- `technologies`: Array de tecnologías utilizadas
- `date`: Fecha en formato ISO (YYYY-MM-DD)

**Campos opcionales:**
- `images`: Array de imágenes adicionales
- `featured`: Boolean para destacar en página principal
- `links.github`: URL del repositorio
- `links.demo`: URL de la demostración

### Agregar una Nueva Habilidad

1. Copia la plantilla `template-skill.json` (ver estructura en la plantilla)

2. Edita `public/content/skills/technical.json`:
   - Encuentra la categoría apropiada o crea una nueva
   - Agrega la habilidad con todos los campos requeridos

3. Valida el contenido:
```bash
npm run validate:content
```

**Campos requeridos para habilidades:**
- `id`: Identificador único
- `name`: Nombre en español e inglés
- `category`: Categoría a la que pertenece
- `level`: Nivel de dominio (`basic`, `intermediate`, `advanced`, `expert`)

**Campos opcionales:**
- `icon`: Nombre del icono a mostrar

### Cambiar Imágenes (Foto de Perfil y Proyectos)

Para actualizar tu foto de perfil o las imágenes de tus proyectos, consulta la guía detallada:

📖 **[Guía Completa: Cómo Cambiar las Imágenes](./docs/GUIA_IMAGENES.md)**

**Resumen rápido:**
1. **Foto de perfil:** Reemplaza `public/content/images/profile.jpg` (400x400px, < 200KB)
2. **Imágenes de proyectos:** Reemplaza los archivos en `public/content/images/projects/`
3. **Optimiza las imágenes:** Usa [TinyPNG](https://tinypng.com) o [Squoosh](https://squoosh.app)
4. **Valida:** Ejecuta `npm run validate:content`

### Actualizar Información Personal

Edita `public/content/personal.json`:
- Información de contacto (email, LinkedIn, GitHub)
- Resumen profesional en ambos idiomas
- Foto de perfil
- Proyectos destacados (IDs)
- Habilidades principales (IDs)

### Validación de Contenido

El sistema valida automáticamente:
- ✅ Campos requeridos presentes
- ✅ Formato de fechas (ISO 8601)
- ✅ Traducciones en ambos idiomas
- ✅ Niveles de habilidad válidos
- ✅ Formato de URLs
- ✅ Existencia de archivos de imagen

Si hay errores, el build fallará con mensajes descriptivos indicando el problema.

## 🌐 Despliegue en GitHub Pages

El proyecto está configurado para despliegue automático en GitHub Pages mediante GitHub Actions.

### Configuración Inicial

1. **Habilita GitHub Pages en tu repositorio:**
   - Ve a Settings → Pages
   - En "Source", selecciona "GitHub Actions"
   - Guarda los cambios

2. **Configura la base URL en `vite.config.ts`:**
```typescript
export default defineConfig({
  base: '/[nombre-de-tu-repositorio]/',
  // ... resto de la configuración
});
```

3. **Haz push a la rama main:**
```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### Proceso de Despliegue Automático

Cada vez que hagas push a la rama `main`:

1. GitHub Actions ejecuta el workflow definido en `.github/workflows/deploy.yml`
2. Instala dependencias
3. Ejecuta validación de contenido
4. Ejecuta tests
5. Crea el build de producción
6. Despliega a GitHub Pages

El sitio estará disponible en: `https://[tu-usuario].github.io/[nombre-repositorio]/`

### Verificar el Despliegue

- Ve a la pestaña "Actions" en tu repositorio
- Verifica que el workflow "Deploy to GitHub Pages" se ejecutó exitosamente
- El sitio debería estar disponible en unos minutos

### Despliegue Manual

Si necesitas desplegar manualmente:

1. Crea el build:
```bash
npm run build
```

2. El contenido en `/dist` está listo para desplegar en cualquier servidor estático

### Configuración de Dominio Personalizado (Opcional)

1. Agrega un archivo `CNAME` en `/public` con tu dominio:
```
tudominio.com
```

2. Configura los registros DNS según las instrucciones de GitHub Pages

## 🧪 Testing

El proyecto utiliza un enfoque dual de testing:

### Tests Unitarios

Verifican casos específicos y comportamiento de componentes:

```bash
npm run test
```

Ejemplos de tests unitarios:
- Renderizado correcto de componentes
- Interacciones de usuario (clicks, navegación)
- Validación de datos
- Casos edge conocidos

### Property-Based Testing

Verifican propiedades universales con múltiples inputs generados automáticamente:

```bash
npm run test
```

Utiliza `fast-check` para generar casos de prueba aleatorios y verificar que las propiedades se mantienen verdaderas.

Ejemplos de propiedades:
- Ordenamiento cronológico de proyectos
- Renderizado completo de campos requeridos
- Persistencia de preferencias de idioma
- Validación de formato de datos

### Cobertura de Tests

Genera reporte de cobertura:

```bash
npm run test:coverage
```

Objetivos de cobertura:
- Líneas: > 80%
- Funciones: > 80%
- Branches: > 75%

### Interfaz Visual de Tests

Explora tests interactivamente:

```bash
npm run test:ui
```

Abre una interfaz web donde puedes:
- Ver todos los tests
- Ejecutar tests individuales
- Ver resultados en tiempo real
- Inspeccionar cobertura

## ⚡ Optimizaciones

### Build de Producción

El build está altamente optimizado:

- **Bundle size total**: ~0.30 MB (< 2MB requerido)
- **Initial load**: ~95 KB gzipped
- **Code splitting**: 7 chunks separados para caching óptimo
- **Lazy loading**: Rutas cargadas bajo demanda
- **CSS minification**: Tailwind purge + cssnano
- **JS minification**: Terser con eliminación de console.log
- **Asset optimization**: Imágenes organizadas, assets pequeños inlineados

### Rendimiento

- ⚡ Carga inicial < 3 segundos en 3G
- ⚡ Navegación instantánea (SPA)
- ⚡ Lazy loading de imágenes
- ⚡ Caché de contenido JSON
- ⚡ Prefetch de rutas

### SEO

- 🔍 Meta tags dinámicos por página
- 🔍 Open Graph para redes sociales
- 🔍 Structured data (JSON-LD)
- 🔍 Sitemap.xml generado
- 🔍 Robots.txt configurado

### Accesibilidad

- ♿ HTML semántico
- ♿ Navegación por teclado completa
- ♿ Contraste de color WCAG AA
- ♿ Atributos ARIA apropiados
- ♿ Texto alternativo en imágenes
- ♿ Anuncios para lectores de pantalla

Ver [BUILD_OPTIMIZATION.md](./docs/BUILD_OPTIMIZATION.md) y [SEO_IMPLEMENTATION.md](./docs/SEO_IMPLEMENTATION.md) para más detalles.

## 📚 Documentación Adicional

- **[🚀 Guía de Despliegue en GitHub Pages](./docs/DESPLIEGUE_GITHUB_PAGES.md)** - Paso a paso para desplegar tu portafolio
- **[🖼️ Guía para Cambiar Imágenes](./docs/GUIA_IMAGENES.md)** - Cómo actualizar tu foto de perfil y proyectos
- [Especificación de Requisitos](.kiro/specs/portfolio-web-daniel-navarro/requirements.md)
- [Diseño Técnico](.kiro/specs/portfolio-web-daniel-navarro/design.md)
- [Optimizaciones de Build](./docs/BUILD_OPTIMIZATION.md)
- [Implementación de SEO](./docs/SEO_IMPLEMENTATION.md)
- [Plantilla de Proyecto](./template-project.json)
- [Plantilla de Habilidad](./template-skill.json)

## 📄 Licencia

Este proyecto es de uso personal para el portafolio de Daniel Navarro.

## 🤝 Contribuciones

Este es un proyecto personal, pero sugerencias y mejoras son bienvenidas a través de issues.

---

Desarrollado con ❤️ por Daniel Navarro
