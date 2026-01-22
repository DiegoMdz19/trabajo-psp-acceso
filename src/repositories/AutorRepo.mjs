import {supabase} from '../config/database.mjs';

export class AutorRepo{


  async searchAll() {
    const { data, error } = await supabase
      .from('autor')
      .select(`*`)
      .order('nombre');
    
    if (error) throw error;
    return data;
  }

  async searchByid(autor_id) {
    const { data, error } = await supabase
      .from('autor')
      .select(`*`)
      .eq('autor_autor_id', autor_id)
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
        nacionalautor_idad: autor.nacionalautor_idad,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
async update(autor_id, autor) {
    const updateData = {
      ...autor,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('autor')
      .update(updateData)
      .eq('autor_id', autor_id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(autor_id) {
    const { error } = await supabase
      .from('autor')
      .delete()
      .eq('autor_id', autor_id);
    
    if (error) throw error;
    return true;
  }
}