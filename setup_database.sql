-- Autor N:M
CREATE TABLE IF NOT EXISTS autor (
autor_id SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
biografia VARCHAR(200) DEFAULT '',
fecha_nacimiento DATE,
nacionalidad VARCHAR(20) DEFAULT '',
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Libro 1:N
CREATE TABLE IF NOT EXISTS libro (
  libro_id SERIAL PRIMARY KEY,
  titulo VARCHAR(500) NOT NULL,
  isbn VARCHAR(20) UNIQUE NOT NULL,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  genero VARCHAR(50) CHECK (genero IN ('ROMANCE', 'AVENTURAS', 'ACCION', 'FANTASIA', 'TERROR', 'DRAMA')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDICES LIBRO
CREATE INDEX idx_libro_isbn ON libro(isbn);
CREATE INDEX idx_libro_stock ON libro(stock);
CREATE INDEX idx_libro_genero ON libro(genero);

-- Usuario 1:N
CREATE TABLE IF NOT EXISTS usuario (
  usuario_id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--Libro-Autor N:M
CREATE TABLE IF NOT EXISTS libro_autor (
  id SERIAL PRIMARY KEY,
  libro_id INTEGER NOT NULL,
  autor_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), UNIQUE(libro_id, autor_id),
  FOREIGN KEY (autor_id) REFERENCES autor(autor_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (libro_id) REFERENCES libro(libro_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- INDICES LIBRO_AUTOR
CREATE INDEX idx_libro_autor_libro ON libro_autor(libro_id);
CREATE INDEX idx_libro_autor_autor ON libro_autor(autor_id);


-- Prestamo N:1
CREATE TABLE IF NOT EXISTS prestamo (
prestamo_id SERIAL PRIMARY KEY,
usuario_id INTEGER NOT NULL ,
libro_id INTEGER NOT NULL,
fecha_prestamo DATE DEFAULT CURRENT_DATE,
fecha_devolucion_esperada DATE NOT NULL,
fecha_devolucion_real DATE,
estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'devuelto')),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (libro_id) REFERENCES libro(libro_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- INDICES PRESTAMO
CREATE INDEX idx_prestamo_usuario ON prestamo(usuario_id);
CREATE INDEX idx_prestamo_libro ON prestamo(libro_id);
CREATE UNIQUE INDEX idx_prestamo_libro_activo ON prestamo(libro_id) WHERE estado = 'activo';

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger autor
CREATE TRIGGER trg_autor_updated_at
BEFORE UPDATE ON autor
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
-- Trigger libro
CREATE TRIGGER trg_libro_updated_at
BEFORE UPDATE ON libro
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
-- Trigger usuario
CREATE TRIGGER trg_usuario_updated_at
BEFORE UPDATE ON usuario
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
-- Trigger prestamo
CREATE TRIGGER trg_prestamo_updated_at
BEFORE UPDATE ON prestamo
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

/*
Script SQL para crear la tabla api_keys en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  api_key UUID UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas por api_key
CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON api_keys(api_key);

-- Índice para filtrar por estado activo
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

-- Índice para filtrar por rol
CREATE INDEX IF NOT EXISTS idx_api_keys_role ON api_keys(role);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar un administrador de ejemplo para pruebas (opcional)
-- Descomenta las siguientes líneas para crear un admin de prueba
-- INSERT INTO api_keys (api_key, client_name, email, role) 
-- VALUES (
--   gen_random_uuid(), 
--   'Admin', 
--   'admin@example.com',
--   'admin'
-- );

-- Insertar un usuario normal de ejemplo (opcional)
-- INSERT INTO api_keys (api_key, client_name, email, role) 
-- VALUES (
--   gen_random_uuid(), 
--   'Usuario de Prueba', 
--   'user@example.com',
--   'user'
);
*/