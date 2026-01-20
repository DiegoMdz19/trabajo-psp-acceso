export class Autor {
    constructor(data) {

        if(!data.nombre){throw new Error("El campo de nombre no puede estar vacío")}
        if(!data.email){throw new Error("El campo de email no puede estar vacío")}

        this.id = data.id ?? null;
        this.nombre = data.nombre.trim();
        this.email = data.email.trim().toLowerCase();
        this.biografia = data.biografia ?? "";
        this.fecha_nacimiento = data.fecha_nacimiento ?? null;
        this.nacionalidad = data.nacionalidad ?? "";
        this.created_at = data.created_at ?? new Date().toISOString();
        this.updated_at = data.updated_at ?? new Date().toISOString();

    }
    toJSON(){
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            biografia: this.biografia,
            fecha_nacimiento: this.fecha_nacimiento,
            nacionalidad: this.nacionalidad,    
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
    toPublic(){
        return{
            id: this.id,
            nombre: this.nombre,
            biografia: this.biografia,
            fecha_nacimiento: this.fecha_nacimiento,
            nacionalidad: this.nacionalidad,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }
}