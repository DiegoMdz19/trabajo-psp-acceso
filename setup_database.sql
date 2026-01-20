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

--INGESTA

INSERT INTO autor (nombre, email, biografia, fecha_nacimiento, nacionalidad) VALUES
('Gabriel García Márquez', 'ggm@literature.com', 'Escritor colombiano, premio Nobel de Literatura.', '1927-03-06', 'Colombiano'),
('Isabel Allende', 'iallende@literature.com', 'Escritora chilena reconocida mundialmente.', '1942-08-02', 'Chilena'),
('Jorge Luis Borges', 'jlborges@literature.com', 'Autor argentino clave del siglo XX.', '1899-08-24', 'Argentino'),
('Julio Cortázar', 'jcortazar@literature.com', 'Escritor argentino innovador.', '1914-08-26', 'Argentino'),
('Mario Vargas Llosa', 'mvargasllosa@literature.com', 'Premio Nobel de Literatura 2010.', '1936-03-28', 'Peruano'),
('Jane Austen', 'jausten@literature.com', 'Novelista británica clásica.', '1775-12-16', 'Británica'),
('George Orwell', 'gorwell@literature.com', 'Autor de 1984.', '1903-06-25', 'Británico'),
('Franz Kafka', 'fkafka@literature.com', 'Escritor centroeuropeo fundamental.', '1883-07-03', 'Checo'),
('Haruki Murakami', 'hmurakami@literature.com', 'Escritor japonés contemporáneo.', '1949-01-12', 'Japonés'),
('Margaret Atwood', 'matwood@literature.com', 'Autora canadiense contemporánea.', '1939-11-18', 'Canadiense'),
('Stephen King', 'sking@literature.com', 'Maestro del terror.', '1947-09-21', 'Estadounidense'),
('José Saramago', 'jsaramago@literature.com', 'Premio Nobel portugués.', '1922-11-16', 'Portugués');


INSERT INTO libro (titulo, isbn, stock, genero) VALUES
('Cien años de soledad', '978-0307474728', 8, 'DRAMA'),
('El amor en los tiempos del cólera', '978-0307389732', 6, 'ROMANCE'),
('La casa de los espíritus', '978-1501117015', 7, 'DRAMA'),
('Rayuela', '978-8420635743', 6, 'DRAMA'),
('Ficciones', '978-0802130303', 9, 'FANTASIA'),
('La ciudad y los perros', '978-8420471839', 7, 'DRAMA'),
('Orgullo y prejuicio', '978-0141439518', 9, 'ROMANCE'),
('1984', '978-0451524935', 10, 'ACCION'),
('La metamorfosis', '978-0553213690', 9, 'TERROR'),
('Tokio blues', '978-0375718946', 7, 'ROMANCE'),
('El cuento de la criada', '978-0385490818', 9, 'DRAMA'),
('El resplandor', '978-0307743657', 7, 'TERROR'),
('Harry Potter y la piedra filosofal', '978-0439708180', 12, 'FANTASIA'),
('Ensayo sobre la ceguera', '978-0156034388', 7, 'DRAMA'),
('La peste', '978-0679720218', 6, 'DRAMA');


INSERT INTO usuario (nombre, email) VALUES
('Ana García López', 'ana.garcia@email.com'),
('Carlos Rodríguez Martín', 'carlos.rodriguez@email.com'),
('María Fernández Sánchez', 'maria.fernandez@email.com'),
('Juan Pérez González', 'juan.perez@email.com'),
('Laura Martínez Ruiz', 'laura.martinez@email.com'),
('David López Díaz', 'david.lopez@email.com'),
('Carmen Sánchez Moreno', 'carmen.sanchez@email.com'),
('José González Ramírez', 'jose.gonzalez@email.com'),
('Lucía Hernández Castro', 'lucia.hernandez@email.com'),
('Miguel Castro Ortega', 'miguel.castro@email.com');


INSERT INTO libro_autor (libro_id, autor_id) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 4),
(5, 3),
(6, 5),
(7, 6),
(8, 7),
(9, 8),
(10, 9),
(11, 10),
(12, 11),
(13, 11),
(14, 12),
(15, 12),
(6, 1),
(4, 1),
(11, 7),
(15, 5);

INSERT INTO prestamo (usuario_id, libro_id, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, estado) VALUES
(1, 1, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '10 days', NULL, 'activo'),
(2, 5, CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '12 days', NULL, 'activo'),
(3, 8, CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '8 days', NULL, 'activo'),
(4, 13, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '13 days', NULL, 'activo'),
(5, 11, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '5 days', NULL, 'activo'),
(6, 9, CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '14 days', NULL, 'activo'),
(7, 4, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE - INTERVAL '5 days', 'devuelto'),
(8, 6, CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE - INTERVAL '11 days', CURRENT_DATE - INTERVAL '10 days', 'devuelto'),
(9, 2, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '16 days', CURRENT_DATE - INTERVAL '14 days', 'devuelto'),
(10, 15, CURRENT_DATE - INTERVAL '22 days', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE - INTERVAL '7 days', 'devuelto'),
(1, 7, CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '3 days', 'devuelto'),
(2, 10, CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE + INTERVAL '9 days', NULL, 'activo'),
(3, 14, CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE + INTERVAL '11 days', NULL, 'activo'),
(4, 12, CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE + INTERVAL '7 days', NULL, 'activo'),
(5, 3, CURRENT_DATE - INTERVAL '9 days', CURRENT_DATE + INTERVAL '6 days', NULL, 'activo');

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