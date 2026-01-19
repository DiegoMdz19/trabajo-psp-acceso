import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Datos de autores
const autoresData = [
  {
    nombre: 'Gabriel García Márquez',
    email: 'ggm@literature.com',
    biografia: 'Escritor colombiano, premio Nobel de Literatura en 1982. Considerado uno de los autores más significativos del siglo XX.',
    fecha_nacimiento: '1927-03-06',
    nacionalidad: 'Colombiano'
  },
  {
    nombre: 'Isabel Allende',
    email: 'iallende@literature.com',
    biografia: 'Escritora chilena, una de las novelistas hispanoamericanas más leídas del mundo.',
    fecha_nacimiento: '1942-08-02',
    nacionalidad: 'Chilena'
  },
  {
    nombre: 'Jorge Luis Borges',
    email: 'jlborges@literature.com',
    biografia: 'Escritor argentino, uno de los autores más destacados de la literatura del siglo XX.',
    fecha_nacimiento: '1899-08-24',
    nacionalidad: 'Argentino'
  },
  {
    nombre: 'Julio Cortázar',
    email: 'jcortazar@literature.com',
    biografia: 'Escritor argentino, uno de los autores más innovadores y originales de su tiempo.',
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
    biografia: 'Poeta y ensayista mexicano, premio Nobel de Literatura en 1990.',
    fecha_nacimiento: '1914-03-31',
    nacionalidad: 'Mexicano'
  },
  {
    nombre: 'Pablo Neruda',
    email: 'pneruda@literature.com',
    biografia: 'Poeta chileno, considerado entre los mejores y más influyentes del siglo XX.',
    fecha_nacimiento: '1904-07-12',
    nacionalidad: 'Chileno'
  },
  {
    nombre: 'Laura Esquivel',
    email: 'lesquivel@literature.com',
    biografia: 'Escritora mexicana, conocida por su novela Como agua para chocolate.',
    fecha_nacimiento: '1950-09-30',
    nacionalidad: 'Mexicana'
  }
];

// Datos de libros
const librosData = [
  { titulo: 'Cien años de soledad', isbn: '978-0307474728', stock: 5 },
  { titulo: 'El amor en los tiempos del cólera', isbn: '978-0307389732', stock: 3 },
  { titulo: 'Crónica de una muerte anunciada', isbn: '978-0307387738', stock: 4 },
  { titulo: 'La casa de los espíritus', isbn: '978-1501117015', stock: 4 },
  { titulo: 'Paula', isbn: '978-0061564895', stock: 2 },
  { titulo: 'Ficciones', isbn: '978-0802130303', stock: 6 },
  { titulo: 'El Aleph', isbn: '978-8420633473', stock: 5 },
  { titulo: 'Rayuela', isbn: '978-8420635743', stock: 3 },
  { titulo: 'Bestiario', isbn: '978-8420634562', stock: 2 },
  { titulo: 'La ciudad y los perros', isbn: '978-8420471839', stock: 4 },
  { titulo: 'La fiesta del chivo', isbn: '978-8420471853', stock: 3 },
  { titulo: 'El laberinto de la soledad', isbn: '978-0140189261', stock: 4 },
  { titulo: 'Veinte poemas de amor y una canción desesperada', isbn: '978-8437604886', stock: 7 },
  { titulo: 'Como agua para chocolate', isbn: '978-0385721219', stock: 5 },
  { titulo: 'El coronel no tiene quien le escriba', isbn: '978-8497592437', stock: 3 }
];

// Relaciones libro-autor (algunos libros tienen múltiples autores para demostrar N:M)
const libroAutorRelations = [
  { libroIndex: 0, autorIndex: 0 },  // Cien años de soledad - García Márquez
  { libroIndex: 1, autorIndex: 0 },  // El amor en los tiempos del cólera - García Márquez
  { libroIndex: 2, autorIndex: 0 },  // Crónica de una muerte anunciada - García Márquez
  { libroIndex: 14, autorIndex: 0 }, // El coronel no tiene quien le escriba - García Márquez
  { libroIndex: 3, autorIndex: 1 },  // La casa de los espíritus - Isabel Allende
  { libroIndex: 4, autorIndex: 1 },  // Paula - Isabel Allende
  { libroIndex: 5, autorIndex: 2 },  // Ficciones - Borges
  { libroIndex: 6, autorIndex: 2 },  // El Aleph - Borges
  { libroIndex: 7, autorIndex: 3 },  // Rayuela - Cortázar
  { libroIndex: 8, autorIndex: 3 },  // Bestiario - Cortázar
  { libroIndex: 9, autorIndex: 4 },  // La ciudad y los perros - Vargas Llosa
  { libroIndex: 10, autorIndex: 4 }, // La fiesta del chivo - Vargas Llosa
  { libroIndex: 11, autorIndex: 5 }, // El laberinto de la soledad - Octavio Paz
  { libroIndex: 12, autorIndex: 6 }, // Veinte poemas - Pablo Neruda
  { libroIndex: 13, autorIndex: 7 }  // Como agua para chocolate - Laura Esquivel
];

