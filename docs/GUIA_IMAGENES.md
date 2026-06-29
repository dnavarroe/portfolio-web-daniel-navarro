# Guía Práctica: Cómo Cambiar las Imágenes del Portafolio

Esta guía te explica paso a paso cómo reemplazar las imágenes placeholder con tus propias fotos y capturas de pantalla.

## 📁 Ubicación de las Imágenes

Todas las imágenes están en: `public/content/images/`

```
public/content/images/
├── profile.jpg              ← Tu foto de perfil
├── placeholder.jpg          ← Imagen por defecto (no cambiar)
└── projects/               ← Imágenes de tus proyectos
    ├── churn-prediction.jpg
    ├── churn-dashboard.jpg
    ├── sentiment-analysis.jpg
    ├── sentiment-dashboard.jpg
    ├── medical-classification.jpg
    ├── medical-gradcam.jpg
    └── medical-interface.jpg
```

---

## 1️⃣ Cambiar tu Foto de Perfil

### Paso 1: Prepara tu foto
- **Tamaño recomendado:** 400x400 píxeles (cuadrada)
- **Formato:** JPG o PNG
- **Peso máximo:** 200 KB

### Paso 2: Reemplaza el archivo
1. Renombra tu foto a `profile.jpg`
2. Copia tu foto a: `public/content/images/profile.jpg`
3. Reemplaza el archivo existente

### Paso 3: Verifica
```bash
npm run dev
```
Abre http://localhost:5173 y verifica que tu foto aparezca en la página principal.

**Tip:** Si tu foto no aparece, limpia el caché del navegador (Ctrl+Shift+R o Cmd+Shift+R).

---

## 2️⃣ Cambiar Imágenes de Proyectos

### Proyectos Actuales

Tu portafolio tiene 3 proyectos configurados:

1. **Customer Churn Prediction** (Predicción de abandono de clientes)
   - `churn-prediction.jpg` - Imagen principal
   - `churn-dashboard.jpg` - Dashboard/visualización

2. **Sentiment Analysis NLP** (Análisis de sentimientos)
   - `sentiment-analysis.jpg` - Imagen principal
   - `sentiment-dashboard.jpg` - Dashboard/visualización

3. **Image Classification CNN** (Clasificación de imágenes médicas)
   - `medical-classification.jpg` - Imagen principal
   - `medical-gradcam.jpg` - Visualización Grad-CAM
   - `medical-interface.jpg` - Interfaz de usuario

### Paso 1: Prepara tus capturas de pantalla

**Recomendaciones:**
- **Tamaño:** 1200x800 píxeles (horizontal) o 800x800 (cuadrado)
- **Formato:** JPG o PNG
- **Peso máximo:** 500 KB por imagen
- **Contenido:** Capturas de pantalla de tu proyecto, dashboards, resultados, código, etc.

**¿Qué capturar?**
- Dashboard principal del proyecto
- Gráficos o visualizaciones importantes
- Interfaz de usuario
- Resultados o métricas destacadas
- Código relevante (opcional)

### Paso 2: Optimiza tus imágenes (Opcional pero recomendado)

**Opción A: Herramientas Online (Más fácil)**
1. Ve a https://tinypng.com o https://squoosh.app
2. Sube tu imagen
3. Descarga la versión optimizada

**Opción B: Usando Python (Si tienes instalado)**
```bash
# Instalar Pillow
pip install pillow

# Ejecutar el script de optimización
python scripts/create-placeholders.py
```

### Paso 3: Reemplaza las imágenes

**Ejemplo para el proyecto de Churn Prediction:**

1. Renombra tus capturas:
   - `mi-captura-1.png` → `churn-prediction.jpg`
   - `mi-captura-2.png` → `churn-dashboard.jpg`

2. Copia a: `public/content/images/projects/`

3. Reemplaza los archivos existentes

### Paso 4: Verifica en el navegador

```bash
npm run dev
```

1. Ve a http://localhost:5173
2. Navega a "Proyectos"
3. Verifica que las imágenes se vean correctamente
4. Haz clic en cada proyecto para ver las imágenes adicionales

---

## 3️⃣ Agregar Imágenes para un Nuevo Proyecto

Si creas un nuevo proyecto, necesitas:

### Paso 1: Agrega las imágenes
1. Coloca tus imágenes en `public/content/images/projects/`
2. Usa nombres descriptivos: `mi-nuevo-proyecto.jpg`, `mi-nuevo-proyecto-dashboard.jpg`

### Paso 2: Actualiza el archivo JSON del proyecto

Edita el archivo del proyecto en `public/content/projects/tu-proyecto.json`:

