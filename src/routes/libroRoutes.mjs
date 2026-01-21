import express from 'express';
import { LibroController } from '../controllers/LibroController.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';

const router = express.Router();
const controller = new LibroController();

/**
 * GET /api/libros/top-autores
 * Obtiene los top 5 autores por número de libros
 * Requiere: API Key válida
 */
router.get('/top-autores', apiKeyMiddleware, controller.getTopAuthors);

/**
 * GET /api/libros/prestamos-por-genero
 * Obtiene los géneros con más préstamos
 * Requiere: API Key válida
 */
router.get('/prestamos-por-genero', apiKeyMiddleware, controller.getLentByGenre);

export default router;