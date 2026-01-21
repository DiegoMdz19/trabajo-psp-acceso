import { supabase } from '../config/database.mjs';


export class LibroAutorRepo {

async searchAll() {
    const { data, error } = await supabase
      .from('libro_autor')
      .select(`*`)
      .order('titulo');
    
    if (error) throw error;
    return data;
  }

  async searchById(id) {
    const { data, error } = await supabase
      .from('libro_autor')
      .select(`*`)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(libro_autor) {
    const { data, error } = await supabase
      .from('libro_autor')
      .insert([{
        id_libro: libro_autor.id_libro,
        id_autor: libro_autor.id_autor,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id, libro_autor) {
    const updateData = {
      ...libro_autor,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('libro_autor')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from('libro_autor')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }




}