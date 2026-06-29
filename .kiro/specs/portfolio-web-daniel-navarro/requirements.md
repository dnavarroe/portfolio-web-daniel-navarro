# Documento de Requisitos - Portafolio Web Personal

## Introducción

Este documento define los requisitos para un sitio web tipo portafolio personal para Daniel Navarro. El sitio presentará información profesional, proyectos de ciencia de datos y habilidades técnicas de manera simple pero llamativa. El portafolio será bilingüe (Español/Inglés) y se publicará mediante GitHub Pages.

## Glosario

- **Sistema_Portafolio**: El sitio web completo del portafolio personal
- **Ventana_Principal**: La página de inicio que muestra un resumen general con foto personal
- **Ventana_Proyectos**: La sección que lista los proyectos de ciencia de datos
- **Ventana_Habilidades**: La sección que muestra habilidades, estudios y nivel tecnológico
- **Usuario_Visitante**: Persona que navega el sitio web
- **Administrador**: Daniel Navarro, quien mantiene y actualiza el contenido
- **Idioma_Activo**: El idioma actualmente seleccionado para mostrar el contenido (Español o Inglés)

## Requisitos

### Requisito 1: Estructura de Navegación Principal

**User Story:** Como Usuario_Visitante, quiero navegar entre las tres secciones principales del portafolio, para poder acceder a la información que me interesa.

#### Criterios de Aceptación

1. EL Sistema_Portafolio DEBERÁ proporcionar navegación a la Ventana_Principal
2. EL Sistema_Portafolio DEBERÁ proporcionar navegación a la Ventana_Proyectos
3. EL Sistema_Portafolio DEBERÁ proporcionar navegación a la Ventana_Habilidades
4. CUANDO el Usuario_Visitante seleccione una sección, EL Sistema_Portafolio DEBERÁ mostrar el contenido correspondiente en menos de 500ms

### Requisito 2: Ventana Principal con Resumen

**User Story:** Como Usuario_Visitante, quiero ver un resumen general con foto personal en la página de inicio, para obtener una primera impresión profesional.

#### Criterios de Aceptación

1. LA Ventana_Principal DEBERÁ mostrar una foto personal de Daniel Navarro
2. LA Ventana_Principal DEBERÁ mostrar un título con el nombre completo
3. LA Ventana_Principal DEBERÁ mostrar un resumen profesional de máximo 200 palabras
4. LA Ventana_Principal DEBERÁ mostrar enlaces de contacto (email, LinkedIn, GitHub)
5. LA Ventana_Principal DEBERÁ mostrar una vista previa de los últimos 3 proyectos destacados
6. LA Ventana_Principal DEBERÁ mostrar un resumen de las habilidades principales (máximo 6 habilidades)

### Requisito 3: Listado de Proyectos

**User Story:** Como Usuario_Visitante, quiero ver una lista de proyectos de ciencia de datos, para conocer el trabajo realizado por Daniel.

#### Criterios de Aceptación

1. LA Ventana_Proyectos DEBERÁ mostrar todos los proyectos disponibles en formato de tarjetas
2. PARA CADA proyecto, LA Ventana_Proyectos DEBERÁ mostrar un título
3. PARA CADA proyecto, LA Ventana_Proyectos DEBERÁ mostrar una descripción breve de máximo 100 palabras
4. PARA CADA proyecto, LA Ventana_Proyectos DEBERÁ mostrar una imagen representativa
5. PARA CADA proyecto, LA Ventana_Proyectos DEBERÁ mostrar las tecnologías utilizadas
6. LA Ventana_Proyectos DEBERÁ ordenar los proyectos del más reciente al más antiguo

### Requisito 4: Visualización Detallada de Proyectos

**User Story:** Como Usuario_Visitante, quiero hacer clic en un proyecto para ver sus detalles completos, para entender mejor el alcance y resultados del trabajo.

#### Criterios de Aceptación

1. CUANDO el Usuario_Visitante haga clic en una tarjeta de proyecto, EL Sistema_Portafolio DEBERÁ mostrar la vista detallada del proyecto
2. LA vista detallada DEBERÁ mostrar el título completo del proyecto
3. LA vista detallada DEBERÁ mostrar una descripción completa sin límite de palabras
4. LA vista detallada DEBERÁ mostrar imágenes o capturas de pantalla del proyecto
5. LA vista detallada DEBERÁ mostrar las tecnologías y herramientas utilizadas
6. LA vista detallada DEBERÁ mostrar enlaces al código fuente o demostración cuando estén disponibles
7. LA vista detallada DEBERÁ proporcionar un botón para regresar a la Ventana_Proyectos

### Requisito 5: Información de Habilidades y Estudios

