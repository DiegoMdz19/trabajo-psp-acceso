import express from 'express';
import { LibroController } from '../controllers/LibroController.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';
import { adminMiddleware } from '../middlewares/adminMiddleware.mjs';

const router = express.Router();
const controller = new LibroController();

/**
 * GET /api/libros/top-autores
 * Obtiene los top 5 autores por número de libros
 * Requiere: API Key válida
 */
router.get('/top-autores', apiKeyMiddleware, controller.getTopAuthors.bind(controller));

/**
 * GET /api/libros/prestamos-por-genero
 * Obtiene los géneros con más préstamos
 * Requiere: API Key válida
 */
router.get('/prestamos-por-genero', apiKeyMiddleware, controller.getLentByGenre.bind(controller));

/**
 * GET /api/libros/disponibles
 * Lista libros con stock disponible
 * Requiere: API Key válida
 */
router.get('/disponibles', apiKeyMiddleware, controller.listAvailable.bind(controller));

/**
 * GET /api/libros/search/isbn/:isbn
 * Busca libros por ISBN
 * Requiere: API Key válida
 */
router.get('/search/isbn/:isbn', apiKeyMiddleware, controller.obtenerPorIsbn.bind(controller));

/**
 * GET /api/libros/search/titulo/:titulo
 * Busca libros por título
 * Requiere: API Key válida
 */
router.get('/search/titulo/:titulo', apiKeyMiddleware, controller.buscarPorTitulo.bind(controller));

/**
 * GET /api/libros
 * Lista todos los libros
 * Requiere: API Key válida
 */
router.get('/', controller.listAll.bind(controller));

/**
 * GET /api/libros/:id
 * Obtiene un libro por ID
 * Requiere: API Key válida
 */
router.get('/:id', apiKeyMiddleware, controller.getById.bind(controller));

/**
 * GET /api/libros/:id/autores
 * Obtiene los autores de un libro específico
 * Requiere: API Key válida
 */
router.get('/:id/autores', apiKeyMiddleware, controller.getAutoresByLibro.bind(controller));

/**
 * POST /api/libros
 * Crea un nuevo libro
 * Requiere: API Key válida
 */
router.post('/', apiKeyMiddleware, controller.create.bind(controller));

/**
 * PUT /api/libros/:id
 * Actualiza un libro
 * Requiere: API Key válida
 */
router.put('/:id', apiKeyMiddleware, controller.update.bind(controller));

/**
 * DELETE /api/libros/:id
 * Elimina un libro
 * Requiere: API Key válida
 */
router.delete('/:id', adminMiddleware, controller.delete.bind(controller));

export default router;