import { PrestamoRepository } from '../repositories/PrestamoRepository.mjs';
import { LibroRepository } from '../repositories/LibroRepository.mjs';


export class PrestamoService {
  constructor() {
    this.prestamoRepository = new PrestamoRepository();
    this.libroRepository = new LibroRepository();
  }


  validatePrestamoData(prestamo) {
    const errors = [];

    // Validar usuario_id
    if (!prestamo.usuario_id || !Number.isInteger(Number(prestamo.usuario_id))) {
      errors.push('El ID de usuario es obligatorio y debe ser un número entero');
    }

    // Validar libro_id
    if (!prestamo.libro_id || !Number.isInteger(Number(prestamo.libro_id))) {
      errors.push('El ID de libro es obligatorio y debe ser un número entero');
    }

    // Validar fecha_devolucion_esperada
    if (!prestamo.fecha_devolucion_esperada) {
      errors.push('La fecha de devolución esperada es obligatoria');
    } else {
      const fechaDevolucion = new Date(prestamo.fecha_devolucion_esperada);
      if (isNaN(fechaDevolucion.getTime())) {
        errors.push('La fecha de devolución esperada no es válida');
      } else {
        const fechaPrestamo = prestamo.fecha_prestamo ? new Date(prestamo.fecha_prestamo) : new Date();
        if (fechaDevolucion <= fechaPrestamo) {
          errors.push('La fecha de devolución debe ser posterior a la fecha de préstamo');
        }
      }
    }

    if (errors.length > 0) {
      const error = new Error('Validación fallida');
      error.status = 400;
      error.details = errors;
      throw error;
    }
  }


  async checkStockAvailability(libroId) {
    const libro = await this.libroRepository.searchById(libroId);

    if (!libro) {
      const error = new Error('El libro no existe');
      error.status = 404;
      throw error;
    }

    if (libro.stock <= 0) {
      const error = new Error('No hay stock disponible de este libro');
      error.status = 400;
      throw error;
    }

    return libro;
  }


  async getAllPrestamos() {
    return await this.prestamoRepository.searchAll();
  }


  async getPrestamoById(id) {
    if (!id || !Number.isInteger(Number(id))) {
      const error = new Error('ID inválido');
      error.status = 400;
      throw error;
    }

    const prestamo = await this.prestamoRepository.searchById(id);
    
    if (!prestamo) {
      const error = new Error('Préstamo no encontrado');
      error.status = 404;
      throw error;
    }

    return prestamo;
  }


  async createPrestamo(prestamoData) {
    // Validar datos del préstamo
    this.validatePrestamoData(prestamoData);

    // Verificar límite de préstamos del usuario
    await this.checkUserLoanLimit(prestamoData.usuario_id);

    // Verificar disponibilidad de stock
    await this.checkStockAvailability(prestamoData.libro_id);

    // Decrementar stock del libro
    await this.libroRepository.decrementStock(prestamoData.libro_id, 1);

    // Crear el préstamo
    try {
      const prestamo = await this.prestamoRepository.create(prestamoData);
      return prestamo;
    } catch (error) {
      // Si falla la creación del préstamo, restaurar el stock
      await this.libroRepository.incrementStock(prestamoData.libro_id, 1);
      throw error;
    }
  }


  async updatePrestamo(id, prestamoData) {
    // Verificar que el préstamo existe
    await this.getPrestamoById(id);

    // Solo permitir actualizar ciertos campos
    const allowedUpdates = {
      fecha_devolucion_esperada: prestamoData.fecha_devolucion_esperada
    };

    // Validar fecha si se proporciona
    if (allowedUpdates.fecha_devolucion_esperada) {
      const fechaDevolucion = new Date(allowedUpdates.fecha_devolucion_esperada);
      if (isNaN(fechaDevolucion.getTime())) {
        const error = new Error('La fecha de devolución esperada no es válida');
        error.status = 400;
        throw error;
      }
    }

    return await this.prestamoRepository.update(id, allowedUpdates);
  }

 
  async deletePrestamo(id) {
    // Verificar que el préstamo existe
    const prestamo = await this.getPrestamoById(id);

    // Si el préstamo está activo, restaurar el stock
    if (prestamo.estado === 'activo' && !prestamo.fecha_devolucion_real) {
      await this.libroRepository.incrementStock(prestamo.libro_id, 1);
    }

    return await this.prestamoRepository.delete(id);
  }


  async returnBook(id) {
    // Verificar que el préstamo existe
    const prestamo = await this.getPrestamoById(id);

    // Verificar que el préstamo está activo
    if (prestamo.estado !== 'activo' || prestamo.fecha_devolucion_real) {
      const error = new Error('Este préstamo ya ha sido devuelto');
      error.status = 400;
      throw error;
    }

    // Incrementar stock del libro
    await this.libroRepository.incrementStock(prestamo.libro_id, 1);

    // Marcar como devuelto
    return await this.prestamoRepository.returnBook(id);
  }


  async getActiveLoans() {
    return await this.prestamoRepository.searchActiveLoans();
  }


  async getReturnedLoans() {
    return await this.prestamoRepository.searchReturnedLoans();
  }


  async getPrestamosByUsuario(usuarioId) {
    if (!usuarioId || !Number.isInteger(Number(usuarioId))) {
      const error = new Error('ID de usuario inválido');
      error.status = 400;
      throw error;
    }

    return await this.prestamoRepository.searchByUsuarioId(usuarioId);
  }

  async getPrestamosByLibro(libroId) {
    if (!libroId || !Number.isInteger(Number(libroId))) {
      const error = new Error('ID de libro inválido');
      error.status = 400;
      throw error;
    }

    return await this.prestamoRepository.searchByLibroId(libroId);
  }



}