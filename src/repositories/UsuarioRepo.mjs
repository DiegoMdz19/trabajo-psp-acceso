import {supabase} from '../config/database.mjs';

export class UsuarioRepo{


  async searchAll() {
    const { data, error } = await supabase
      .from('usuario')
      .select(`*`)
      .order('Nombre');
    
    if (error) throw error;
    return data;
  }

  async searchById(id) {
    const { data, error } = await supabase
      .from('usuario')
      .select(`*`)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async searchByEmail(email) {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .ilike('email', `%${email}%`)
      .order('email');
    
    if (error) throw error;
    return data;
  }

  async searchByNombre(nombre) {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('nombre', nombre)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }


  async create(usuario) {
    const { data, error } = await supabase
      .from('usuario')
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
      .from('usuario')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from('usuario')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  async list_top_users(){
    const { data, error } = await supabase
    .from('usuarios_top_prestaciones')
    .select('*')
    .order('total_prestamos',{ascending : false });
    
    if (error) throw error;
    return data;
  }

}