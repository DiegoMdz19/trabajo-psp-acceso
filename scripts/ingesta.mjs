import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const autoresData = [
  {
    nombre: 'Gabriel García Márquez',
    email: 'ggm@literature.com',
    biografia: 'Escritor colombiano, premio Nobel de Literatura en 1982.',
    fecha_nacimiento: '1927-03-06',
    nacionalidad: 'Colombiano'
  },
  {
    nombre: 'Isabel Allende',
    email: 'iallende@literature.com',
    biografia: 'Escritora chilena, una de las novelistas hispanoamericanas más leídas.',
    fecha_nacimiento: '1942-08-02',
    nacionalidad: 'Chilena'
  },
  {
    nombre: 'Jorge Luis Borges',
    email: 'jlborges@literature.com',
    biografia: 'Escritor argentino, uno de los autores más destacados del siglo XX.',
    fecha_nacimiento: '1899-08-24',
    nacionalidad: 'Argentino'
  },
  {
    nombre: 'Julio Cortázar',
    email: 'jcortazar@literature.com',
    biografia: 'Escritor argentino, uno de los más innovadores de su tiempo.',
    fecha_nacimiento: '1914-08-26',
    nacionalidad: 'Argentino'
  },
  {
    nombre: 'Mario Vargas Llosa',
    email: 'mvargasllosa@literature.com',
    biografia: 'Escritor peruano, premio Nobel de Literatura en 2010.',
    fecha_nacimiento: '1936-03-28',
    nacionalidad: 'Peruano'
  },
  {
    nombre: 'Octavio Paz',
    email: 'opaz@literature.com',
    biografia: 'Poeta y ensayista mexicano, premio Nobel de Literatura.',
    fecha_nacimiento: '1914-03-31',
    nacionalidad: 'Mexicano'
  },
  {
    nombre: 'Pablo Neruda',
    email: 'pneruda@literature.com',
    biografia: 'Poeta chileno, premio Nobel de Literatura.',
    fecha_nacimiento: '1904-07-12',
    nacionalidad: 'Chileno'
  },
  {
    nombre: 'Laura Esquivel',
    email: 'lesquivel@literature.com',
    biografia: 'Escritora mexicana, autora de Como agua para chocolate.',
    fecha_nacimiento: '1950-09-30',
    nacionalidad: 'Mexicana'
  },
  {
    nombre: 'Roberto Bolaño',
    email: 'rbolano@literature.com',
    biografia: 'Escritor chileno contemporáneo.',
    fecha_nacimiento: '1953-04-28',
    nacionalidad: 'Chileno'
  },
  {
    nombre: 'Elena Poniatowska',
    email: 'eponiatowska@literature.com',
    biografia: 'Periodista y escritora mexicana.',
    fecha_nacimiento: '1932-05-19',
    nacionalidad: 'Mexicana'
  },
  {
    nombre: 'Carlos Fuentes',
    email: 'cfuentes@literature.com',
    biografia: 'Escritor mexicano del boom latinoamericano.',
    fecha_nacimiento: '1928-11-11',
    nacionalidad: 'Mexicano'
  },
  {
    nombre: 'Clarice Lispector',
    email: 'clispector@literature.com',
    biografia: 'Escritora brasileña.',
    fecha_nacimiento: '1920-12-10',
    nacionalidad: 'Brasileña'
  },
  {
    nombre: 'Juan Rulfo',
    email: 'jrulfo@literature.com',
    biografia: 'Autor de Pedro Páramo.',
    fecha_nacimiento: '1917-05-16',
    nacionalidad: 'Mexicano'
  },
  {
    nombre: 'Fiódor Dostoyevski',
    email: 'fdostoyevski@literature.com',
    biografia: 'Escritor ruso.',
    fecha_nacimiento: '1821-11-11',
    nacionalidad: 'Ruso'
  },
  {
    nombre: 'Virginia Woolf',
    email: 'vwoolf@literature.com',
    biografia: 'Escritora británica.',
    fecha_nacimiento: '1882-01-25',
    nacionalidad: 'Británica'
  },
  {
    nombre: 'Franz Kafka',
    email: 'fkafka@literature.com',
    biografia: 'Escritor checo.',
    fecha_nacimiento: '1883-07-03',
    nacionalidad: 'Checo'
  }
];