/**
 * Limpiar todas las tablas antes de insertar datos nuevos
 */
async function limpiarDatos() {
  console.log(' Limpiando datos existentes...');

  try {
    // Eliminar en orden correcto (respetando foreign keys)
    await supabase.from('prestamos').delete().neq('id', 0);
    await supabase.from('libro_autor').delete().neq('id', 0);
    await supabase.from('libros').delete().neq('id', 0);
    await supabase.from('autores').delete().neq('id', 0);

    console.log('Datos limpiados correctamente');
  } catch (error) {
    console.error('Error al limpiar datos:', error.message);
    throw error;
  }
}

/**
 * Insertar autores en la base de datos
 */
async function insertarAutores() {
  console.log('\n Insertando autores...');

  try {
    const { data, error } = await supabase
      .from('autores')
      .insert(autoresData)
      .select();

    if (error) throw error;

    console.log(`${data.length} autores insertados correctamente`);
    return data;
  } catch (error) {
    console.error('Error al insertar autores:', error.message);
    throw error;
  }
}

/**
 * Insertar libros en la base de datos
 */
async function insertarLibros() {
  console.log('\n Insertando libros...');

  try {
    const { data, error } = await supabase
      .from('libros')
      .insert(librosData)
      .select();

    if (error) throw error;

    console.log(`${data.length} libros insertados correctamente`);
    return data;
  } catch (error) {
    console.error('Error al insertar libros:', error.message);
    throw error;
  }
}

/**
 * Crear relaciones entre libros y autores
 */
async function crearRelacionesLibroAutor(libros, autores) {
  console.log('\n Creando relaciones libro-autor...');

  try {
    const relaciones = libroAutorRelations.map(rel => ({
      libro_id: libros[rel.libroIndex].id,
      autor_id: autores[rel.autorIndex].id
    }));

    const { data, error } = await supabase
      .from('libro_autor')
      .insert(relaciones)
      .select();

    if (error) throw error;

    console.log(`${data.length} relaciones creadas correctamente`);
    return data;
  } catch (error) {
    console.error('Error al crear relaciones:', error.message);
    throw error;
  }
}

/**
 * Crear préstamos de ejemplo
 */
async function crearPrestamosEjemplo(libros) {
  console.log('\n Creando préstamos de ejemplo...');

  try {
    // Obtener usuarios existentes (asumiendo que hay usuarios registrados)
    const { data: usuarios, error: errorUsuarios } = await supabase
      .from('usuarios')
      .select('id')
      .limit(3);

    if (errorUsuarios) throw errorUsuarios;

    if (!usuarios || usuarios.length === 0) {
      console.log('No hay usuarios registrados. Saltando creación de préstamos.');
      return [];
    }

    // Crear algunos préstamos de ejemplo
    const hoy = new Date();
    const en15Dias = new Date(hoy);
    en15Dias.setDate(en15Dias.getDate() + 15);

    const prestamosData = [
      {
        usuario_id: usuarios[0].id,
        libro_id: libros[0].id,
        fecha_prestamo: hoy.toISOString(),
        fecha_devolucion_esperada: en15Dias.toISOString(),
        estado: 'activo'
      }
    ];

    // Si hay más usuarios, crear más préstamos
    if (usuarios.length > 1) {
      prestamosData.push({
        usuario_id: usuarios[1].id,
        libro_id: libros[3].id,
        fecha_prestamo: hoy.toISOString(),
        fecha_devolucion_esperada: en15Dias.toISOString(),
        estado: 'activo'
      });
    }

    const { data, error } = await supabase
      .from('prestamos')
      .insert(prestamosData)
      .select();

    if (error) throw error;

    // Actualizar stock de los libros prestados
    for (const prestamo of prestamosData) {
      const libro = libros.find(l => l.id === prestamo.libro_id);
      await supabase
        .from('libros')
        .update({ stock: libro.stock - 1 })
        .eq('id', libro.id);
    }

    console.log(`${data.length} préstamos creados correctamente`);
    return data;
  } catch (error) {
    console.error('Error al crear préstamos:', error.message);
    throw error;
  }
}

/**
 * Función principal que ejecuta todo el proceso de ingesta
 */
async function ingesta() {
  console.log('Iniciando proceso de ingesta...\n');

  try {
    // 1. Limpiar datos existentes
    await limpiarDatos();

    // 2. Insertar autores
    const autores = await insertarAutores();

    // 3. Insertar libros
    const libros = await insertarLibros();

    // 4. Crear relaciones libro-autor
    await crearRelacionesLibroAutor(libros, autores);

    // 5. Crear préstamos de ejemplo
    await crearPrestamosEjemplo(libros);

    console.log('\n Proceso de ingesta completado exitosamente!\n');
    console.log('Resumen:');
    console.log(`   - ${autores.length} autores`);
    console.log(`   - ${libros.length} libros`);
    console.log(`   - ${libroAutorRelations.length} relaciones libro-autor`);
    console.log('\n Puedes ejecutar este script nuevamente para resetear los datos\n');

  } catch (error) {
    console.error('\n Error durante el proceso de ingesta:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
ingesta();