import express from 'express';
import { PrestamoController } from '../controllers/PrestamoController.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';

const router = express.Router();
const controller = new PrestamoController();

/**
 * GET /api/prestamos
 * Lista todos los préstamos
 * Requiere: API Key válida
 */
router.get('/', apiKeyMiddleware, controller.listarPrestamos);

/**
 * GET /api/prestamos/:id
 * Obtiene un préstamo por ID
 * Requiere: API Key válida
 */
router.get('/:id', apiKeyMiddleware, controller.obtenerPrestamo);

/**
 * POST /api/prestamos
 * Crea un nuevo préstamo
 * Requiere: API Key válida
 */
router.post('/', apiKeyMiddleware, controller.crearPrestamo);

/**
 * PUT /api/prestamos/:id/devolver
 * Devuelve un libro (actualiza préstamo)
 * Requiere: API Key válida
 */
router.put('/:id/devolver', apiKeyMiddleware, controller.devolverPrestamo);

/**
 * DELETE /api/prestamos/:id
 * Elimina un préstamo
 * Requiere: API Key válida
 */
router.delete('/:id', apiKeyMiddleware, controller.eliminarPrestamo);

export default router;