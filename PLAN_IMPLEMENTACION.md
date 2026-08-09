# Plan de implementación — Pintury Remesas y Combos

> **Nota (9 de agosto de 2026):** este plan inicial de Go + Supabase fue reemplazado por la implementación actual en Laravel 13 + Cloud Run + Firestore + Cloud Storage para eliminar el costo fijo de Cloud SQL y aprovechar las cuotas gratuitas de Google Cloud. La guía vigente está en `../combos-pintury-backend/README.md`.

> Objetivo: convertir el prototipo actual en un MVP seguro y persistente, manteniendo el frontend Next.js en Netlify, publicando una API pequeña en Go sobre Google Cloud Run y usando Supabase para PostgreSQL, autenticación e imágenes.

## 1. Arquitectura acordada

```text
Usuario / administrador
        |
        v
Next.js en Netlify
        |
        v
API REST en Go — Google Cloud Run
        |
        +--> Supabase PostgreSQL
        +--> Supabase Auth
        +--> Supabase Storage
```

### Responsabilidad de cada servicio

- **Netlify:** compilar y publicar el frontend Next.js.
- **Cloud Run:** ejecutar la API Go, validar permisos y aplicar las reglas del negocio.
- **Supabase PostgreSQL:** guardar combos y, en una fase posterior, pedidos y entregas.
- **Supabase Auth:** autenticar a los administradores.
- **Supabase Storage:** almacenar las imágenes de los combos.
- **Google Secret Manager:** guardar las credenciales privadas utilizadas por la API.

No se utilizarán inicialmente Cloud SQL, máquinas virtuales, Kubernetes, Firebase ni microservicios.

## 2. Estado actual comprobado

- [x] El frontend está construido con Next.js 16 y TypeScript.
- [x] `npm run build` termina correctamente.
- [ ] `npm run lint` tiene actualmente 4 errores y 2 advertencias.
- [ ] El catálogo todavía lee `mockCombos`.
- [ ] Crear, editar y eliminar combos no persiste datos.
- [ ] La contraseña administrativa `admin123` está expuesta en el navegador.
- [ ] La supuesta sesión administrativa es solamente una marca en `localStorage`.
- [x] Existe un primer esquema SQL para Supabase.
- [x] Existe un cliente de Supabase, aunque todavía no se utiliza en el flujo real.
- [ ] El número de WhatsApp está escrito directamente en el código.
- [ ] El repositorio contiene `package-lock.json` y un `pnpm-lock.yaml` sin versionar; debe quedar un solo gestor de paquetes.

## 3. Alcance del primer MVP

El primer lanzamiento incluirá:

- Catálogo público de combos activos.
- Filtro por categoría.
- Pedido por WhatsApp.
- Login seguro para administradores.
- Crear, editar, activar, desactivar y eliminar combos.
- Subir y reemplazar imágenes.
- Despliegue automático del frontend en Netlify.
- API Go desplegada en Cloud Run.
- Logs, límites de escalado y alertas de presupuesto.

El primer lanzamiento no incluirá:

- Cobro con tarjeta dentro de la plataforma.
- Transferencia de remesas.
- Aplicación para repartidores.
- Inventario avanzado.
- Seguimiento GPS.
- Notificaciones por SMS.

## 4. Estructura final del monorepo

```text
combos-pintury/
├── apps/
│   ├── web/                         # Frontend Next.js actual
│   └── api/                         # Backend Go
│       ├── cmd/server/main.go
│       ├── internal/
│       │   ├── auth/
│       │   ├── combos/
│       │   ├── config/
│       │   ├── http/
│       │   └── storage/
│       ├── go.mod
│       ├── go.sum
│       └── Dockerfile
├── packages/
│   └── contracts/
│       └── openapi.yaml             # Contrato de la API
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── docs/
├── netlify.toml
├── pnpm-workspace.yaml
├── package.json
└── PLAN_IMPLEMENTACION.md
```

Se usará **pnpm** para el frontend y los paquetes TypeScript. Go conservará su propio `go.mod`. No hace falta agregar Turborepo en la primera etapa.

