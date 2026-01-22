import { LibroRepo } from '../repositories/LibroRepo.mjs';

export class LibroController {
  constructor() {
    this.libroRepo = new LibroRepo();
  }

  // Listar todos los libros
  async listAll(req, res) {
    try {
      const data = await this.libroRepo.searchAll();
      res.json({
        success: true,
        data: data,
        message: 'Libros obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error al obtener libros:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener un libro por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await this.libroRepo.searchById(id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Libro no encontrado'
        });
      }
      res.json({
        success: true,
        data: data,
        message: 'Libro obtenido correctamente'
      });
    } catch (error) {
      console.error('Error al obtener libro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear un nuevo libro
  async create(req, res) {
    try {
      const libro = req.body;
      const data = await this.libroRepo.create(libro);
      res.status(201).json({
        success: true,
        data: data,
        message: 'Libro creado correctamente'
      });
    } catch (error) {
      console.error('Error al crear libro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar un libro existente
  async update(req, res) {
    try {
      const { id } = req.params;
      const libro = req.body;
      const data = await this.libroRepo.update(id, libro);
      res.json({
        success: true,
        data: data,
        message: 'Libro actualizado correctamente'
      });
    } catch (error) {
      console.error('Error al actualizar libro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Borrar un libro
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.libroRepo.delete(id);
      res.json({
        success: true,
        message: 'Libro eliminado correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar libro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Lista de top 5 autores con más libros prestados

  async getTopAuthors(req, res) {
    try {
      const data = await this.libroRepo.list_top_5_books_authors();
      res.json({
        success: true,
        data: data,
        message: 'Top 5 autores por libros obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error al obtener top autores:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Generos con más préstamos
  
  async getLentByGenre(req, res) {
    try {
      const data = await this.libroRepo.most_lent_books_by_genre();
      res.json({
        success: true,
        data: data,
        message: 'Préstamos por género obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error al obtener préstamos por género:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}