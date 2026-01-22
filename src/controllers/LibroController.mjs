import { LibroRepo } from '../repositories/LibroRepo.mjs';
import { LibroAutorRepository } from '../repositories/LibroAutorRepo.mjs';
import {Libro} from '../models/Libro.mjs';
import redis from '../config/redis.mjs';

export class LibroController {
  constructor() {
    this.libroRepo = new LibroRepo();
    this.libroAutorRepo = new LibroAutorRepository();
  }

  // GET - Buscar libro por ISBN
  async obtenerPorIsbn(req, res) {
    try {
        const {isbn} = req.params;

        if (!isbn || isNaN(isbn)) {
            return res.status(400).json({
                error: 'ISBN no válido',
                mensaje: 'El ISBN debe ser numérico'
            });
        }
        const libro  = await this.libroRepo.searchByIsbn(Number(isbn));

        if(!libro) {
            return res.status(404).json({
                error: 'Libro no encontrado',
                mensaje: `No existe un libro con el ISBN ${isbn}`
            });
        }

        res.status(200).json({
            datos: new Libro(libro).toPublic(),
            mensaje: 'Libro obtenido correctamente'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener el libro',
            mensaje: error.message
        });
    }
}



  // GET- Buscar libros por título
  async buscarPorTitulo (req, res) {
    try {
        const {titulo} = req.params;

        if (!titulo || titulo.length < 2) {
            return res.status(400).json({
                error: 'Titulo no válido',
                mensaje: 'El titulo debe tener mínimo 2 letras'
            });
        }
        
        const libros = await this.libroRepo.searchByTitulo(titulo);
        const librosPublic = libros.map(libro => new Libro(libro).toPublic());

        res.status(200).json({
            datos: librosPublic,
            mensaje: 'Busqueda realizada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al buscar libros',
            mensaje: error.message
        })
    }
}


  // Listar todos los libros
  async listAll(req, res) {
    try {
      const data = await this.libroRepo.searchAll();
      res.json({
        success: true,
        data: data,
        message: 'Libros obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error al obtener libros:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener un libro por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await this.libroRepo.searchById(id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Libro no encontrado'
        });
      }
      res.json({
        success: true,
        data: data,
        message: 'Libro obtenido correctamente'
      });
    } catch (error) {
      console.error('Error al obtener libro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear un nuevo libro
  async create(req, res) {
    try {
      const libro = req.body;
      const data = await this.libroRepo.create(libro);
      res.status(201).json({
        success: true,
        data: data,
        message: 'Libro creado correctamente'
      });
    } catch (error) {
      console.error('Error al crear libro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar un libro existente
  async update(req, res) {
    try {
      const { id } = req.params;
      const libro = req.body;
      const data = await this.libroRepo.update(id, libro);
      res.json({
        success: true,
        data: data,
        message: 'Libro actualizado correctamente'
      });
    } catch (error) {
      console.error('Error al actualizar libro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Borrar un libro
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.libroRepo.delete(id);
      res.json({
        success: true,
        message: 'Libro eliminado correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar libro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Listar libros con stock disponible
  async listAvailable(req, res) {
    try {
      const data = await this.libroRepo.searchAllWithStock();
      res.json({
        success: true,
        data: data,
        message: 'Libros disponibles obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error al obtener libros disponibles:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Lista de top 5 autores con más libros prestados

  async getTopAuthors(req, res) {
    const cacheKey = 'top_5_books_authors_controller';
    try {
      // Intentar obtener del cache
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log('Datos obtenidos del cache Redis en controlador');
        return res.json({
          success: true,
          data: JSON.parse(cachedData),
          message: 'Top 5 autores por libros obtenidos correctamente (desde cache)'
        });
      }

      // Si no está en cache, obtener del repositorio
      const data = await this.libroRepo.list_top_5_books_authors();

      // Guardar en cache por 5 minutos (300 segundos)
      await redis.setEx(cacheKey, 300, JSON.stringify(data));
      console.log('Datos guardados en cache Redis en controlador');

      res.json({
        success: true,
        data: data,
        message: 'Top 5 autores por libros obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error al obtener top autores:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Generos con más préstamos
  
  async getLentByGenre(req, res) {
    const cacheKey = 'most_lent_books_by_genre_controller';
    try {
      // Intentar obtener del cache
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log('Datos obtenidos del cache Redis en controlador');
        return res.json({
          success: true,
          data: JSON.parse(cachedData),
          message: 'Préstamos por género obtenidos correctamente (desde cache)'
        });
      }

      // Si no está en cache, obtener del repositorio
      const data = await this.libroRepo.most_lent_books_by_genre();

      // Guardar en cache por 5 minutos (300 segundos)
      await redis.setEx(cacheKey, 300, JSON.stringify(data));
      console.log('Datos guardados en cache Redis en controlador');

      res.json({
        success: true,
        data: data,
        message: 'Préstamos por género obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error al obtener préstamos por género:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // GET - Obtener autores de un libro específico
  async getAutoresByLibro(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: 'ID no válido',
          mensaje: 'El ID debe ser numérico'
        });
      }

      // Verificar que el libro existe
      const libro = await this.libroRepo.searchById(Number(id));
      if (!libro) {
        return res.status(404).json({
          error: 'Libro no encontrado',
          mensaje: `No existe un libro con el ID ${id}`
        });
      }

      // Obtener autores del libro
      const autores = await this.libroAutorRepo.getAutoresByLibroId(Number(id));

      res.status(200).json({
        success: true,
        data: autores,
        message: 'Autores del libro obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error al obtener autores del libro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}