---

## Fase 0 — Preparación y decisiones de negocio

### Tareas

- [ ] Confirmar que Pintury vende comida pagada desde el exterior para entregarla en Cuba.
- [ ] Mantener fuera del MVP cualquier transferencia directa de dinero o servicio formal de remesas.
- [ ] Confirmar el dominio público actual de Netlify.
- [ ] Confirmar que el repositorio de GitHub está conectado al sitio correcto de Netlify.
- [ ] Crear una rama de implementación, por ejemplo `feat/backend-mvp`.
- [ ] Guardar la URL del último despliegue estable de Netlify para poder regresar a él.
- [ ] Crear una alerta de presupuesto en Google Cloud, por ejemplo a 5, 10 y 20 USD.
- [ ] Revisar la fecha de vencimiento del crédito promocional activo de Google Cloud.

### Criterio de aceptación

- El alcance comercial está definido y existe una versión estable a la cual regresar.

---

## Fase 1 — Reorganizar el repositorio como monorepo

### Tareas

- [ ] Mover el frontend actual a `apps/web` conservando su historial Git.
- [ ] Crear `apps/api`, `packages/contracts`, `supabase/migrations` y `docs`.
- [ ] Crear el `package.json` raíz con scripts para operar el frontend.
- [ ] Crear `pnpm-workspace.yaml`.
- [ ] Adoptar `pnpm-lock.yaml` como único lockfile después de una instalación limpia.
- [ ] Retirar `package-lock.json` solamente después de confirmar que el build con pnpm funciona.
- [ ] Actualizar `netlify.toml` para usar `apps/web` como directorio base.
- [ ] Actualizar rutas y documentación que asuman que Next.js vive en la raíz.

### Validación

```bash
pnpm install
pnpm --dir apps/web lint
pnpm --dir apps/web build
```

### Criterio de aceptación

- Netlify puede compilar `apps/web` y la aplicación local se comporta igual que antes de moverla.

---

## Fase 2 — Corregir la base técnica del frontend

### Tareas

