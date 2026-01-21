import { supabase } from '../config/supabase.js';


export class PrestamoRepository {
  

  async searchAll() {
    const { data, error } = await supabase
      .from('prestamo')
      .select(`
        *,
        usuario(id, nombre, email),
        libro(id, titulo, isbn)
      `)
      .order('fecha_prestamo', { ascending: false });
    
    if (error) throw error;
    return data;
  }


  async searchById(id) {
    const { data, error } = await supabase
      .from('prestamo')
      .select(`
        *,
        usuario(id, nombre, email),
        libro(id, titulo, isbn, stock)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

 
  async create(prestamo) {
    const { data, error } = await supabase
      .from('prestamo')
      .insert([{
        usuario_id: prestamo.usuario_id,
        libro_id: prestamo.libro_id,
        fecha_prestamo: prestamo.fecha_prestamo || new Date().toISOString(),
        fecha_devolucion_esperada: prestamo.fecha_devolucion_esperada,
        fecha_devolucion_real: null,
        estado: 'activo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        usuario(id, nombre, email),
        libro(id, titulo, isbn)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }


  async update(id, prestamo) {
    const updateData = {
      ...prestamo,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('prestamo')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        usuario(id, nombre, email),
        libro(id, titulo, isbn)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }


  async delete(id) {
    const { error } = await supabase
      .from('prestamo')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }


  async searchByUsuarioId(usuarioId) {
    const { data, error } = await supabase
      .from('prestamo')
      .select(`
        *,
        libro(id, titulo, isbn)
      `)
      .eq('usuario_id', usuarioId)
      .order('fecha_prestamo', { ascending: false });
    
    if (error) throw error;
    return data;
  }


  async searchByLibroId(libroId) {
    const { data, error } = await supabase
      .from('prestamo')
      .select(`
        *,
        usuario(id, nombre, email)
      `)
      .eq('libro_id', libroId)
      .order('fecha_prestamo', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async searchPrestamoActivo() {
    const { data, error } = await supabase
      .from('prestamo')
      .select(`
        *,
        usuario(id, nombre, email),
        libro(id, titulo, isbn, stock)
      `)
      .eq('estado', 'activo')
      .is('fecha_devolucion_real', null)
      .order('fecha_prestamo', { ascending: false });
    
    if (error) throw error;
    return data;
  }


  async searchPrestamoDevuelto() {
    const { data, error } = await supabase
      .from('prestamo')
      .select(`
        *,
        usuario(id, nombre, email),
        libro(id, titulo, isbn)
      `)
      .eq('estado', 'devuelto')
      .not('fecha_devolucion_real', 'is', null)
      .order('fecha_devolucion_real', { ascending: false });
    
    if (error) throw error;
    return data;
  }


  async returnBook(id) {
    const { data, error } = await supabase
      .from('prestamo')
      .update({
        fecha_devolucion_real: new Date().toISOString(),
        estado: 'devuelto',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        usuario(id, nombre, email),
        libro(id, titulo, isbn)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }
  async searchByNacionalidad(nacionalidad) {
    const { data, error } = await supabase
      .from('autor')
      .select('*')
      .eq('nacionalidad', nacionalidad)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
}
  