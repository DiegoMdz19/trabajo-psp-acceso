import { UsuarioRepo } from '../repositories/UsuarioRepo.mjs';
import {Usuario} from '../models/Usuario.mjs';

export class UsuarioController {
  constructor() {
    this.usuarioRepo = new UsuarioRepo();
  }


// Buscar usuario por nombre
async buscarPorNombre (req, res) {
  try {
      const {nombre} = req.params;

      if (!nombre || nombre.trim().length < 2) {
          return res.status(400).json({
              error: 'Nombre no valido',
              mensaje: 'El nombre debe tener mínimo 2 letras'
          });
      }
      
      const usuarios = await this.usuarioRepo.searchByNombre(nombre);
      const usuarioPublic = usuarios.map(usuario => new Usuario(usuario).toPublic());

      res.status(200).json({
          datos: usuarioPublic,
          mensaje: 'Busqueda realizada correctamente'
      });
  } catch (error) {
      res.status(500).json({
          error: 'Error al buscar usuarios',
          mensaje: error.message
      })
  }
}
  // Listar todos los usuarios
  async listAll(req, res) {
    try {
      const data = await this.usuarioRepo.searchAll();
      res.json({
        success: true,
        data: data,
        message: 'Usuarios obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  //Obtener un usuario por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await this.usuarioRepo.searchById(id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      res.json({
        success: true,
        data: data,
        message: 'Usuario obtenido correctamente'
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear un nuevo usuario
  async create(req, res) {
    try {
      const usuario = req.body;
      const data = await this.usuarioRepo.create(usuario);
      res.status(201).json({
        success: true,
        data: data,
        message: 'Usuario creado correctamente'
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // actualizar un usuario existente
  async update(req, res) {
    try {
      const { id } = req.params;
      const usuario = req.body;
      const data = await this.usuarioRepo.update(id, usuario);
      res.json({
        success: true,
        data: data,
        message: 'Usuario actualizado correctamente'
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Borrar un usuario
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.usuarioRepo.delete(id);
      res.json({
        success: true,
        message: 'Usuario eliminado correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtiene los usuarios con más préstamos
  
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