- [ ] Corregir los 4 errores actuales de ESLint.
- [ ] Eliminar imports sin utilizar.
- [ ] Sustituir estado derivado innecesario por valores calculados cuando corresponda.
- [ ] Mover el número de WhatsApp a `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- [ ] Crear `.env.example` sin credenciales reales.
- [ ] Agregar estados claros de carga, error y catálogo vacío.
- [ ] Mantener temporalmente los mocks detrás de una única función para facilitar el reemplazo por la API.

### Variables públicas iniciales

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_WHATSAPP_NUMBER=5353910568
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

La clave `service_role` de Supabase nunca llevará el prefijo `NEXT_PUBLIC_` y nunca se guardará en Netlify para ser consumida por el navegador.

### Validación

```bash
pnpm --dir apps/web lint
pnpm --dir apps/web build
```

### Criterio de aceptación

- Lint y build terminan sin errores y no existen credenciales privadas dentro del bundle del navegador.

---

## Fase 3 — Preparar Supabase

### Modelo inicial

La primera migración conservará el concepto actual de combo y añadirá las restricciones necesarias:

```text
combos
- id: uuid
- name: text
- description: text
- price: numeric(10,2)
- currency: text, inicialmente USD
- image_url: text nullable
- category: text
- available: boolean
- created_at: timestamptz
- updated_at: timestamptz
```

### Tareas

- [ ] Crear o seleccionar el proyecto Supabase que se usará para el MVP.
- [ ] Convertir `supabase-schema.sql` en una migración versionada.
- [ ] Hacer que triggers y políticas sean repetibles sin fallar al ejecutar nuevamente la migración.
- [ ] Agregar la columna `currency`.
- [ ] Evitar insertar datos de ejemplo en cada ejecución de la migración.
- [ ] Mover los datos de ejemplo a `supabase/seed.sql`.
- [ ] Crear el bucket `combo-images`.
- [ ] Permitir lectura pública de imágenes.
- [ ] Prohibir escrituras públicas al bucket.
- [ ] Crear un usuario administrador mediante Supabase Auth.
- [ ] Crear una forma explícita de identificar administradores, preferiblemente `app_metadata.role = "admin"`.
- [ ] Revisar las políticas RLS para que un administrador pueda consultar también combos desactivados.
- [ ] Guardar de forma segura la URL, la clave pública y la clave privada del proyecto.

### Criterio de aceptación

- Un usuario anónimo solo puede consultar combos disponibles.
- Un administrador autenticado puede consultar el catálogo completo.
- Nadie puede modificar combos o imágenes sin autorización.

---

## Fase 4 — Crear la API en Go

### Endpoints del MVP

```text
GET    /health
GET    /v1/combos
GET    /v1/admin/combos
POST   /v1/admin/combos
GET    /v1/admin/combos/{id}
PATCH  /v1/admin/combos/{id}
DELETE /v1/admin/combos/{id}
POST   /v1/admin/combos/{id}/image
```

### Tareas

- [ ] Inicializar el módulo Go dentro de `apps/api`.
- [ ] Crear un servidor HTTP con apagado ordenado y timeouts.
- [ ] Crear `GET /health` sin dependencias externas.
- [ ] Cargar configuración desde variables de entorno.
- [ ] Validar al iniciar que las variables obligatorias existan.
- [ ] Implementar un cliente de la Data API de Supabase para el CRUD inicial.
- [ ] Implementar acceso a Supabase Storage para imágenes.
- [ ] Verificar los JWT emitidos por Supabase.
- [ ] Crear middleware que exija el rol `admin` en todos los endpoints administrativos.
- [ ] Validar nombre, descripción, precio, categoría, moneda e imagen.
- [ ] Limitar imágenes por tipo MIME y tamaño.
- [ ] Devolver errores JSON con una estructura consistente.
- [ ] Configurar CORS solamente para localhost y los dominios autorizados de Netlify.
- [ ] Agregar logs estructurados sin incluir tokens ni credenciales.
- [ ] Documentar la API en `packages/contracts/openapi.yaml`.

### Variables privadas de la API

```env
PORT=8080
APP_ENV=development
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ALLOWED_ORIGINS=http://localhost:3000
MAX_IMAGE_BYTES=5242880
```

### Pruebas mínimas

- [ ] Servicio saludable.
- [ ] Lista pública devuelve solamente combos activos.
- [ ] Solicitud administrativa sin token devuelve `401`.
- [ ] Usuario autenticado sin rol devuelve `403`.
- [ ] Administrador puede crear, editar y desactivar un combo.
- [ ] Precio negativo o datos inválidos devuelven `400`.
- [ ] Archivo no permitido es rechazado.

### Validación

```bash
cd apps/api
go fmt ./...
go vet ./...
go test ./...
go run ./cmd/server
```

### Criterio de aceptación

- La API completa funciona localmente y todos los endpoints administrativos están protegidos.

---

## Fase 5 — Conectar Next.js con la API

### Catálogo público

- [ ] Reemplazar `mockCombos` por `GET /v1/combos`.
- [ ] Mantener el filtro de categorías en el frontend.
- [ ] Mostrar un mensaje entendible si la API no responde.
- [ ] Decidir un tiempo corto de caché para el catálogo público.
- [ ] Verificar que un combo desactivado desaparezca del catálogo.

### Panel administrativo

- [ ] Sustituir `admin123` por el login email/contraseña de Supabase Auth.
- [ ] Eliminar `admin_session` de `localStorage`.
- [ ] Mantener la sesión usando el SDK de Supabase Auth.
- [ ] Enviar el access token como `Authorization: Bearer <token>` a Cloud Run.
- [ ] Conectar listado, creación, edición, activación y eliminación con la API.
- [ ] Conectar la subida y sustitución de imágenes.
- [ ] Manejar correctamente sesiones vencidas y cerrar sesión.
- [ ] Pedir confirmación antes de eliminar.

### WhatsApp

- [ ] Leer el número desde `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- [ ] Incluir nombre, precio, moneda y enlace del combo en el mensaje.
- [ ] Probar enlaces de WhatsApp desde Android, iPhone y escritorio.