```json
{
  "id": "mi-nuevo-proyecto",
  "image": "/content/images/projects/mi-nuevo-proyecto.jpg",
  "images": [
    "/content/images/projects/mi-nuevo-proyecto.jpg",
    "/content/images/projects/mi-nuevo-proyecto-dashboard.jpg",
    "/content/images/projects/mi-nuevo-proyecto-resultados.jpg"
  ],
  ...
}
```

**Importante:** Las rutas deben empezar con `/content/images/`

### Paso 3: Valida el contenido

```bash
npm run validate:content
```

Si hay errores, te dirá qué imágenes faltan o qué rutas están incorrectas.

---

## 4️⃣ Iconos de Habilidades (Skills)

Actualmente, el portafolio **NO usa imágenes para las habilidades**, sino que muestra:
- Nombre de la habilidad
- Categoría
- Nivel de dominio (barra de progreso con colores)

**Si quieres agregar iconos en el futuro:**

1. Agrega el campo `icon` en `public/content/skills/technical.json`:

```json
{
  "id": "python",
  "name": {
    "es": "Python",
    "en": "Python"
  },
  "category": "Data Science",
  "level": "expert",
  "icon": "/content/images/skills/python.svg"  ← Agregar esta línea
}
```

2. Coloca el icono en `public/content/images/skills/python.svg`

3. El componente `SkillCard` ya está preparado para mostrar iconos si están disponibles.

---

## 5️⃣ Checklist Final Antes de Desplegar

Antes de hacer push a GitHub, verifica:

- [ ] Foto de perfil actualizada (`profile.jpg`)
- [ ] Todas las imágenes de proyectos reemplazadas
- [ ] Las imágenes pesan menos de 500 KB cada una
- [ ] Ejecutaste `npm run validate:content` sin errores
- [ ] Ejecutaste `npm run build` sin errores
- [ ] Probaste el sitio localmente con `npm run dev`

---

## 🛠️ Herramientas Recomendadas

### Para Optimizar Imágenes
- **TinyPNG** - https://tinypng.com (online, gratis)
- **Squoosh** - https://squoosh.app (online, gratis, más opciones)
- **ImageOptim** - https://imageoptim.com (Mac, gratis)
- **RIOT** - https://riot-optimizer.com (Windows, gratis)

### Para Tomar Capturas de Pantalla
- **Windows:** Win + Shift + S (Recorte de pantalla)
- **Mac:** Cmd + Shift + 4 (Captura de área)
- **Chrome DevTools:** F12 → Cmd/Ctrl + Shift + P → "Capture screenshot"

### Para Editar/Recortar Imágenes
- **Photopea** - https://www.photopea.com (online, gratis, como Photoshop)
- **GIMP** - https://www.gimp.org (desktop, gratis)
- **Paint.NET** - https://www.getpaint.net (Windows, gratis)

---

## ❓ Preguntas Frecuentes

### ¿Puedo usar PNG en lugar de JPG?
Sí, pero JPG es mejor para fotos porque pesa menos. PNG es mejor para gráficos con transparencia.

### ¿Qué pasa si mi imagen es muy grande?
El sitio seguirá funcionando, pero cargará más lento. Usa las herramientas de optimización para reducir el tamaño.

### ¿Puedo usar imágenes de diferentes tamaños?
Sí, el componente `OptimizedImage` se adapta automáticamente. Pero es mejor mantener proporciones consistentes.

### ¿Necesito crear versiones WebP?
No es necesario. El componente `OptimizedImage` está preparado para WebP, pero funciona perfectamente con JPG/PNG.

### ¿Qué hago si una imagen no aparece?
1. Verifica que la ruta en el JSON sea correcta
2. Verifica que el archivo exista en `public/content/images/`
3. Limpia el caché del navegador (Ctrl+Shift+R)
4. Revisa la consola del navegador (F12) para ver errores

### ¿Puedo usar imágenes de internet (URLs externas)?
Sí, pero no es recomendado porque:
- Depende de que el servidor externo esté disponible
- Puede ser más lento
- No tienes control sobre la imagen

Es mejor descargar las imágenes y colocarlas en tu proyecto.

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:

1. **Verifica los errores:**
   ```bash
   npm run validate:content
   ```

2. **Revisa la consola del navegador:**
   - Abre el sitio
   - Presiona F12
   - Ve a la pestaña "Console"
   - Busca errores en rojo

3. **Verifica las rutas:**
   - Las rutas deben empezar con `/content/images/`
   - Ejemplo correcto: `/content/images/projects/mi-proyecto.jpg`
   - Ejemplo incorrecto: `content/images/projects/mi-proyecto.jpg` (falta el `/` inicial)

---

**¡Listo!** Con esta guía deberías poder actualizar todas las imágenes de tu portafolio sin problemas. 🎉
