import { supabase } from '../config/supabase.js';


export class PrestamoRepository {
  

  async searchAll() {
    const { data, error } = await supabase
      .from('Prestamo')
      .select(`
        *,
        Usuario(id, nombre, email),
        Libro(id, titulo, isbn)
      `)
      .order('fecha_prestamo', { ascending: false });
    
    if (error) throw error;
    return data;
  }


  async searchById(id) {
    const { data, error } = await supabase
      .from('Prestamo')
      .select(`
        *,
        Usuario(id, nombre, email),
        Libro(id, titulo, isbn, stock)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

 
  async create(prestamo) {
    const { data, error } = await supabase
      .from('Prestamo')
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
        Usuario(id, nombre, email),
        Libro(id, titulo, isbn)
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
      .from('Prestamo')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        Usuario(id, nombre, email),
        Libro(id, titulo, isbn)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }


  async delete(id) {
    const { error } = await supabase
      .from('Prestamo')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }


  async searchByUsuarioId(usuarioId) {
    const { data, error } = await supabase
      .from('Prestamo')
      .select(`
        *,
        Libro(id, titulo, isbn)
      `)
      .eq('usuario_id', usuarioId)
      .order('fecha_prestamo', { ascending: false });
    
    if (error) throw error;
    return data;
  }


  async searchByLibroId(libroId) {
    const { data, error } = await supabase
      .from('Prestamo')
      .select(`
        *,
        Usuario(id, nombre, email)
      `)
      .eq('libro_id', libroId)
      .order('fecha_prestamo', { ascending: false });
    
    if (error) throw error;
    return data;
  }

}
  