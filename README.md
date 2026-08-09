# Pintury Frontend

Catálogo y panel administrativo de Pintury, construido con Next.js 16, React 19 y Tailwind CSS. Se publica en Netlify y consume la API Laravel desplegada en Google Cloud Run.

## Desarrollo

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WHATSAPP_NUMBER=5353910568
```

La API debe permitir `http://localhost:3000` en `CORS_ALLOWED_ORIGINS`.

## Verificación

```powershell
npm run lint
npm run build
```

## Netlify

Mantener el frontend en Netlify evita consumir recursos de Cloud Run. En la configuración del sitio define:

```env
NEXT_PUBLIC_API_BASE_URL=https://<servicio>.run.app/api/v1
NEXT_PUBLIC_WHATSAPP_NUMBER=<numero-con-codigo-de-pais>
```

Después inicia un nuevo deploy. El origen exacto de Netlify, sin barra final, debe configurarse también en `CORS_ALLOWED_ORIGINS` del backend.

## Seguridad del panel

- Ya no existe una contraseña escrita en el JavaScript.
- El login se valida en Laravel contra un hash almacenado en Google Secret Manager.
- El token administrativo se guarda en `sessionStorage`, vence en el backend y desaparece al cerrar la pestaña.
- Crear, editar, desactivar y eliminar combos requiere un token válido.
