-- Crear la tabla de combos
CREATE TABLE IF NOT EXISTS combos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_combos_category ON combos(category);
CREATE INDEX IF NOT EXISTS idx_combos_available ON combos(available);
CREATE INDEX IF NOT EXISTS idx_combos_created_at ON combos(created_at DESC);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_combos_updated_at
BEFORE UPDATE ON combos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE combos ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer combos disponibles
CREATE POLICY "Combos son visibles públicamente"
ON combos FOR SELECT
USING (available = true);

-- Política: Solo usuarios autenticados pueden insertar
CREATE POLICY "Solo autenticados pueden crear combos"
ON combos FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden actualizar
CREATE POLICY "Solo autenticados pueden actualizar combos"
ON combos FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden eliminar
CREATE POLICY "Solo autenticados pueden eliminar combos"
ON combos FOR DELETE
TO authenticated
USING (true);

-- Crear bucket de storage para imágenes de combos
INSERT INTO storage.buckets (id, name, public)
VALUES ('combo-images', 'combo-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política de storage: Permitir lectura pública
CREATE POLICY "Las imágenes son accesibles públicamente"
ON storage.objects FOR SELECT
USING (bucket_id = 'combo-images');

-- Política de storage: Solo usuarios autenticados pueden subir
CREATE POLICY "Usuarios autenticados pueden subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'combo-images');

-- Política de storage: Solo usuarios autenticados pueden eliminar
CREATE POLICY "Usuarios autenticados pueden eliminar imágenes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'combo-images');

-- Insertar datos de ejemplo
INSERT INTO combos (name, description, price, category, available) VALUES
  ('Combo Familiar', 'Pizza grande, refresco 2L y papas fritas', 15.99, 'familiar', true),
  ('Combo Individual', 'Hamburguesa, papas y refresco', 5.99, 'individual', true),
  ('Combo Pareja', '2 hamburguesas, papas grandes y 2 refrescos', 11.99, 'pareja', true),
  ('Combo Vegetariano', 'Ensalada grande, wrap vegetal y jugo natural', 8.99, 'saludable', true);