### Criterio de aceptación

- No quedan referencias de negocio a `mockCombos`.
- Los cambios del administrador persisten y aparecen en el catálogo público.
- No es posible entrar al panel modificando manualmente `localStorage`.

---

## Fase 6 — Contenerizar y publicar la API en Cloud Run

### Preparación de Google Cloud

- [ ] Seleccionar el proyecto correcto de Google Cloud.
- [ ] Vincular la cuenta de facturación que contiene los créditos activos.
- [ ] Habilitar Cloud Run, Cloud Build, Artifact Registry y Secret Manager.
- [ ] Crear un repositorio Docker en Artifact Registry.
- [ ] Crear una cuenta de servicio exclusiva para la API.
- [ ] Conceder únicamente los permisos necesarios.
- [ ] Guardar `SUPABASE_SERVICE_ROLE_KEY` en Secret Manager.

### Configuración inicial recomendada

```text
Región: us-east1
Instancias mínimas: 0
Instancias máximas: 2
CPU: 1
Memoria: 256 MiB o 512 MiB
Timeout: 15 segundos
Acceso Cloud Run: público para la API
Protección admin: JWT y rol dentro de la aplicación
```

### Tareas

- [ ] Crear un Dockerfile multietapa que produzca una imagen pequeña.
- [ ] Ejecutar el contenedor localmente.
- [ ] Construir y subir la imagen con Cloud Build.
- [ ] Desplegar el servicio en Cloud Run.
- [ ] Asociar los secretos sin escribirlos como texto plano en comandos o archivos.
- [ ] Configurar `ALLOWED_ORIGINS` con el dominio real de Netlify.
- [ ] Establecer máximo de dos instancias para contener costos.
- [ ] Confirmar que la aplicación escala a cero.
- [ ] Revisar Cloud Logging después de las primeras llamadas.

### Comandos de referencia

Los nombres se reemplazarán por los valores reales antes de ejecutarlos:

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com

gcloud builds submit apps/api \
  --tag us-east1-docker.pkg.dev/PROJECT_ID/pintury/api:VERSION

gcloud run deploy pintury-api \
  --image us-east1-docker.pkg.dev/PROJECT_ID/pintury/api:VERSION \
  --region us-east1 \
  --allow-unauthenticated \
  --min 0 \
  --max 2 \
  --memory 512Mi
```

Antes de ejecutar se verificará la sintaxis vigente de `gcloud` y se evitará colocar secretos directamente en el historial de la terminal.

### Criterio de aceptación

- `GET /health` responde desde la URL pública de Cloud Run.
- Los endpoints administrativos rechazan solicitudes sin un JWT válido.
- No aparecen secretos en logs, imagen Docker ni historial Git.

---

## Fase 7 — Publicar el frontend actualizado en Netlify

### Tareas

- [ ] Cambiar el directorio base del sitio a `apps/web`.
- [ ] Configurar la versión de Node utilizada por Netlify.
- [ ] Configurar el comando de instalación y build con pnpm.
- [ ] Agregar `NEXT_PUBLIC_API_BASE_URL` con la URL de Cloud Run.
- [ ] Agregar las variables públicas de Supabase Auth.
- [ ] Agregar `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- [ ] Crear primero un Deploy Preview.
- [ ] Ejecutar el checklist completo contra el Deploy Preview.
- [ ] Publicar en producción solamente después de aprobar el preview.
- [ ] Confirmar que es posible regresar al deploy anterior.

### Criterio de aceptación

- El sitio público carga desde Netlify, consulta Cloud Run y el panel administra datos reales en Supabase.

---

## Fase 8 — QA previo al lanzamiento

### Catálogo

- [ ] Se muestran solamente combos disponibles.
- [ ] Los precios y monedas son correctos.
- [ ] Los filtros funcionan en móvil y escritorio.
- [ ] Imágenes inexistentes o dañadas no rompen la página.
- [ ] El botón de WhatsApp genera el mensaje correcto.

### Administración

