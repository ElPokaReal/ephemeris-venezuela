-- Tabla para almacenar las efemérides venezolanas
CREATE TABLE IF NOT EXISTS ephemerides (
  id SERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  event TEXT NOT NULL,
  display_date DATE NOT NULL UNIQUE,
  historical_day INTEGER,
  historical_month INTEGER,
  historical_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Índice para búsqueda rápida por fecha
CREATE INDEX IF NOT EXISTS idx_ephemerides_display_date ON ephemerides(display_date);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_ephemerides_updated_at BEFORE UPDATE ON ephemerides
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE ephemerides ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Permitir lectura pública de efemérides"
ON ephemerides FOR SELECT
TO public
USING (true);

-- Política para permitir inserción solo con service role
CREATE POLICY "Permitir inserción con service role"
ON ephemerides FOR INSERT
TO authenticated
WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE ephemerides IS 'Almacena las efemérides históricas de Venezuela generadas diariamente';
COMMENT ON COLUMN ephemerides.day IS 'Día del mes para mostrar (1-31)';
COMMENT ON COLUMN ephemerides.month IS 'Mes del año para mostrar (1-12)';
COMMENT ON COLUMN ephemerides.year IS 'Año actual para mostrar';
COMMENT ON COLUMN ephemerides.event IS 'Descripción completa del evento histórico';
COMMENT ON COLUMN ephemerides.display_date IS 'Fecha de visualización en formato YYYY-MM-DD';
COMMENT ON COLUMN ephemerides.historical_day IS 'Día histórico real del evento';
COMMENT ON COLUMN ephemerides.historical_month IS 'Mes histórico real del evento';
COMMENT ON COLUMN ephemerides.historical_year IS 'Año histórico real del evento';
