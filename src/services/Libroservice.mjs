import { LibroRepo } from '../repositories/LibroRepo.mjs';
import { LibroAutorRepo } from '../repositories/LibroAutorRepository.mjs';
import redis from '../config/redis.mjs';

export class LibroService {
  constructor() {
    this.libroRepository = new LibroRepo();
    this.libroAutorRepository = new LibroAutorRepo();
  }

 
  validarLibroData(libro) {
    const errors = [];

    // Validar título
    if (!libro.titulo || typeof libro.titulo !== 'string') {
      errors.push('El título es obligatorio y debe ser un texto');
    } else if (libro.titulo.trim().length === 0) {
      errors.push('El título no puede estar vacío');
    } else if (libro.titulo.length > 200) {
      errors.push('El título no puede exceder 200 caracteres');
    }

    // Validar ISBN
    if (!libro.isbn || typeof libro.isbn !== 'string') {
      errors.push('El ISBN es obligatorio y debe ser un texto');
    } else {
      const isbnClean = libro.isbn.replace(/[-\s]/g, '');
      if (isbnClean.length !== 10 && isbnClean.length !== 13) {
        errors.push('El ISBN debe tener 10 o 13 dígitos');
      }
      if (!/^\d+$/.test(isbnClean)) {
        errors.push('El ISBN solo puede contener números, guiones y espacios');
      }
    }

    // Validar stock
    if (libro.stock !== undefined) {
      if (typeof libro.stock !== 'number' || !Number.isInteger(libro.stock)) {
        errors.push('El stock debe ser un número entero');
      } else if (libro.stock < 0) {
        errors.push('El stock no puede ser negativo');
      }
    }

    if (errors.length > 0) {
      const error = new Error('Validación fallida');
      error.status = 400;
      error.details = errors;
      throw error;
    }
  }

 
  async validarIsbnUnico(isbn, excludeId = null) {
    const existingLibro = await this.libroRepository.searchByIsbn(isbn);
    
    if (existingLibro && existingLibro.id !== excludeId) {
      const error = new Error('Ya existe un libro con ese ISBN');
      error.status = 400;
      throw error;
    }
  }

  async getAllLibros() {
    return await this.libroRepository.searchAll();
  }

 
  async getLibroById(id) {
    if (!id || !Number.isInteger(Number(id))) {
      const error = new Error('ID inválido');
      error.status = 400;
      throw error;
    }

    const libro = await this.libroRepository.searchById(id);
    
    if (!libro) {
      const error = new Error('Libro no encontrado');
      error.status = 404;
      throw error;
    }

    return libro;
  }


  async createLibro(libroData, autorIds = []) {
    // Validar datos del libro
    this.validarLibroData(libroData);

    // Validar ISBN único
    await this.validarIsbnUnico(libroData.isbn);

    // Crear el libro
    const libro = await this.libroRepository.create(libroData);

    // Asociar autores si se proporcionaron
    if (autorIds && autorIds.length > 0) {
      await this.libroAutorRepository.addMultipleAutoresToLibro(libro.id, autorIds);
    }

    // Retornar libro con autores
    return await this.libroRepository.searchById(libro.id);
  }


  async updateLibro(id, libroData) {
    // Verificar que el libro existe
    await this.getLibroById(id);

    // Validar datos
    this.validarLibroData(libroData);

    // Validar ISBN único (excluyendo el libro actual)
    if (libroData.isbn) {
      await this.validarIsbnUnico(libroData.isbn, id);
    }

    // Actualizar
    return await this.libroRepository.update(id, libroData);
  }


  async deleteLibro(id) {
    // Verificar que el libro existe
    await this.getLibroById(id);

    // Eliminar relaciones con autores
    await this.libroAutorRepository.removeAllAutoresFromLibro(id);

    // Eliminar el libro
    return await this.libroRepository.delete(id);
  }


  async searchLibrosByTitulo(titulo) {
    if (!titulo || typeof titulo !== 'string' || titulo.trim().length === 0) {
      const error = new Error('Debe proporcionar un título para buscar');
      error.status = 400;
      throw error;
    }

    return await this.libroRepository.searchByTitulo(titulo);
  }


  async getdispoLibros() {
    return await this.libroRepository.searchDispo();
  }


  async isLibroAvailable(id) {
    const libro = await this.getLibroById(id);
    return libro.stock > 0;
  }


  async updateStock(id, cantidad) {
    if (typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad < 0) {
      const error = new Error('La cantidad debe ser un número entero no negativo');
      error.status = 400;
      throw error;
    }

    await this.getLibroById(id);
    return await this.libroRepository.updateStock(id, cantidad);
  }

  async removeAutorFromLibro(libroId, autorId) {
    await this.getLibroById(libroId);
    return await this.libroAutorRepository.removeAutorFromLibro(libroId, autorId);
  }

  async listTop5BooksAuthors() {
    const cacheKey = 'top_5_books_authors';
    try {
      // Intentar obtener del cache
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log('Datos obtenidos del cache Redis');
        return JSON.parse(cachedData);
      }

      // Si no está en cache, obtener de la base de datos
      const data = await this.libroRepository.list_top_5_books_authors();

      // Guardar en cache por 5 minutos (300 segundos)
      await redis.setEx(cacheKey, 300, JSON.stringify(data));
      console.log('Datos guardados en cache Redis');

      return data;
    } catch (error) {
      console.error('Error al obtener top 5 libros por autores:', error);
      // En caso de error con Redis, obtener directamente de la BD
      return await this.libroRepository.list_top_5_books_authors();
    }
  }

  async mostLentBooksByGenre() {
    const cacheKey = 'most_lent_books_by_genre';
    try {
      // Intentar obtener del cache
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log('Datos obtenidos del cache Redis');
        return JSON.parse(cachedData);
      }

      // Si no está en cache, obtener de la base de datos
      const data = await this.libroRepository.most_lent_books_by_genre();

      // Guardar en cache por 5 minutos (300 segundos)
      await redis.setEx(cacheKey, 300, JSON.stringify(data));
      console.log('Datos guardados en cache Redis');

      return data;
    } catch (error) {
      console.error('Error al obtener libros más prestados por género:', error);
      // En caso de error con Redis, obtener directamente de la BD
      return await this.libroRepository.most_lent_books_by_genre();
    }
  }
}