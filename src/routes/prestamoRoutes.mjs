import express from 'express';
import { PrestamoController } from '../controllers/PrestamoController.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';
import { adminMiddleware } from '../middlewares/adminMiddleware.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';

const router = express.Router();
const controller = new PrestamoController();

/**
 * GET /api/prestamos
 * Lista todos los préstamos
 * Requiere: API Key válida
 */
router.get('/', adminMiddleware, controller.listarPrestamos.bind(controller));

/**
 * GET /api/prestamos/:id
 * Obtiene un préstamo por ID
 * Requiere: API Key válida
 */
router.get('/:id', adminMiddleware, controller.obtenerPrestamo.bind(controller));

/**
 * POST /api/prestamos
 * Crea un nuevo préstamo
 * Requiere: API Key válida
 */
router.post('/', apiKeyMiddleware, controller.crearPrestamo.bind(controller));

/**
 * PUT /api/prestamos/:id/devolver
 * Devuelve un libro (actualiza préstamo)
 * Requiere: API Key válida
 */
router.put('/:id/devolver', apiKeyMiddleware, controller.devolverPrestamo.bind(controller));

/**
 * DELETE /api/prestamos/:id
 * Elimina un préstamo
 * Requiere: API Key válida
 */
router.delete('/:id', adminMiddleware, controller.eliminarPrestamo.bind(controller));

export default router;