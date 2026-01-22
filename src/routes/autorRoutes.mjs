import express from 'express';
import { AutorController } from '../controllers/AutorController.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';
import { adminMiddleware } from '../middlewares/adminMiddleware.mjs';

const router = express.Router();
const controller = new AutorController();

/**
 * GET /api/autores/buscar/:nombre
 * Busca autores por nombre
 * Requiere: API Key válida
 */
router.get('/buscar/:nombre', apiKeyMiddleware, controller.buscarPorNombre.bind(controller));

/**
 * GET /api/autores
 * Lista todos los autores
 * Requiere: API Key válida
 */
router.get('/', controller.listarAutores.bind(controller));

/**
 * GET /api/autores/:id
 * Obtiene un autor por ID
 * Requiere: API Key válida
 */
router.get('/:id', apiKeyMiddleware, controller.obtenerAutor.bind(controller));

/**
 * POST /api/autores
 * Crea un nuevo autor
 * Requiere: API Key válida
 */
router.post('/', adminMiddleware, controller.crearAutor.bind(controller));

/**
 * PUT /api/autores/:id
 * Actualiza un autor
 * Requiere: API Key válida
 */
router.put('/:id', adminMiddleware, controller.actualizarAutor.bind(controller));

/**
 * DELETE /api/autores/:id
 * Elimina un autor
 * Requiere: API Key válida
 */
router.delete('/:id', adminMiddleware, controller.eliminarAutor.bind(controller));

export default router;