export class Usuario {
    constructor(data) {

        if(!data.nombre){throw new Error("El campo de nombre no puede estar vacío")}
        if(!data.email){throw new Error("El campo de email no puede estar vacío")}

        this.id = data.id ?? null;
        this.nombre = data.nombre.trim();
        this.email = data.email.toLowerCase();
        this.created_at = data.created_at ?? new Date().toISOString();
        this.updated_at = data.updated_at ?? new Date().toISOString();

    }
    toJSON(){
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,  
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
    toPublic(){
        return{
            id: this.id,
            nombre: this.nombre,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }
}