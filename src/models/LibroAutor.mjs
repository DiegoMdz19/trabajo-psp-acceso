export class LibroAutor{
    constructor(data) {


        if(!data.libro_id){throw new Error("El ID del libro es obligatorio")}
        if(!data.autor_id){throw new Error("El ID del autor es obligatorio")}

        this.id = data.id ?? null;
        this.libro_id = data.libro_id;
        this.autor_id = data.autor_id;
        this.created_at = data.created_at ?? new Date().toISOString();
        this.updated_at = data.updated_at ?? new Date().toDateString();
    }

    toJSON() {
        return {
            id: this.id,
            libro_id: this.libro_id,
            autor_id: this.autor_id,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }

    toPublic() {
        return {
            libro_id: this.libro_id,
            autor_id: this.autor_id,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}