const librosData = [
  { titulo: 'Cien años de soledad', isbn: '978-0307474728', stock: 8 },
  { titulo: 'El amor en los tiempos del cólera', isbn: '978-0307389732', stock: 6 },
  { titulo: 'Crónica de una muerte anunciada', isbn: '978-0307387738', stock: 7 },
  { titulo: 'La casa de los espíritus', isbn: '978-1501117015', stock: 7 },
  { titulo: 'Ficciones', isbn: '978-0802130303', stock: 9 },
  { titulo: 'Rayuela', isbn: '978-8420635743', stock: 6 },
  { titulo: 'Pedro Páramo', isbn: '978-0802133908', stock: 7 },
  { titulo: 'Crimen y castigo', isbn: '978-0143058144', stock: 8 },
  { titulo: '1984', isbn: '978-0451524935', stock: 10 },
  { titulo: 'La metamorfosis', isbn: '978-0553213690', stock: 9 }
];


const libroAutorRelations = [
  { libroIndex: 0, autorIndex: 0 },
  { libroIndex: 1, autorIndex: 0 },
  { libroIndex: 2, autorIndex: 0 },
  { libroIndex: 3, autorIndex: 1 },
  { libroIndex: 4, autorIndex: 2 },
  { libroIndex: 5, autorIndex: 3 },
  { libroIndex: 6, autorIndex: 12 },
  { libroIndex: 7, autorIndex: 13 },
  { libroIndex: 8, autorIndex: 19 },
  { libroIndex: 9, autorIndex: 15 }
];

const usuariosData = [
  { nombre: 'Ana Pérez', email: 'ana@demo.com' },
  { nombre: 'Luis Gómez', email: 'luis@demo.com' },
  { nombre: 'María López', email: 'maria@demo.com' },
  { nombre: 'Carlos Ruiz', email: 'carlos@demo.com' },
  { nombre: 'Sofía Torres', email: 'sofia@demo.com' },
  { nombre: 'Javier Molina', email: 'javier@demo.com' },
  { nombre: 'Lucía Fernández', email: 'lucia@demo.com' },
  { nombre: 'Pedro Sánchez', email: 'pedro@demo.com' },
  { nombre: 'Valentina Rojas', email: 'vale@demo.com' },
  { nombre: 'Diego Castro', email: 'diego@demo.com' }
];


async function limpiarDatos() {
  await supabase.from('Prestamo').delete().neq('id', 0);
  await supabase.from('Libro_Autor').delete().neq('id', 0);
  await supabase.from('Libro').delete().neq('id', 0);
  await supabase.from('Autor').delete().neq('id', 0);
  await supabase.from('Usuario').delete().neq('id', 0);
}


async function insertarAutores() {
  const { data, error } = await supabase.from('Autor').insert(autoresData).select();
  if (error) throw error;
  return data;
}

async function insertarLibros() {
  const { data, error } = await supabase.from('Libro').insert(librosData).select();
  if (error) throw error;
  return data;
}

async function insertarUsuarios() {
  const { data, error } = await supabase.from('Usuario').insert(usuariosData).select();
  if (error) throw error;
  return data;
}

async function crearRelacionesLibroAutor(libros, autores) {
  const relaciones = libroAutorRelations.map(r => ({
    libro_id: libros[r.libroIndex].id,
    autor_id: autores[r.autorIndex].id
  }));

  const { error } = await supabase.from('Libro_Autor').insert(relaciones);
  if (error) throw error;
}


async function insertarPrestamos(usuarios, libros) {
  const prestamos = [];

  for (let i = 0; i < 25; i++) {
    const fechaPrestamo = new Date(Date.now() - i * 86400000);
    const fechaDevolucionEsperada = new Date(fechaPrestamo);
    fechaDevolucionEsperada.setDate(fechaPrestamo.getDate() + 14);

    prestamos.push({
      usuario_id: usuarios[i % usuarios.length].id,
      libro_id: libros[i % libros.length].id,
      fecha_prestamo: fechaPrestamo.toISOString(),
      fecha_devolucion_esperada: fechaDevolucionEsperada.toISOString(),
      estado: i % 4 === 0 ? 'devuelto' : 'prestado'
    });
  }

  const { error } = await supabase.from('Prestamo').insert(prestamos);
  if (error) throw error;
}

async function ingesta() {
  try {
    console.log('Iniciando ingesta...');
    await limpiarDatos();

    const autores = await insertarAutores();
    const libros = await insertarLibros();
    await crearRelacionesLibroAutor(libros, autores);

    const usuarios = await insertarUsuarios();
    await insertarPrestamos(usuarios, libros);

    console.log('Ingesta completada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error en ingesta:', error);
    process.exit(1);
  }
}

ingesta();
