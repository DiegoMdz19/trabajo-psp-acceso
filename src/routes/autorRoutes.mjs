import express from 'express';
import { AutorController } from '../controllers/AutorController.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';

const router = express.Router();
const controller = new AutorController();

/**
 * GET /api/autores
 * Lista todos los autores
 * Requiere: API Key válida
 */
router.get('/', apiKeyMiddleware, controller.listarAutores);

/**
 * GET /api/autores/:id
 * Obtiene un autor por ID
 * Requiere: API Key válida
 */
router.get('/:id', apiKeyMiddleware, controller.obtenerAutor);

/**
 * POST /api/autores
 * Crea un nuevo autor
 * Requiere: API Key válida
 */
router.post('/', apiKeyMiddleware, controller.crearAutor);

/**
 * PUT /api/autores/:id
 * Actualiza un autor
 * Requiere: API Key válida
 */
router.put('/:id', apiKeyMiddleware, controller.actualizarAutor);

/**
 * DELETE /api/autores/:id
 * Elimina un autor
 * Requiere: API Key válida
 */
router.delete('/:id', apiKeyMiddleware, controller.eliminarAutor);

/**
 * GET /api/autores/buscar/:nombre
 * Busca autores por nombre
 * Requiere: API Key válida
 */
router.get('/buscar/:nombre', apiKeyMiddleware, controller.buscarPorNombre);

export default router;