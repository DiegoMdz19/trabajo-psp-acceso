import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

const autoresData = [
  { nombre: 'Gabriel García Márquez', email: 'ggm@literature.com', biografia: 'Escritor colombiano', fecha_nacimiento: '1927-03-06', nacionalidad: 'Colombiano' },
  { nombre: 'Isabel Allende', email: 'iallende@literature.com', biografia: 'Escritora chilena', fecha_nacimiento: '1942-08-02', nacionalidad: 'Chilena' },
  { nombre: 'Jorge Luis Borges', email: 'jlborges@literature.com', biografia: 'Escritor argentino', fecha_nacimiento: '1899-08-24', nacionalidad: 'Argentino' },
  { nombre: 'Julio Cortázar', email: 'jcortazar@literature.com', biografia: 'Escritor argentino', fecha_nacimiento: '1914-08-26', nacionalidad: 'Argentino' },
  { nombre: 'Mario Vargas Llosa', email: 'mvargasllosa@literature.com', biografia: 'Escritor peruano', fecha_nacimiento: '1936-03-28', nacionalidad: 'Peruano' },
  { nombre: 'Octavio Paz', email: 'opaz@literature.com', biografia: 'Poeta mexicano', fecha_nacimiento: '1914-03-31', nacionalidad: 'Mexicano' },
  { nombre: 'Pablo Neruda', email: 'pneruda@literature.com', biografia: 'Poeta chileno', fecha_nacimiento: '1904-07-12', nacionalidad: 'Chileno' },
  { nombre: 'Laura Esquivel', email: 'lesquivel@literature.com', biografia: 'Escritora mexicana', fecha_nacimiento: '1950-09-30', nacionalidad: 'Mexicana' }
]

const librosData = [
  { titulo: 'Cien años de soledad', isbn: '978-0307474728', stock: 5 },
  { titulo: 'El amor en los tiempos del cólera', isbn: '978-0307389732', stock: 5 },
  { titulo: 'Crónica de una muerte anunciada', isbn: '978-0307387738', stock: 5 },
  { titulo: 'La casa de los espíritus', isbn: '978-1501117015', stock: 5 },
  { titulo: 'Rayuela', isbn: '978-8420635743', stock: 5 },
  { titulo: 'Ficciones', isbn: '978-0802130303', stock: 5 }
]

const usuariosData = [
  { nombre: 'Juan Pérez', email: 'juan@correo.com' },
  { nombre: 'María López', email: 'maria@correo.com' },
  { nombre: 'Carlos Gómez', email: 'carlos@correo.com' },
  { nombre: 'Ana Torres', email: 'ana@correo.com' },
  { nombre: 'Luis Fernández', email: 'luis@correo.com' },
  { nombre: 'Sofía Ramírez', email: 'sofia@correo.com' },
  { nombre: 'Pedro Castillo', email: 'pedro@correo.com' },
  { nombre: 'Lucía Morales', email: 'lucia@correo.com' },
  { nombre: 'Diego Herrera', email: 'diego@correo.com' },
  { nombre: 'Valentina Cruz', email: 'valentina@correo.com' }
]

const libroAutorRelations = [
  { libroIndex: 0, autorIndex: 0 },
  { libroIndex: 1, autorIndex: 0 },
  { libroIndex: 2, autorIndex: 0 },
  { libroIndex: 3, autorIndex: 1 },
  { libroIndex: 4, autorIndex: 3 },
  { libroIndex: 5, autorIndex: 2 }
]

async function limpiarDatos() {
  await supabase.from('prestamos').delete().neq('id', 0)
  await supabase.from('libro_autor').delete().neq('id', 0)
  await supabase.from('libros').delete().neq('id', 0)
  await supabase.from('autores').delete().neq('id', 0)
  await supabase.from('usuarios').delete().neq('id', 0)
}

async function insertarAutores() {
  const { data, error } = await supabase.from('autores')
  .insert(autoresData)
  .select()
  if (error) throw error
  return data
}

async function insertarLibros() {
  const { data, error } = await supabase.from('libros')
  .insert(librosData)
  .select()
  if (error) throw error
  return data
}

async function insertarUsuarios() {
  const { data, error } = await supabase.from('usuarios')
  .insert(usuariosData)
  .select()
  if (error) throw error
  return data
}

async function crearRelacionesLibroAutor(libros, autores) {
  const relaciones = libroAutorRelations.map(r => ({
    libro_id: libros[r.libroIndex].id,
    autor_id: autores[r.autorIndex].id
  }))
  const { error } = await supabase.from('libro_autor')
  .insert(relaciones)
  if (error) throw error
}

async function crearPrestamos(libros, usuarios) {
  const hoy = new Date()
  const en15Dias = new Date(hoy)
  en15Dias.setDate(en15Dias.getDate() + 15)

  const prestamosData = [
    { usuario_id: usuarios[0].id, libro_id: libros[0].id, fecha_prestamo: hoy, fecha_devolucion_esperada: en15Dias, estado: 'activo' },
    { usuario_id: usuarios[1].id, libro_id: libros[1].id, fecha_prestamo: hoy, fecha_devolucion_esperada: en15Dias, estado: 'activo' },
    { usuario_id: usuarios[2].id, libro_id: libros[2].id, fecha_prestamo: hoy, fecha_devolucion_esperada: en15Dias, estado: 'activo' },
    { usuario_id: usuarios[3].id, libro_id: libros[3].id, fecha_prestamo: hoy, fecha_devolucion_esperada: en15Dias, estado: 'activo' },
    { usuario_id: usuarios[4].id, libro_id: libros[4].id, fecha_prestamo: hoy, fecha_devolucion_esperada: en15Dias, estado: 'activo' }
  ]

  await supabase.from('prestamos').insert(prestamosData)

  for (const p of prestamosData) {
    const libro = libros.find(l => l.id === p.libro_id)
    await supabase.from('libros').
    update({ stock: libro.stock - 1 }).
    eq('id', libro.id)
  }
}

async function ingesta() {
  await limpiarDatos()
  const autores = await insertarAutores()
  const libros = await insertarLibros()
  await crearRelacionesLibroAutor(libros, autores)
  const usuarios = await insertarUsuarios()
  await crearPrestamos(libros, usuarios)
  process.exit(0)
}

ingesta()
