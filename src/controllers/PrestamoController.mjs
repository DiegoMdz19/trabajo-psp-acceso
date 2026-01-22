import {PrestamoRepo} from '../repositories/PrestamoRepo.mjs';
import {LibroRepo} from '../repositories/LibroRepo.mjs';
import {UsuarioRepo} from '../repositories/UsuarioRepo.mjs';
import {Prestamo} from '../models/Prestamo.mjs';

export class PrestamoController {
    constructor() {
        this.prestamoRepo = new PrestamoRepo();
        this.libroRepo = new LibroRepo();
        this.usuarioRepo = new UsuarioRepo();
    }

    //GET LISTAR TDOOS LOS PRESTAMOS
    async listarPrestamos(req, res) {
        try {
            const prestamos = await this.prestamoRepo.searchAll();
            const prestamosPublic = prestamos.map(prestamo => new Prestamo(prestamo).toPublic());

            res.status(200).json({
                datos: prestamosPublic,
                mensaje: 'Prestamos obtenidos correctamente'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener los prestamos',
                mensaje: error.message
            });
        }
    }

    //GET OBTENER PRESTAMO POR ID
    async obtenerPrestamo(req, res) {
        try {
            const {id} = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID no válido',
                    mensaje: 'El ID debe ser numérico'
                });
            }
            const prestamo  = await this.prestamoRepo.searchById(Number(id));

            if(!prestamo) {
                return res.status(404).json({
                    error: 'Préstamo no encontrado',
                    mensaje: `No existe un préstamo con el ID ${id}`
                });
            }

            res.status(200).json({
                datos: new Prestamo(prestamo).toPublic(),
                mensaje: 'Préstamo obtenido correctamente'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener el préstamo',
                mensaje: error.message
            });
        }
    }

    // POST CREAR PRESTAMO
    async crearPrestamo(req, res) {
        try {
            const datosPrestamo = req.body;

            if(!datosPrestamo.usuario_id || isNaN(datosPrestamo.usuario_id)) {
                return res.status(400).json({
                    error: 'No se puede validar',
                    mensaje: 'El ID de usuario no es válido'
                });
            }

            if (!datosPrestamo.libro_id || isNaN(datosPrestamo.libro_id)) {
                return res.status(400).json({
                    error: 'No se puede validar',
                    mensaje: 'El ID de libro no es válido'
                });
            }

            const usuario = await this.usuarioRepo.searchById(Number(datosPrestamo.usuario_id));

            if(!usuario) {
                return res.status(404).json({
                    error: 'Usuario no encontrado',
                    mensaje: `El usuario con ID ${datosPrestamo.usuario_id} no existe`
                });
            }

            const libro = await this.libroRepo.searchById(Number(datosPrestamo.libro_id));

            if(!libro) {
                return res.status(404).json({
                    error: 'Libro no encontrado',
                    mensaje: `El libro con ID ${datosPrestamo.libro_id} no existe`
                });
            }

            if(libro.stock <= 0) {
                return res.status(400).json({
                    error: 'No hay stock',
                    mensaje: 'No hay stock disponible para el libro'
                });
            }

            const fechaPrestamo = new Date();
            const fechaDevolucionEsperada = new Date();
            fechaDevolucionEsperada.setDate(fechaDevolucionEsperada.getDate() + 14);

            const datosPrestamoCompleto = {
                usuario_id: Number(datosPrestamo.usuario_id),
                libro_id: Number(datosPrestamo.libro_id),
                fecha_prestamo: fechaPrestamo.toISOString(),
                fecha_devolucion_esperada: fechaDevolucionEsperada.toISOString(),
                estado: 'activo'
            };
            

            const prestamo = new Prestamo(datosPrestamoCompleto);

            const prestamoCreado = await this.prestamoRepo.create(prestamo)
            await this.libroRepo.bajarStock(datosPrestamo.libro_id, 1);

            res.status(200).json({
                datos: new Prestamo(prestamoCreado).toPublic(),
                mensaje: 'Préstamo creado correctamente'
            });
        } catch (error) {
            res.status(400).json({
                error: 'Error al crear el prestamo',
                mensaje: error.message
            });
           
        }
    }

    // PUT DEVOLVER LIBRO (ACTUALIZAR PRESTAMO)
    async devolverPrestamo(req, res) {
        try {
            const {id} = req.params;

            if(!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'ID no válido',
                    mensaje: 'El ID debe ser numérico'
                });
            }

            const prestamo = await this.prestamoRepo.searchById(Number(id));
            if (!prestamo) {
                return res.status(404).json({
                    error: 'Préstamo no encontrado',
                    mensaje: `No existe un préstamo con el ID ${id}`
                });
            }

            if(prestamo.estado == 'devuelto') {
                return res.status(400).json({
                    error: 'Prestamo ya devuelto',
                    mensaje: 'Este préstamo ya fue devuelto'
                });
            }

            const prestamoActualizado = await this.prestamoRepo.update(id, {estado: 'devuelto'});

            await this.libroRepo.subirStock(prestamo.libro_id, 1);

            res.status(200).json({
                datos: new Prestamo(prestamoActualizado).toPublic(),
                mensaje: 'Libro devuelto correctamente'
            });
        } catch (error) {
            res.status(400).json({
                error: 'Error al devolver el libro',
                mensaje: error.message
            });
        }
    }

    //DELETE ELIMINAR PRESTAMO
    async eliminarPrestamo(req, res) {
        try {
            const {id} = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    error: 'El ID no es válido',
                    mensaje: 'El ID debe ser numérico'
                });
            }

            const prestamo = await this.prestamoRepo.searchById(Number(id));
            if(!prestamo) {
                return res.status(404).json({
                    error: 'Préstamo no encontrado',
                    mensaje: `No existe un préstamo con el ID ${id}`
                });
            }

            await this.prestamoRepo.delete(Number(id));

            res.status(200).json({
                mensaje: 'Préstamo eliminado correctamente'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al eliminar el prestamo',
                mensaje: error.message
            });
        }
    }
}
