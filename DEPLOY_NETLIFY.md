# Despliegue en Netlify

## Producción

- Sitio: https://pintury-combos.netlify.app
- Panel administrativo: https://pintury-combos.netlify.app/admin
- API: https://pintury-api-444654869113.us-east1.run.app/api/v1

Netlify despliega automáticamente la rama `main`. La configuración pública necesaria está versionada en `netlify.toml`:

```env
NEXT_PUBLIC_API_BASE_URL=https://pintury-api-444654869113.us-east1.run.app/api/v1
NEXT_PUBLIC_WHATSAPP_NUMBER=5354157794
```

Estas variables también pueden definirse o sobrescribirse en **Site configuration → Environment variables**. Cualquier cambio requiere un nuevo deploy porque Next.js las incorpora durante el build.

## Publicar una actualización

```bash
npm run lint
npm run build
git add .
git commit -m "Actualizar frontend"
git push origin main
```

Netlify construirá y publicará el commit automáticamente.

## Seguridad y CORS

- La contraseña administrativa no existe en el frontend ni en Netlify.
- El hash está guardado en Google Secret Manager y la autenticación ocurre en Laravel.
- El backend permite CORS únicamente desde `https://pintury-combos.netlify.app` y el entorno local configurado.
- No publiques archivos `.env.local`; ya están ignorados por Git.

## Solución de problemas

- Si la API no responde, comprueba `https://pintury-api-444654869113.us-east1.run.app/api/health`.
- Si falla CORS, confirma que el dominio de Netlify no lleve `/` final en la configuración del backend.
- Si las imágenes no cargan, verifica el dominio de Cloud Run en `next.config.ts`.
- Revisa el registro del último deploy en el panel de Netlify si el build falla.