- [ ] Contraseña incorrecta no inicia sesión.
- [ ] La sesión expirada regresa al login.
- [ ] Crear un combo persiste después de recargar.
- [ ] Editar un combo persiste después de recargar.
- [ ] Desactivar un combo lo oculta del sitio público.
- [ ] Eliminar requiere confirmación.
- [ ] Una imagen inválida o demasiado grande es rechazada.

### Seguridad

- [ ] `admin123` ya no existe en el repositorio.
- [ ] La clave `service_role` no está en Netlify ni en código cliente.
- [ ] Los endpoints administrativos devuelven `401` o `403` cuando corresponde.
- [ ] CORS acepta únicamente los orígenes definidos.
- [ ] Los errores públicos no muestran stack traces ni información privada.
- [ ] No existen secretos versionados en Git.

### Calidad y operación

- [ ] `pnpm --dir apps/web lint` pasa.
- [ ] `pnpm --dir apps/web build` pasa.
- [ ] `go vet ./...` pasa.
- [ ] `go test ./...` pasa.
- [ ] Cloud Run muestra logs normales y sin errores repetidos.
- [ ] Las alertas de presupuesto están activas.
- [ ] El servicio mantiene `min-instances=0` y `max-instances=2`.

---

## Fase 9 — Pedidos y reparto, después del MVP

Esta fase comienza solamente cuando el catálogo y el panel estén estables.

### Modelo futuro

```text
orders
- id
- order_number
- buyer_name
- buyer_phone
- recipient_name
- recipient_phone
- delivery_address
- municipality
- subtotal
- delivery_fee
- total
- currency
- status
- notes
- created_at
- updated_at

order_items
- id
- order_id
- combo_id nullable
- combo_name_snapshot
- unit_price_snapshot
- quantity
- line_total

order_events
- id
- order_id
- previous_status
- new_status
- changed_by
- created_at

delivery_zones
- id
- municipality
- delivery_fee
- active
```

### Tareas futuras

- [ ] Formulario de pedido con comprador y destinatario.
- [ ] Zonas y costo de entrega.
- [ ] Panel para cambiar el estado del pedido.
- [ ] Historial de estados.
- [ ] Confirmación por WhatsApp.
- [ ] Copias de seguridad y política de retención.
- [ ] Reportes básicos de ventas y entregas.

No se integrarán pagos o remesas sin verificar previamente el proveedor de pagos, las condiciones para operaciones relacionadas con Cuba y los requisitos legales aplicables.

---

## 5. Orden exacto recomendado

1. Completar la Fase 0.
2. Reorganizar el repositorio sin cambiar comportamiento.
3. Corregir lint y variables del frontend.
4. Preparar migraciones, Auth y Storage en Supabase.
5. Crear y probar la API Go localmente.
6. Conectar el frontend local con la API local.
7. Desplegar la API en Cloud Run.
8. Crear un Deploy Preview en Netlify.
9. Ejecutar QA completo.
10. Publicar el MVP.
11. Monitorear durante varios días antes de comenzar pedidos estructurados.

## 6. Definición de terminado del MVP

El MVP se considera terminado cuando:

- El catálogo público ya no usa mocks.
- El administrador usa autenticación real.
- Todos los cambios persisten en Supabase.
- Las imágenes se guardan en Supabase Storage.
- La API Go corre en Cloud Run con escala a cero.
- El frontend productivo continúa en Netlify.
- Lint, build y pruebas pasan.
- Los secretos no están expuestos.
- Existe una alerta de presupuesto y un procedimiento de rollback.
- Se completó el checklist de QA en móvil y escritorio.

## 7. Regla de control de costos

Durante el MVP no se crearán recursos permanentes de costo fijo. Antes de habilitar un servicio nuevo en Google Cloud se responderán estas preguntas:

1. ¿Es necesario para una función que ya se va a publicar?
2. ¿Puede escalar a cero?
3. ¿Está cubierto por el crédito o por una cuota sin costo?
4. ¿Tiene un límite máximo configurable?
5. ¿Cómo se elimina o revierte si no funciona?
