import { AutorRepository } from '../repositories/AutorRepository.mjs';
import { LibroAutorRepository } from '../repositories/LibroAutorRepository.mjs';


export class AutorService {
  constructor() {
    this.autorRepository = new AutorRepository();
    this.libroAutorRepository = new LibroAutorRepository();
  }

 
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  validateAutorData(autor) {
    const errors = [];

    // Validar nombre
    if (!autor.nombre || typeof autor.nombre !== 'string') {
      errors.push('El nombre es obligatorio y debe ser un texto');
    } else if (autor.nombre.trim().length === 0) {
      errors.push('El nombre no puede estar vacío');
    } else if (autor.nombre.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    } else if (autor.nombre.length > 150) {
      errors.push('El nombre no puede exceder 150 caracteres');
    }

    // Validar email (opcional, pero si existe debe ser válido)
    if (autor.email) {
      if (typeof autor.email !== 'string') {
        errors.push('El email debe ser un texto');
      } else if (!this.isValidEmail(autor.email)) {
        errors.push('El formato del email no es válido');
      }
    }

    // Validar biografía (opcional)
    if (autor.biografia !== undefined && autor.biografia !== null) {
      if (typeof autor.biografia !== 'string') {
        errors.push('La biografía debe ser un texto');
      } else if (autor.biografia.length > 2000) {
        errors.push('La biografía no puede exceder 2000 caracteres');
      }
    }

    // Validar fecha de nacimiento (opcional)
    if (autor.fecha_nacimiento) {
      const fecha = new Date(autor.fecha_nacimiento);
      if (isNaN(fecha.getTime())) {
        errors.push('La fecha de nacimiento no es válida');
      } else {
        const hoy = new Date();
        if (fecha > hoy) {
          errors.push('La fecha de nacimiento no puede ser futura');
        }
        // Validar que no sea demasiado antigua (más de 150 años)
        const hace150 = new Date();
        hace150.setFullYear(hace150.getFullYear() - 150);
        if (fecha < hace150) {
          errors.push('La fecha de nacimiento parece incorrecta (más de 150 años)');
        }
      }
    }

    if (autor.nacionalidad !== undefined && autor.nacionalidad !== null) {
      if (typeof autor.nacionalidad !== 'string') {
        errors.push('La nacionalidad debe ser un texto');
      } else if (autor.nacionalidad.length > 100) {
        errors.push('La nacionalidad no puede exceder 100 caracteres');
      }
    }

    if (errors.length > 0) {
      const error = new Error('Validación fallida');
      error.status = 400;
      error.details = errors;
      throw error;
    }
  }


  async validateUniqueEmail(email, excludeId = null) {
    if (!email) return; // Email es opcional

    const existingAutor = await this.autorRepository.searchByEmail(email);
    
    if (existingAutor && existingAutor.id !== excludeId) {
      const error = new Error('Ya existe un autor con ese email');
      error.status = 400;
      throw error;
    }
  }

  async getAllAutores() {
    return await this.autorRepository.searchAll();
  }


  async getAutorById(id) {
    if (!id || !Number.isInteger(Number(id))) {
      const error = new Error('ID inválido');
      error.status = 400;
      throw error;
    }

    const autor = await this.autorRepository.searchById(id);
    
    if (!autor) {
      const error = new Error('Autor no encontrado');
      error.status = 404;
      throw error;
    }

    return autor;
  }


  async createAutor(autorData) {
    // Validar datos del autor
    this.validateAutorData(autorData);

    // Validar email único si se proporciona
    if (autorData.email) {
      await this.validateUniqueEmail(autorData.email);
    }

    // Crear el autor
    return await this.autorRepository.create(autorData);
  }


  async updateAutor(id, autorData) {
    // Verificar que el autor existe
    await this.getAutorById(id);

    // Validar datos
    this.validateAutorData(autorData);

    // Validar email único si se proporciona (excluyendo el autor actual)
    if (autorData.email) {
      await this.validateUniqueEmail(autorData.email, id);
    }

    // Actualizar
    return await this.autorRepository.update(id, autorData);
  }


  async deleteAutor(id) {
    // Verificar que el autor existe
    await this.getAutorById(id);
    
    // Eliminar el autor
    return await this.autorRepository.delete(id);
  }


  async searchAutoresByNombre(nombre) {
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
      const error = new Error('Debe proporcionar un nombre para buscar');
      error.status = 400;
      throw error;
    }

    return await this.autorRepository.searchByNombre(nombre);
  }

  async getLibrosByAutor(autorId) {
    // Verificar que el autor existe
    await this.getAutorById(autorId);

    return await this.libroAutorRepository.getLibrosByAutorId(autorId);
  }

}