**User Story:** Como Usuario_Visitante, quiero ver información detallada sobre habilidades, estudios y nivel tecnológico, para evaluar el perfil profesional completo.

#### Criterios de Aceptación

1. LA Ventana_Habilidades DEBERÁ mostrar una lista de habilidades técnicas organizadas por categorías
2. PARA CADA habilidad técnica, LA Ventana_Habilidades DEBERÁ mostrar el nivel de dominio (Básico, Intermedio, Avanzado, Experto)
3. LA Ventana_Habilidades DEBERÁ mostrar la formación académica con institución, título y año
4. LA Ventana_Habilidades DEBERÁ mostrar certificaciones obtenidas con nombre, emisor y año
5. LA Ventana_Habilidades DEBERÁ mostrar experiencia laboral relevante con empresa, puesto y período
6. LA Ventana_Habilidades DEBERÁ organizar el contenido en secciones claramente diferenciadas

### Requisito 6: Soporte Bilingüe

**User Story:** Como Usuario_Visitante, quiero cambiar el idioma del sitio entre Español e Inglés, para leer el contenido en mi idioma preferido.

#### Criterios de Aceptación

1. EL Sistema_Portafolio DEBERÁ proporcionar un selector de idioma visible en todas las páginas
2. CUANDO el Usuario_Visitante seleccione Español, EL Sistema_Portafolio DEBERÁ mostrar todo el contenido en español
3. CUANDO el Usuario_Visitante seleccione Inglés, EL Sistema_Portafolio DEBERÁ mostrar todo el contenido en inglés
4. CUANDO el Usuario_Visitante cambie el idioma, EL Sistema_Portafolio DEBERÁ actualizar el contenido en menos de 300ms
5. EL Sistema_Portafolio DEBERÁ recordar la preferencia de idioma del Usuario_Visitante durante la sesión
6. EL Sistema_Portafolio DEBERÁ establecer Español como Idioma_Activo por defecto

### Requisito 7: Gestión de Proyectos por el Administrador

**User Story:** Como Administrador, quiero agregar nuevos proyectos fácilmente, para mantener el portafolio actualizado sin necesidad de conocimientos técnicos avanzados.

#### Criterios de Aceptación

1. EL Sistema_Portafolio DEBERÁ permitir agregar proyectos mediante archivos de configuración en formato JSON o Markdown
2. PARA CADA proyecto nuevo, EL Sistema_Portafolio DEBERÁ requerir: título en ambos idiomas, descripción breve, descripción completa, tecnologías y fecha
3. CUANDO el Administrador agregue un archivo de proyecto válido, EL Sistema_Portafolio DEBERÁ mostrar el proyecto en la Ventana_Proyectos automáticamente
4. SI el archivo de proyecto contiene errores de formato, EL Sistema_Portafolio DEBERÁ mostrar un mensaje de error descriptivo durante la compilación
5. EL Sistema_Portafolio DEBERÁ proporcionar una plantilla de ejemplo para nuevos proyectos

### Requisito 8: Gestión de Habilidades por el Administrador

**User Story:** Como Administrador, quiero agregar nuevas habilidades fácilmente, para mantener mi perfil profesional actualizado.

#### Criterios de Aceptación

1. EL Sistema_Portafolio DEBERÁ permitir agregar habilidades mediante archivos de configuración en formato JSON o Markdown
2. PARA CADA habilidad nueva, EL Sistema_Portafolio DEBERÁ requerir: nombre en ambos idiomas, categoría y nivel de dominio
3. CUANDO el Administrador agregue un archivo de habilidad válido, EL Sistema_Portafolio DEBERÁ mostrar la habilidad en la Ventana_Habilidades automáticamente
4. SI el archivo de habilidad contiene errores de formato, EL Sistema_Portafolio DEBERÁ mostrar un mensaje de error descriptivo durante la compilación
5. EL Sistema_Portafolio DEBERÁ proporcionar una plantilla de ejemplo para nuevas habilidades

### Requisito 9: Diseño Visual Atractivo

**User Story:** Como Usuario_Visitante, quiero experimentar un diseño simple pero llamativo, para tener una experiencia visual agradable.

#### Criterios de Aceptación

1. EL Sistema_Portafolio DEBERÁ utilizar una paleta de colores consistente en todas las páginas
2. EL Sistema_Portafolio DEBERÁ utilizar tipografía legible con jerarquía visual clara
3. EL Sistema_Portafolio DEBERÁ incluir animaciones sutiles en transiciones y hover de elementos interactivos
4. EL Sistema_Portafolio DEBERÁ mantener espaciado consistente entre elementos (mínimo 16px)
5. EL Sistema_Portafolio DEBERÁ utilizar iconos para representar tecnologías y redes sociales
6. EL Sistema_Portafolio DEBERÁ implementar un diseño limpio con abundante espacio en blanco

