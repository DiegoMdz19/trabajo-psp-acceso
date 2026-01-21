import {supabase} from '../config/database.mjs';

export class AutorRepo{


  async searchAll() {
    const { data, error } = await supabase
      .from('autor')
      .select(`*`)
      .order('Nombre');
    
    if (error) throw error;
    return data;
  }

  async searchById(id) {
    const { data, error } = await supabase
      .from('autor')
      .select(`*`)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async searchByNombre(nombre) {
    const { data, error } = await supabase
      .from('autor')
      .select('*')
      .eq('nombre', nombre)
      .single();
    
    if (error) throw error;
    return data;
  }


  async create(autor) {
    const { data, error } = await supabase
      .from('autor')
      .insert([{
        nombre: autor.nombre,
        email: autor.email,
        biografia: autor.biografia || null,
        fecha_nacimiento: autor.fecha_nacimiento,
        nacionalidad: autor.nacionalidad,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
async update(id, autor) {
    const updateData = {
      ...autor,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('autor')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from('autor')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}