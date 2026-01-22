import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';

const router = express.Router();
const controller = new UsuarioController();

/**
 * GET /api/usuarios
 * Lista todos los usuarios
 * Requiere: API Key válida
 */
router.get('/', apiKeyMiddleware, controller.listAll);

/**
 * GET /api/usuarios/:id
 * Obtiene un usuario por ID
 * Requiere: API Key válida
 */
router.get('/:id', apiKeyMiddleware, controller.getById);

/**
 * POST /api/usuarios
 * Crea un nuevo usuario
 * Requiere: API Key válida
 */
router.post('/', apiKeyMiddleware, controller.create);

/**
 * PUT /api/usuarios/:id
 * Actualiza un usuario
 * Requiere: API Key válida
 */
router.put('/:id', apiKeyMiddleware, controller.update);

/**
 * DELETE /api/usuarios/:id
 * Elimina un usuario
 * Requiere: API Key válida
 */
router.delete('/:id', apiKeyMiddleware, controller.delete);

/**
 * GET /api/usuarios/search/email/:email
 * Busca usuarios por email
 * Requiere: API Key válida
 */
router.get('/search/email/:email', apiKeyMiddleware, controller.searchByEmail);

/**
 * GET /api/usuarios/search/nombre/:nombre
 * Busca usuarios por nombre
 * Requiere: API Key válida
 */
router.get('/search/nombre/:nombre', apiKeyMiddleware, controller.searchByNombre);

/**
 * GET /api/usuarios/top
 * Obtiene los usuarios con más préstamos
 * Requiere: API Key válida
 */
router.get('/top', apiKeyMiddleware, controller.getTopUsers);

export default router;