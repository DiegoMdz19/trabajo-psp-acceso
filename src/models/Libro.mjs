export class Libro {
    constructor(data) {

        if(!data.titulo){throw new Error("El título es obligatorio")}
        if(!data.isbn){throw new Error("El ISBN es obligatorio")}
        if(data.stock == null){throw new Error("El stock es obligatorio")}
        this.id = data.id ?? null;
        this.titulo = data.titulo.toUpperCase();
        this.isbn = data.isbn.trim().toUpperCase();
        this.stock = data.stock;
        this.created_at = data.created_at ?? new Date().toISOString();
        this.updated_at = data.updated_at ?? new Date().toISOString();

    }
    toJSON(){
        return {
            id: this.id,
            titulo: this.titulo,
            isbn: this.isbn,
            stock: this.stock, 
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
    toPublic(){
        return{
            id: this.id,
            titulo: this.titulo,
            isbn: this.isbn,
            stock:this.stock,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }
}