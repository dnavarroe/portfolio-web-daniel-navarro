# Guía de Despliegue en GitHub Pages

Esta guía te explica paso a paso cómo desplegar tu portafolio en GitHub Pages.

## ✅ Requisitos Previos

Antes de desplegar, asegúrate de que:

- [ ] Tienes una cuenta de GitHub
- [ ] Has creado un repositorio para tu portafolio
- [ ] Tienes Git instalado en tu computadora
- [ ] Has actualizado las imágenes y contenido del portafolio

---

## 🚀 Pasos para el Primer Despliegue

### Paso 1: Configurar el Repositorio en GitHub

1. **Crea un repositorio en GitHub:**
   - Ve a https://github.com/new
   - Nombre del repositorio: `portfolio-web-daniel-navarro` (o el nombre que prefieras)
   - Visibilidad: **Public** (necesario para GitHub Pages gratis)
   - **NO** inicialices con README, .gitignore o licencia (ya los tienes)
   - Haz clic en "Create repository"

2. **Copia la URL del repositorio:**
   - Ejemplo: `https://github.com/tu-usuario/portfolio-web-daniel-navarro.git`

### Paso 2: Configurar la Base URL en Vite

**IMPORTANTE:** Debes actualizar la configuración de Vite con el nombre de tu repositorio.

1. Abre el archivo `vite.config.ts`

2. Busca esta línea:
   ```typescript
   base: process.env.NODE_ENV === 'production' 
     ? '/portfolio-web-daniel-navarro/' 
     : '/'
   ```

3. Reemplaza `portfolio-web-daniel-navarro` con el nombre de tu repositorio:
   ```typescript
   base: process.env.NODE_ENV === 'production' 
     ? '/TU-NOMBRE-DE-REPOSITORIO/' 
     : '/'
   ```

4. Guarda el archivo

### Paso 3: Conectar tu Proyecto Local con GitHub

Abre la terminal en la carpeta de tu proyecto y ejecuta:

```bash
# Inicializar Git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Portfolio completo"

# Conectar con tu repositorio de GitHub
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# Cambiar a la rama main (si estás en master)
git branch -M main

# Subir los archivos a GitHub
git push -u origin main
```

**Nota:** Reemplaza `TU-USUARIO` y `TU-REPOSITORIO` con tus datos reales.

### Paso 4: Habilitar GitHub Pages

1. **Ve a tu repositorio en GitHub**
   - URL: `https://github.com/TU-USUARIO/TU-REPOSITORIO`

2. **Abre la configuración:**
   - Haz clic en "Settings" (Configuración)

3. **Configura GitHub Pages:**
   - En el menú lateral izquierdo, busca "Pages"
   - En "Build and deployment":
     - **Source:** Selecciona "GitHub Actions"
   - Haz clic en "Save" (Guardar)

### Paso 5: Esperar el Despliegue

1. **Ve a la pestaña "Actions":**
   - URL: `https://github.com/TU-USUARIO/TU-REPOSITORIO/actions`

2. **Verás el workflow "Deploy to GitHub Pages" ejecutándose:**
   - 🟡 Amarillo = En progreso
   - ✅ Verde = Completado exitosamente
   - ❌ Rojo = Error (ver logs para detalles)

3. **El despliegue toma aproximadamente 2-5 minutos**

### Paso 6: Acceder a tu Sitio

Una vez completado el despliegue:

1. **Tu sitio estará disponible en:**
   ```
   https://TU-USUARIO.github.io/TU-REPOSITORIO/
   ```

2. **Ejemplo:**
   ```
   https://danielnavarro.github.io/portfolio-web-daniel-navarro/
   ```

3. **También puedes encontrar la URL en:**
   - Settings → Pages → "Your site is live at..."
   - Actions → Deploy workflow → "Deploy to GitHub Pages" → deployment URL

---

## 🔄 Actualizaciones Posteriores

Después del primer despliegue, cada vez que hagas cambios:

### Opción A: Desde la Terminal

```bash
# 1. Agregar los cambios
git add .

# 2. Hacer commit con un mensaje descriptivo
git commit -m "Actualizar foto de perfil y proyectos"

# 3. Subir a GitHub
git push origin main
```

### Opción B: Desde VS Code

1. Abre el panel de "Source Control" (Ctrl+Shift+G)
2. Escribe un mensaje de commit
3. Haz clic en el botón "✓" (Commit)
4. Haz clic en "Sync Changes" o "Push"

**El despliegue se activará automáticamente** cada vez que hagas push a la rama `main`.

---

## 🔧 Configuración Avanzada (Opcional)

### Usar un Dominio Personalizado

Si tienes tu propio dominio (ejemplo: `danielnavarro.com`):