### Requisito 10: Diseño Responsivo

**User Story:** Como Usuario_Visitante, quiero acceder al portafolio desde cualquier dispositivo, para ver el contenido correctamente en móvil, tablet o escritorio.

#### Criterios de Aceptación

1. CUANDO el ancho de pantalla sea menor a 768px, EL Sistema_Portafolio DEBERÁ mostrar el diseño optimizado para móvil
2. CUANDO el ancho de pantalla esté entre 768px y 1024px, EL Sistema_Portafolio DEBERÁ mostrar el diseño optimizado para tablet
3. CUANDO el ancho de pantalla sea mayor a 1024px, EL Sistema_Portafolio DEBERÁ mostrar el diseño optimizado para escritorio
4. EL Sistema_Portafolio DEBERÁ mantener la legibilidad del texto en todos los tamaños de pantalla
5. EL Sistema_Portafolio DEBERÁ adaptar el tamaño de las imágenes según el dispositivo
6. EL Sistema_Portafolio DEBERÁ hacer accesibles todos los elementos interactivos en pantallas táctiles

### Requisito 11: Publicación en GitHub Pages

**User Story:** Como Administrador, quiero publicar el portafolio en GitHub Pages, para tener hosting gratuito y un dominio de GitHub.

#### Criterios de Aceptación

1. EL Sistema_Portafolio DEBERÁ ser compatible con el servicio de GitHub Pages
2. EL Sistema_Portafolio DEBERÁ generarse como sitio estático sin requerir servidor backend
3. CUANDO el Administrador haga push al repositorio, EL Sistema_Portafolio DEBERÁ desplegarse automáticamente mediante GitHub Actions
4. EL Sistema_Portafolio DEBERÁ ser accesible mediante la URL: https://[username].github.io/[repository-name]
5. EL Sistema_Portafolio DEBERÁ incluir documentación para configurar GitHub Pages en el README

### Requisito 12: Rendimiento y Optimización

**User Story:** Como Usuario_Visitante, quiero que el sitio cargue rápidamente, para no esperar y tener una experiencia fluida.

#### Criterios de Aceptación

1. EL Sistema_Portafolio DEBERÁ cargar la página inicial en menos de 3 segundos con conexión 3G
2. EL Sistema_Portafolio DEBERÁ optimizar todas las imágenes para web (formato WebP o JPEG optimizado)
3. EL Sistema_Portafolio DEBERÁ minimizar archivos CSS y JavaScript en producción
4. EL Sistema_Portafolio DEBERÁ implementar lazy loading para imágenes fuera del viewport inicial
5. EL Sistema_Portafolio DEBERÁ tener un tamaño total de página inicial menor a 2MB

### Requisito 13: Accesibilidad Web

**User Story:** Como Usuario_Visitante con necesidades de accesibilidad, quiero poder navegar el sitio con tecnologías asistivas, para acceder a toda la información.

#### Criterios de Aceptación

1. EL Sistema_Portafolio DEBERÁ proporcionar texto alternativo para todas las imágenes
2. EL Sistema_Portafolio DEBERÁ ser navegable completamente mediante teclado
3. EL Sistema_Portafolio DEBERÁ mantener un contraste de color mínimo de 4.5:1 para texto normal
4. EL Sistema_Portafolio DEBERÁ utilizar etiquetas HTML semánticas (header, nav, main, section, article, footer)
5. EL Sistema_Portafolio DEBERÁ proporcionar atributos ARIA cuando sea necesario para elementos interactivos
6. CUANDO el Usuario_Visitante use un lector de pantalla, EL Sistema_Portafolio DEBERÁ anunciar los cambios de contenido dinámico

### Requisito 14: SEO y Metadatos

**User Story:** Como Administrador, quiero que el portafolio sea encontrado fácilmente en buscadores, para aumentar la visibilidad profesional.

#### Criterios de Aceptación

1. EL Sistema_Portafolio DEBERÁ incluir meta tags de descripción en cada página
2. EL Sistema_Portafolio DEBERÁ incluir meta tags Open Graph para compartir en redes sociales
3. EL Sistema_Portafolio DEBERÁ incluir un archivo sitemap.xml
4. EL Sistema_Portafolio DEBERÁ incluir un archivo robots.txt
5. EL Sistema_Portafolio DEBERÁ utilizar títulos de página descriptivos y únicos
6. EL Sistema_Portafolio DEBERÁ incluir structured data (JSON-LD) para información de persona y proyectos

---

## Notas Adicionales

Este documento establece los requisitos base para el portafolio web personal. Durante la fase de diseño se definirán los detalles técnicos de implementación, la estructura de archivos de contenido, y las tecnologías específicas a utilizar (React, Vue, HTML/CSS/JS vanilla, etc.).
