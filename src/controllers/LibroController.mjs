import { LibroRepo } from '../repositories/LibroRepo.mjs';

export class LibroController {
  constructor() {
    this.libroRepo = new LibroRepo();
  }

  /**
   * GET /api/libros/top-autores
   * Obtiene los top 5 autores por número de libros
   */
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

  /**
   * GET /api/libros/prestamos-por-genero
   * Obtiene los géneros con más préstamos
   */
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