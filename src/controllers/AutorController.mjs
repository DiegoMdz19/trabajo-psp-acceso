import {AutorRepo} from '../repositories/AutorRepo.mjs'
import {Autor} from '../models/Autor.mjs'

export class AutorController {
    constructor(){
        this.autorRepo = new AutorRepo();
    }

    //GET LISTAR TODOS AUTORES
    async listarAutores(req, res) {
        try{
            const autores = await this.autorRepo.searchAll();
            const autoresPublic = autores.map(autor => new Autor(autor).toPublic());

            res.status(200).json({
                datos: autoresPublic,
                mensaje: 'Autores obtenidos correctamente'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener los autores',
                mensaje: error.message
            });
        }
    }

    //GET OBTENER AUTOR POR ID
    async obtenerAutor(req, res) {
        try{
            const {id} = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID no válido',
                    mensaje: 'El ID tiene que ser numérico'
                });
            }

            const autor = await this.autorRepo.searchById(Number(id));

            if (!autor) {
                return res.status(404).json({
                    error: 'Autor no encontrado',
                    mensaje: `No existe un autor con ID ${id}`
                });
            }

            res.status(200).json({
                datos: new Autor(autor).toPublic(),
                mensaje: 'Autor obtenido correctamente'
            })
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener al autor',
                mensaje: error.message
            })
        }
    }

    //POST - CREAR AUTOR
    async crearAutor(req, res) {
        try{
            const datosAutor = req.body;

            if(!datosAutor.nombre || datosAutor.nombre.trim().length < 3) {
                return res.status(400).json({
                    error: 'El nombre no es válido',
                    mensaje: 'El nombre tiene que ser mayor a 3 letras'
                });
            }

            if (datosAutor.email) {
                if (!datosAutor.email.includes('@') || !datosAutor.email.includes('.')) {
                    return res.status(400).json({
                        error: 'Email no válido'
                    });
                }
            }

            const autor = new Autor(datosAutor);
            const autorCreado = await this.autorRepo.create(autor);

            res.status(201).json({
                datos: new Autor(autorCreado).toPublic(),
                mensaje: 'Autor creado correctamente'
            });
        } catch (error) {
            res.status(400).json({
                error: 'Error al crear el autor',
                mensaje: error.message
            });
        }
    }

    // PUT  ACTUALIZAR AUTOR
    async actualizarAutor(req, res) {
        try{
            const {id} = req.params;
            const datosAutor = req.body;

            if(!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID no válido',
                    mensaje: 'El ID debe de ser numérico'
                });
            }

            const autorExistente = await this.autorRepo.searchById(Number(id));
            if(!autorExistente) {
                return res.status(404).json({
                    error: 'Autor no encontrado',
                    mensaje: `No existe el autor con ID ${id}`
                });
            }

            const autorActualizado = await this.autorRepo.update(id, datosAutor)

            res.status(200).json({
                datos: new Autor(autorActualizado).toPublic(),
                mensaje: 'Autor actualizado correctamente'
            });
        } catch (error) {
            res.status(400).json({
                error: 'Error al actualizar el autor',
                mensaje: error.message
            });
        }
    }

    //DELETE BORRAR AUTOR
    async eliminarAutor(req, res) {
        try {
            const {id} = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID no válido',
                    mensaje: 'El id debe ser numérico'
                });
            }

            const autorExistente = await this.autorRepo.searchById(Number(id));
            if(!autorExistente) {
                return res.status(404).json({
                    error: 'Autor no encontrado',
                    mensaje: `No existe un autor con ID ${id}`
                });
            }

            await this.autorRepo.delete(id);

            res.status(200).json({
                mensaje: 'Autor eliminado correctamente'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al eliminar el autor',
                mensaje: error.message
            });
        }
    }

    //GET BUSCAR AUTOR POR NOMBRE
    async buscarPorNombre (req, res) {
        try {
            const {nombre} = req.params;

            if (!nombre || nombre.trim().length < 2) {
                return res.status(400).json({
                    error: 'Nombre no valido',
                    mensaje: 'El nombre debe tener mínimo 2 letras'
                });
            }
            
            const autores = await this.autorRepo.searchByNombre(nombre);
            const autoresPublic = autores.map(autor => new Autor(autor).toPublic());

            res.status(200).json({
                datos: autoresPublic,
                mensaje: 'Busqueda realizada correctamente'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al buscar autores',
                mensaje: error.message
            })
        }
    }
}