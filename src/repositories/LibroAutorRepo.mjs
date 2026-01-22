import { supabase } from '../config/database.mjs';


export class LibroAutorRepository {
  

  async addAutorToLibro(libroId, autorId) {
    const { data, error } = await supabase
      .from('libro_autor')
      .insert([{
        libro_id: libroId,
        autor_id: autorId,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }


  async removeAutorFromLibro(libroId, autorId) {
    const { error } = await supabase
      .from('libro_autor')
      .delete()
      .eq('libro_id', libroId)
      .eq('autor_id', autorId);
    
    if (error) throw error;
    return true;
  }


  async getAutoresByLibroId(libroId) {
    const { data, error } = await supabase
      .from('libro_autor')
      .select(`
        autor(*)
      `)
      .eq('libro_id', libroId);
    
    if (error) throw error;
    return data.map(item => item.Autor);
  }

 
  async getLibrosByAutorId(autorId) {
    const { data, error } = await supabase
      .from('libro_autor')
      .select(`
        libro(*)
      `)
      .eq('autor_id', autorId);
    
    if (error) throw error;
    return data.map(item => item.Libro);
  }

 
  async exists(libroId, autorId) {
    const { data, error } = await supabase
      .from('libro_autor')
      .select('*')
      .eq('libro_id', libroId)
      .eq('autor_id', autorId)
      .maybeSingle();
    
    if (error) throw error;
    return data !== null;
  }


  async addMultipleAutoresToLibro(libroId, autorIds) {
    const inserts = autorIds.map(autorId => ({
      libro_id: libroId,
      autor_id: autorId,
      created_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('libro_autor')
      .insert(inserts)
      .select();
    
    if (error) throw error;
    return data;
  }


  async removeAllAutoresFromLibro(libroId) {
    const { error } = await supabase
      .from('libro_autor')
      .delete()
      .eq('libro_id', libroId);
    
    if (error) throw error;
    return true;
  }


  async removeAllLibrosFromAutor(autorId) {
    const { error } = await supabase
      .from('libro_autor')
      .delete()
      .eq('autor_id', autorId);
    
    if (error) throw error;
    return true;
  }

 
}