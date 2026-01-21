import { UsuarioRepo } from '../repositories/UsuarioRepo.mjs';

export class UsuarioController {
  constructor() {
    this.usuarioRepo = new UsuarioRepo();
  }

  /**
   * GET /api/usuarios/top
   * Obtiene los usuarios con más préstamos
   */
  async getTopUsers(req, res) {
    try {
      const data = await this.usuarioRepo.list_top_users();
      res.json({
        success: true,
        data: data,
        message: 'Top usuarios por préstamos obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error al obtener top usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}