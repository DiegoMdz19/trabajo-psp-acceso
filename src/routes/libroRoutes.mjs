import express from 'express';
import { LibroController } from '../controllers/LibroController.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';

const router = express.Router();
const controller = new LibroController();

/**
 * GET /api/libros
 * Lista todos los libros
 * Requiere: API Key válida
 */
router.get('/', apiKeyMiddleware, controller.listAll);

/**
 * GET /api/libros/:id
 * Obtiene un libro por ID
 * Requiere: API Key válida
 */
router.get('/:id', apiKeyMiddleware, controller.getById);

/**
 * POST /api/libros
 * Crea un nuevo libro
 * Requiere: API Key válida
 */
router.post('/', apiKeyMiddleware, controller.create);

/**
 * PUT /api/libros/:id
 * Actualiza un libro
 * Requiere: API Key válida
 */
router.put('/:id', apiKeyMiddleware, controller.update);

/**
 * DELETE /api/libros/:id
 * Elimina un libro
 * Requiere: API Key válida
 */
router.delete('/:id', apiKeyMiddleware, controller.delete);

/**
 * GET /api/libros/search/isbn/:isbn
 * Busca libros por ISBN
 * Requiere: API Key válida
 */
//router.get('/search/isbn/:isbn', apiKeyMiddleware, controller.searchByIsbn);

/**
 * GET /api/libros/search/titulo/:titulo
 * Busca libros por título
 * Requiere: API Key válida
 */
//router.get('/search/titulo/:titulo', apiKeyMiddleware, controller.searchByTitulo);

/**
 * GET /api/libros/disponibles
 * Lista libros disponibles
 * Requiere: API Key válida
 */
//router.get('/disponibles', apiKeyMiddleware, controller.listAvailable);

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