# 🍔 Combos Deliciosos - Sistema de Gestión de Combos

Sistema web moderno para promocionar y gestionar combos de comida con integración de WhatsApp y panel de administración.

## ✨ Características

- 🎨 **Diseño Moderno**: Interfaz atractiva con animaciones suaves usando Framer Motion
- 📱 **Responsive**: Optimizado para dispositivos móviles, tablets y desktop
- 💬 **Integración WhatsApp**: Los clientes pueden ordenar directamente por WhatsApp
- 🔐 **Panel Admin**: Sistema de gestión completo para crear, editar y eliminar combos
- 🖼️ **Gestión de Imágenes**: Subida y almacenamiento de imágenes en Supabase Storage
- 🏷️ **Categorías**: Organiza combos por categorías (familiar, individual, pareja, etc.)
- ⚡ **Tiempo Real**: Actualizaciones instantáneas con Supabase
- 🎯 **SEO Optimizado**: Next.js con Server-Side Rendering

## 🛠️ Tecnologías

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Base de Datos**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Iconos**: Lucide React

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta en Supabase (gratis)
- Git

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd combos
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

#### a) Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta nueva o inicia sesión
3. Crea un nuevo proyecto
4. Anota tu **URL del proyecto** y **clave anónima (anon key)**

#### b) Ejecutar el schema SQL

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega todo el contenido del archivo `supabase-schema.sql`
4. Ejecuta la query
5. Esto creará:
   - Tabla `combos`
   - Políticas de seguridad (RLS)
   - Bucket de storage `combo-images`
   - Datos de ejemplo

### 4. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` y configura tus variables:

```env
# Reemplaza con tus credenciales de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui

# Número de WhatsApp (con código de país, sin +)
NEXT_PUBLIC_WHATSAPP_NUMBER=5353000000
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📱 Uso

### Para Clientes (Página Principal)

1. Navega a `http://localhost:3000`
2. Explora los combos disponibles
3. Filtra por categorías
4. Haz clic en "Ordenar por WhatsApp" para contactar

### Para Administradores (Panel Admin)

1. Navega a `http://localhost:3000/admin`
2. Ingresa la contraseña: `admin123`
3. Gestiona tus combos:
   - ➕ Agregar nuevos combos
   - ✏️ Editar combos existentes
   - 🗑️ Eliminar combos
   - 📸 Subir imágenes
   - 👁️ Activar/desactivar disponibilidad

## 🔒 Seguridad

### Cambiar contraseña del admin

Por defecto, la contraseña es `admin123`. Para cambiarla:

1. Abre `app/admin/page.tsx`
2. Busca la línea:
   ```typescript
   if (password === 'admin123') {
   ```
3. Cambia `'admin123'` por tu contraseña deseada

**Recomendación**: Para producción, implementa Supabase Auth en lugar de contraseña simple.

### Políticas de Supabase

El proyecto usa Row Level Security (RLS):
- ✅ **Lectura pública**: Todos pueden ver combos disponibles
- 🔐 **Escritura protegida**: Solo usuarios autenticados pueden crear/editar/eliminar

## 🌐 Deployment

### Desplegar en Vercel (Recomendado)

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
5. Despliega

### Configurar dominio personalizado

1. En Vercel, ve a Settings > Domains
2. Agrega tu dominio personalizado
3. Sigue las instrucciones de DNS

## 📂 Estructura del Proyecto

```
combos/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Panel de administración
│   ├── globals.css            # Estilos globales
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Página principal (catálogo)
├── components/
│   ├── ComboCard.tsx          # Tarjeta de combo
│   └── FilterBar.tsx          # Barra de filtros
├── lib/
│   └── supabase.ts            # Cliente de Supabase
├── types/
│   └── combo.ts               # Tipos TypeScript
├── public/                    # Archivos estáticos
├── supabase-schema.sql        # Schema de base de datos
├── .env.example               # Ejemplo de variables de entorno
├── .env.local                 # Variables de entorno (no subir a Git)
└── tailwind.config.ts         # Configuración de Tailwind
```

## 🎨 Personalización

### Cambiar colores

Edita `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    500: '#tu-color-principal',
    // ...
  },
}
```

### Agregar más categorías

Las categorías se generan automáticamente desde los combos. Solo crea combos con nuevas categorías en el panel admin.

## 🐛 Solución de Problemas

### Error: "Invalid API key"

- Verifica que las variables en `.env.local` sean correctas
- Asegúrate de reiniciar el servidor de desarrollo después de cambiar `.env.local`

### Las imágenes no se suben

1. Verifica que el bucket `combo-images` exista en Supabase Storage
2. Confirma que las políticas de storage estén configuradas correctamente
3. Revisa la consola del navegador para errores

### No puedo acceder al admin

- La contraseña por defecto es `admin123`
- Verifica que no tengas errores de JavaScript en la consola

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📧 Contacto

Para preguntas o soporte, contacta por WhatsApp usando el número configurado en la aplicación.

---

**Hecho con ❤️ para tu negocio de comida**
