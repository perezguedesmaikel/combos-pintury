# Instrucciones para Configurar Supabase

## Paso 1: Crear Proyecto en Supabase

1. Ve a https://supabase.com
2. Haz clic en "Start your project"
3. Inicia sesión con GitHub o email
4. Crea una nueva organización si es necesario
5. Haz clic en "New Project"
6. Completa:
   - **Name**: combos-deliciosos (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala)
   - **Region**: Selecciona la más cercana a Cuba (ejemplo: us-east-1)
   - **Pricing Plan**: Free (suficiente para comenzar)
7. Haz clic en "Create new project"
8. Espera 2-3 minutos mientras se crea el proyecto

## Paso 2: Obtener las Credenciales

1. Una vez creado el proyecto, ve a **Settings** (⚙️ en la barra lateral)
2. Haz clic en **API**
3. Copia estos valores:
   - **Project URL**: Lo usarás en `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: Lo usarás en `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Paso 3: Ejecutar el Schema SQL

1. En la barra lateral, haz clic en **SQL Editor** (icono de base de datos)
2. Haz clic en "New query"
3. Abre el archivo `supabase-schema.sql` de este proyecto
4. Copia TODO su contenido
5. Pégalo en el editor SQL de Supabase
6. Haz clic en **RUN** (botón verde en la esquina inferior derecha)
7. Deberías ver: "Success. No rows returned"

## Paso 4: Verificar la Tabla

1. En la barra lateral, haz clic en **Table Editor**
2. Deberías ver la tabla `combos` con 4 filas de ejemplo
3. Si ves la tabla, ¡todo está bien! ✅

## Paso 5: Verificar el Storage

1. En la barra lateral, haz clic en **Storage**
2. Deberías ver un bucket llamado `combo-images`
3. Este bucket es público y almacenará las imágenes de los combos

## Paso 6: Configurar Variables de Entorno

1. Abre el archivo `.env.local` en tu proyecto
2. Reemplaza los valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_muy_larga_aqui
NEXT_PUBLIC_WHATSAPP_NUMBER=5353000000
```

3. Guarda el archivo
4. **IMPORTANTE**: Reinicia el servidor de desarrollo (`npm run dev`)

## Paso 7: Probar la Conexión

1. Inicia el servidor: `npm run dev`
2. Abre http://localhost:3000
3. Deberías ver los 4 combos de ejemplo
4. Si los ves, ¡la conexión funciona! 🎉

## Troubleshooting

### Error: "Invalid API key"
- Verifica que copiaste correctamente la **anon key** (es muy larga)
- Asegúrate de no haber dejado espacios en blanco
- Reinicia el servidor después de cambiar `.env.local`

### No veo los combos de ejemplo
- Verifica que ejecutaste todo el SQL del archivo `supabase-schema.sql`
- Ve al Table Editor y confirma que hay datos en la tabla `combos`
- Revisa la consola del navegador (F12) para ver errores

### Las imágenes no se suben
- Ve a Storage en Supabase
- Confirma que existe el bucket `combo-images`
- Verifica que el bucket sea público
- Revisa las políticas de storage en el SQL Editor

## Políticas de Seguridad (RLS)

El proyecto ya configuró automáticamente:

- ✅ **Lectura pública**: Cualquiera puede ver combos disponibles
- 🔐 **Escritura protegida**: Solo usuarios autenticados pueden modificar

Para usar el panel admin en producción, deberás implementar Supabase Auth. Por ahora usa la contraseña simple para desarrollo.

## Próximos Pasos

Una vez configurado Supabase:

1. ✅ Prueba crear un combo nuevo en el panel admin
2. ✅ Sube una imagen de prueba
3. ✅ Verifica que aparezca en la página principal
4. ✅ Prueba el botón de WhatsApp
5. ✅ Despliega en Vercel cuando esté listo

## Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

¿Problemas? Revisa la consola del navegador (F12) y la terminal donde corre el servidor.
