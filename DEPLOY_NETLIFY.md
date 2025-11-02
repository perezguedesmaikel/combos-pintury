# Configuración de Despliegue en Netlify

## Pasos para desplegar en Netlify

### 1. Preparar el repositorio

```bash
# Asegúrate de que todo esté commiteado
git add .
git commit -m "Preparar para despliegue en Netlify"
git push origin main
```

### 2. Crear cuenta en Netlify

1. Ve a https://netlify.com
2. Regístrate o inicia sesión (puedes usar GitHub)

### 3. Desplegar desde Git

1. Haz clic en "Add new site" > "Import an existing project"
2. Conecta tu repositorio de GitHub/GitLab/Bitbucket
3. Selecciona el repositorio `combos`
4. Netlify detectará automáticamente que es Next.js

### 4. Configurar Variables de Entorno

Antes de desplegar, configura estas variables en Netlify:

1. Ve a **Site settings** > **Environment variables**
2. Agrega las siguientes variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_WHATSAPP_NUMBER=5353000000
```

### 5. Desplegar

1. Haz clic en "Deploy site"
2. Espera 2-3 minutos mientras se construye
3. ¡Tu sitio estará en línea!

### 6. Configurar Dominio Personalizado (Opcional)

1. Ve a **Domain settings**
2. Haz clic en "Add custom domain"
3. Sigue las instrucciones para configurar tu DNS

## Comandos útiles

```bash
# Ver el build localmente
npm run build
npm start

# Instalar Netlify CLI (opcional)
npm install -g netlify-cli

# Desplegar desde la línea de comandos
netlify deploy --prod
```

## Actualizaciones Automáticas

Cada vez que hagas `git push` a tu rama principal, Netlify automáticamente:
- Construirá tu proyecto
- Ejecutará los tests (si los tienes)
- Desplegará la nueva versión

## Solución de Problemas

### Error: "Build failed"
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Netlify

### Variables de entorno no funcionan
- Asegúrate de que empiecen con `NEXT_PUBLIC_`
- Reconstruye el sitio después de agregar variables

### Imágenes no cargan
- Verifica que `next.config.ts` tenga configurado `images.remotePatterns`
- Las imágenes de Unsplash deberían funcionar automáticamente

## URLs del proyecto

- **Sitio en producción**: https://tu-sitio.netlify.app
- **Panel Admin**: https://tu-sitio.netlify.app/admin
- **Contraseña admin por defecto**: `admin123`

## Notas importantes

⚠️ **Cambiar contraseña del admin antes de producción**
- Edita `app/admin/page.tsx` y cambia `admin123` por una contraseña segura

⚠️ **Variables de entorno**
- Nunca subas `.env.local` a Git (ya está en `.gitignore`)
- Configura las variables directamente en Netlify

⚠️ **Datos Mock**
- Actualmente usa datos mock que no persisten
- Conecta Supabase para datos reales (ver README.md principal)
