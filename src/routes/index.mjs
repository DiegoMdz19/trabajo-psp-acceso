import express from 'express';
import apiKeyRoutes from './apiKeyRoutes.mjs';
import usuarioRoutes from './usuarioRoutes.mjs';
import libroRoutes from './libroRoutes.mjs';
import prestamoRoutes from './prestamoRoutes.mjs';
import autorRoutes from './autorRoutes.mjs';

const router = express.Router();

// Montar las rutas de API Keys
router.use('/', apiKeyRoutes);

// Montar las rutas de Usuarios
router.use('/usuarios', usuarioRoutes);

// Montar las rutas de Libros
router.use('/libros', libroRoutes);

// Montar las rutas de Préstamos
router.use('/prestamos', prestamoRoutes);

// Montar las rutas de Autores
router.use('/autores', autorRoutes);

// Ruta raíz con información de la API
router.get('/', (req, res) => {
  res.json({
    name: 'API con autenticación por API Key',
    version: '1.0.0',
    endpoints: {
      public: [
        'POST /api/register - Registrar y obtener nueva API Key'
      ],
      protected: [
        'GET /api/protected/data - Datos protegidos (requiere API Key)',
        'GET /api/protected/me - Info del cliente (requiere API Key)',
        'GET /api/usuarios - Listar todos los usuarios',
        'GET /api/usuarios/:id - Obtener usuario por ID',
        'POST /api/usuarios - Crear usuario',
        'PUT /api/usuarios/:id - Actualizar usuario',
        'DELETE /api/usuarios/:id - Eliminar usuario',
        'GET /api/usuarios/search/email/:email - Buscar usuarios por email',
        'GET /api/usuarios/search/nombre/:nombre - Buscar usuario por nombre',
        'GET /api/usuarios/top - Top usuarios por préstamos',
        'GET /api/libros - Listar todos los libros',
        'GET /api/libros/:id - Obtener libro por ID',
        'POST /api/libros - Crear libro',
        'PUT /api/libros/:id - Actualizar libro',
        'DELETE /api/libros/:id - Eliminar libro',
        'GET /api/libros/search/isbn/:isbn - Buscar libro por ISBN',
        'GET /api/libros/search/titulo/:titulo - Buscar libros por título',
        'GET /api/libros/disponibles - Listar libros disponibles',
        'GET /api/libros/top-autores - Top 5 autores por libros',
        'GET /api/libros/prestamos-por-genero - Préstamos por género',
        'GET /api/prestamos - Listar todos los préstamos',
        'GET /api/prestamos/:id - Obtener préstamo por ID',
        'POST /api/prestamos - Crear préstamo',
        'PUT /api/prestamos/:id/devolver - Devolver libro',
        'DELETE /api/prestamos/:id - Eliminar préstamo',
        'GET /api/autores - Listar todos los autores',
        'GET /api/autores/:id - Obtener autor por ID',
        'POST /api/autores - Crear autor',
        'PUT /api/autores/:id - Actualizar autor',
        'DELETE /api/autores/:id - Eliminar autor',
        'GET /api/autores/buscar/:nombre - Buscar autores por nombre'
      ],
      admin: [
        'GET /api/admin/keys - Listar todas las API Keys',
        'PUT /api/admin/keys/:apiKey/deactivate - Desactivar API Key',
        'PUT /api/admin/keys/:apiKey/activate - Activar API Key'
      ]
    },
    usage: {
      header: 'X-API-Key',
      example: 'X-API-Key: tu-uuid-aqui'
    }
  });
});

export default router;
