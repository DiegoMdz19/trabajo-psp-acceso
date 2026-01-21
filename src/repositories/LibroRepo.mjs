import { supabase } from '../config/database.mjs';


export class LibroRepo {
  
  async searchAll() {
    const { data, error } = await supabase
      .from('libro')
      .select(`*`)
      .order('titulo');
    
    if (error) throw error;
    return data;
  }

  async searchById(id) {
    const { data, error } = await supabase
      .from('libro')
      .select(`*`)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async searchByIsbn(isbn) {
    const { data, error } = await supabase
      .from('libro')
      .select('*')
      .eq('isbn', isbn)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }


  async create(libro) {
    const { data, error } = await supabase
      .from('libro')
      .insert([{
        titulo: libro.titulo,
        isbn: libro.isbn,
        stock: libro.stock || 0,
        genero: libro.genero || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async update(id, libro) {
    const updateData = {
      ...libro,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('libro')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from('libro')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  async updateStock(id, cantidad) {
    const { data, error } = await supabase
      .from('libro')
      .update({ 
        stock: cantidad,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async subirStock(id, cantidad = 1) {
    const libro = await this.searchById(id);
    return await this.updateStock(id, libro.stock + cantidad);
  }

  async bajarStock(id, cantidad = 1) {
    const libro = await this.searchById(id);
    const newStock = libro.stock - cantidad;
    
    if (newStock < 0) {
      throw new Error('Stock insuficiente');
    }
    
    return await this.updateStock(id, newStock);
  }

  async searchDispo() {
    const { data, error } = await supabase
      .from('libro')
      .select('*')
      .gt('stock', 0)
      .order('titulo');
    
    if (error) throw error;
    return data;
  }


  async searchByTitulo(titulo) {
    const { data, error } = await supabase
      .from('libro')
      .select('*')
      .ilike('titulo', `%${titulo}%`)
      .order('titulo');
    
    if (error) throw error;
    return data;
  }
  // Llama a una vista en SQL 
  async list_top_5_books_authors(){
    const {data, error} = await supabase
    .from('listar_top_5_libros_autores')
    .select('*')
    .order('total_libros',{ascending : false});
   
  if (error) throw error;
    return data;
  }

  async most_lent_books_by_genre(){
    const {error} = await supabase
    .from('top_libros_por_categoria')
    .select('*')
    .order('total_libros', {ascending : false});

  if (error) throw error;
    return data;
  }
}