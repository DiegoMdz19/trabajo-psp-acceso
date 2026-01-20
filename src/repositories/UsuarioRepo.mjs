import {supabase} from '../config/database.mjs';

export class UsuarioRepo{


  async searchAll() {
    const { data, error } = await supabase
      .from('Us')
      .select(`*`)
      .order('Nombre');
    
    if (error) throw error;
    return data;
  }

  async searchById(id) {
    const { data, error } = await supabase
      .from('Usuario')
      .select(`*`)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async searchByEmail(email) {
    const { data, error } = await supabase
      .from('Usuario')
      .select('*')
      .ilike('email', `%${email}%`)
      .order('email');
    
    if (error) throw error;
    return data;
  }

  async searchByNombre(nombre) {
    const { data, error } = await supabase
      .from('Usuario')
      .select('*')
      .eq('nombre', nombre)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }


  async create(usuario) {
    const { data, error } = await supabase
      .from('Usuario')
      .insert([{
        nombre: usuario.nombre,
        email: usuario.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
async update(id, usuario) {
    const updateData = {
      ...usuario,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('Usuario')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from('Usuario')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}