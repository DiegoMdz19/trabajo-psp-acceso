import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';
import { adminMiddleware } from '../middlewares/adminMiddleware.mjs';

const router = express.Router();
const controller = new UsuarioController();

/**
 * GET /api/usuarios/search/nombre/:nombre
 * Busca usuarios por nombre
 * Requiere: API Key válida
 */
router.get('/search/nombre/:nombre', apiKeyMiddleware, controller.buscarPorNombre.bind(controller));

/**
 * GET /api/usuarios/top
 * Obtiene los usuarios con más préstamos
 * Requiere: API Key válida
 */
router.get('/top', apiKeyMiddleware, controller.getTopUsers.bind(controller));

/**
 * GET /api/usuarios
 * Lista todos los usuarios
 * Requiere: API Key válida
 */
router.get('/', apiKeyMiddleware, controller.listAll.bind(controller));

/**
 * GET /api/usuarios/:id
 * Obtiene un usuario por ID
 * Requiere: API Key válida
 */
router.get('/:id', apiKeyMiddleware, controller.getById.bind(controller));

/**
 * POST /api/usuarios
 * Crea un nuevo usuario
 * Requiere: API Key válida
 */
router.post('/', adminMiddleware, controller.create.bind(controller));

/**
 * PUT /api/usuarios/:id
 * Actualiza un usuario
 * Requiere: API Key válida
 */
router.put('/:id', adminMiddleware, controller.update.bind(controller));

/**
 * DELETE /api/usuarios/:id
 * Elimina un usuario
 * Requiere: API Key válida
 */
router.delete('/:id', adminMiddleware, controller.delete.bind(controller));

export default router;