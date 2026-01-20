export class Prestamo {
    constructor(data) {

        const estadosValidos = ['activo', 'devuelto', 'vencido']

        if (!usuario_id) {
            throw new Error ("ID de usuario es obligatorio")
        }

        if (!libro_id) {
            throw new Error ("ID de libro es obligatorio")
        }


        this.id = data.id;
        this.usuario_id = data.usuario_id;
        this.libro_id = data.libro_id;
        this.fecha_prestamo = data.fecha_prestamo;
        this.fecha_devolucion_esperada = data.fecha_devolucion_esperada;
        this.estado = estadosValidos.includes(data.estado) ? data.estado : 'activo';
        this.created_at = data.created_at ?? new Date().toISOString();
        this.updated_at = data.updated_at ?? new Date().toISOString();

    }
    toJSON(){
        return {
            id: this.id,
            usuario_id: this.usuario_id,
            libro_id: this.libro_id,
            fecha_prestamo: this.fecha_prestamo,
            fecha_devolucion_esperada: this.fecha_devolucion_esperada,
            estado: this.estado, 
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
    toPublic(){
        return{
            id: this.id,
            usuario_id: this.usuario_id,
            libro_id: this.libro_id,
            fecha_devolucion_esperada: this.fecha_devolucion_esperada,
            estado: this.estado,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }
}