1. **Agrega un archivo CNAME:**
   - Crea el archivo `public/CNAME`
   - Contenido: `tudominio.com` (sin http://)

2. **Configura los DNS de tu dominio:**
   - Agrega un registro A apuntando a:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - O un registro CNAME apuntando a: `TU-USUARIO.github.io`

3. **Configura en GitHub:**
   - Settings → Pages → Custom domain
   - Ingresa tu dominio
   - Espera la verificación DNS

### Despliegue Manual

Si necesitas desplegar manualmente sin hacer push:

1. **Ve a Actions en GitHub**
2. **Selecciona "Deploy to GitHub Pages"**
3. **Haz clic en "Run workflow"**
4. **Selecciona la rama "main"**
5. **Haz clic en "Run workflow"**

---

## ❌ Solución de Problemas

### Error: "Page build failed"

**Causa:** Error en el build de Vite.

**Solución:**
1. Ejecuta localmente: `npm run build`
2. Revisa los errores en la terminal
3. Corrige los errores
4. Haz commit y push nuevamente

### Error: "404 - Page not found"

**Causa:** La base URL no está configurada correctamente.

**Solución:**
1. Verifica que `vite.config.ts` tenga el nombre correcto del repositorio
2. Debe ser: `base: '/nombre-repositorio/'` (con las barras `/`)
3. Haz commit y push nuevamente

### Error: "Permission denied"

**Causa:** GitHub Actions no tiene permisos para desplegar.

**Solución:**
1. Ve a Settings → Actions → General
2. En "Workflow permissions", selecciona "Read and write permissions"
3. Guarda los cambios
4. Re-ejecuta el workflow

### El sitio no se actualiza

**Causa:** Caché del navegador.

**Solución:**
1. Limpia el caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
2. Abre en modo incógnito
3. Espera 5-10 minutos (GitHub Pages puede tardar en actualizar)

### Las imágenes no cargan

**Causa:** Rutas incorrectas en los archivos JSON.

**Solución:**
1. Verifica que las rutas empiecen con `/content/images/`
2. Ejecuta: `npm run validate:content`
3. Corrige las rutas según los errores
4. Haz commit y push

---

## 📊 Monitoreo del Sitio

### Ver Estadísticas de Despliegue

1. **Actions → Deploy to GitHub Pages**
   - Tiempo de build
   - Logs completos
   - Errores (si los hay)

2. **Settings → Pages**
   - URL del sitio
   - Estado del despliegue
   - Configuración de dominio

### Ver Tráfico del Sitio

1. **Insights → Traffic**
   - Visitas únicas
   - Páginas vistas
   - Referrers (de dónde vienen los visitantes)

**Nota:** Las estadísticas de tráfico solo están disponibles para repositorios públicos.

---

## 🔒 Seguridad y Privacidad

### ¿Es Seguro?

- ✅ GitHub Pages usa HTTPS automáticamente
- ✅ No expone código sensible (solo el build en `/dist`)
- ✅ No requiere credenciales adicionales

### ¿Qué NO Subir?

- ❌ Claves API privadas
- ❌ Contraseñas
- ❌ Tokens de acceso
- ❌ Información personal sensible

**Todo lo que está en el repositorio es público.**

---

## 📝 Checklist de Despliegue

Antes de desplegar, verifica:

- [ ] Actualicé `vite.config.ts` con el nombre correcto del repositorio
- [ ] Actualicé las imágenes (foto de perfil y proyectos)
- [ ] Actualicé el contenido en `public/content/`
- [ ] Ejecuté `npm run validate:content` sin errores
- [ ] Ejecuté `npm run build` sin errores
- [ ] Ejecuté `npm run test` sin errores
- [ ] Probé el sitio localmente con `npm run dev`
- [ ] Hice commit de todos los cambios
- [ ] Configuré GitHub Pages en Settings → Pages
- [ ] Verifiqué que el workflow se ejecutó correctamente

---

## 🎉 ¡Listo!

Tu portafolio ahora está desplegado y accesible públicamente en:

```
https://TU-USUARIO.github.io/TU-REPOSITORIO/
```

Puedes compartir este enlace en:
- LinkedIn
- CV/Resume
- Correos de presentación
- Redes sociales
- Aplicaciones de trabajo

---

## 📞 Recursos Adicionales

- **Documentación de GitHub Pages:** https://docs.github.com/pages
- **Documentación de Vite:** https://vitejs.dev/guide/static-deploy.html
- **Guía de Imágenes:** [GUIA_IMAGENES.md](./GUIA_IMAGENES.md)
- **Optimización de Build:** [BUILD_OPTIMIZATION.md](./BUILD_OPTIMIZATION.md)
- **Implementación de SEO:** [SEO_IMPLEMENTATION.md](./SEO_IMPLEMENTATION.md)

---

**¿Necesitas ayuda?** Revisa la sección de "Solución de Problemas" o consulta los logs en la pestaña Actions de tu repositorio.
