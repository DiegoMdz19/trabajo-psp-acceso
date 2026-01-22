import {LibroRepo} from '../repositories/LibroRepo.mjs'
import {Libro} from '../models/Libro.mjs'

export class LibroController {
    constructor(){
        this.libroRepo = new LibroRepo();
    }

    //GET LISTAR TODOS Libros
    async listarLibros(req, res) {
        try{
            const libros = await this.libroRepo.searchAll();
            const librosPublic = libros.map(libro => new Libro(libro).toPublic());

            res.status(200).json({
                datos: librosPublic,
                mensaje: 'Libros obtenidos correctamente'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener los libros',
                mensaje: error.message
            });
        }
    }

    //GET OBTENER LIBRO POR ID
    async obtenerLibro(req, res) {
        try{
            const {id} = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID no válido',
                    mensaje: 'El ID tiene que ser numérico'
                });
            }

            const libro = await this.libroRepo.searchById(Number(id));

            if (!libro) {
                return res.status(404).json({
                    error: 'Libro no encontrado',
                    mensaje: `No existe un libro con ID ${id}`
                });
            }

            res.status(200).json({
                datos: new Libro(libro).toPublic(),
                mensaje: 'Libro obtenido correctamente'
            })
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener al libro',
                mensaje: error.message
            })
        }
    }

    //POST - CREAR LIBRO
    async crearLibro(req, res) {
        try{
            const datosLibro = req.body;

            if (!libroData.titulo || libroData.titulo.trim().length < 2) {
                return res.status(400).json({
                    error: 'Validación fallida',
                    message: 'El título debe tener al menos 2 letras'
                });
            }

            if (!libroData.isbn) {
                return res.status(400).json({
                    error: 'Validación fallida',
                    message: 'El ISBN es obligatorio'
                });
            }

            if (libroData.stock == null || libroData.stock < 0) {
                return res.status(400).json({
                    error: 'Validación fallida',
                    message: 'El stock debe ser un número no negativo'
                });
            }

            const libroExistente = await this.libroRepo.searchByIsbn(libroData.isbn);
            if (libroExistente) {
                return res.status(400).json({
                    error: 'ISBN duplicado',
                    message: 'Ya existe un libro con ese ISBN'
                });
            }

            const libro = new Libro(datosLibro);
            const libroCreado = await this.libroRepo.create(Libro);

            res.status(201).json({
                datos: new Libro(libroCreado).toPublic(),
                mensaje: 'Libro creado correctamente'
            });
        } catch (error) {
            res.status(400).json({
                error: 'Error al crear el libro',
                mensaje: error.message
            });
        }
    }

    // PUT  ACTUALIZAR LIBRO
    async actualizarLibro(req, res) {
        try{
            const {id} = req.params;
            const datosLibro = req.body;

            if(!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID no válido',
                    mensaje: 'El ID debe de ser numérico'
                });
            }

            const libroExistente = await this.libroRepo.searchById(Numer(id));
            if(!libroExistente) {
                return res.status(404).json({
                    error: 'Libro no encontrado',
                    mensaje: `No existe el libro con ID ${id}`
                });
            }

            const libroActualizado = await this.libroRepo.update(id, datosLibro)

            res.status(200).json({
                datos: new Libro(libroActualizado).toPublic(),
                mensaje: 'Libro actualizado correctamente'
            });
        } catch (error) {
            res.status(400).json({
                error: 'Error al actualizar el libro',
                mensaje: error.message
            });
        }
    }

    //DELETE BORRAR LIBRO
    async eliminarLibro(req, res) {
        try {
            const {id} = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID no válido',
                    mensaje: 'El id debe ser numérico'
                });
            }

            const libroExistente = await this.libroRepo.searchById(Number(id));
            if(!libroExistente) {
                return res.status(404).json({
                    error: 'Libro no encontrado',
                    mensaje: `No existe un libro con ID ${id}`
                });
            }

            await this.libroRepo.delete(id);

            res.status(200).json({
                mensaje: 'Libro eliminado correctamente'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al eliminar el libro',
                mensaje: error.message
            });
        }
    }

    //GET BUSCAR LIBRO POR ISBN
    async buscarPorIsbn (req, res) {
        try {
            const {isbn} = req.params;
            
            const libros = await this.libroRepo.searchByIsbn(isbn);
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
}