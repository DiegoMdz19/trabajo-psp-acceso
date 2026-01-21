import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';

const router = express.Router();
const controller = new UsuarioController();

/**
 * GET /api/usuarios/top
 * Obtiene los usuarios con más préstamos
 * Requiere: API Key válida
 */
router.get('/top', apiKeyMiddleware, controller.getTopUsers);

export default router;