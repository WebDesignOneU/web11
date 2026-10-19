// src/models/obra.entity.js
class Obra {
    // "funciones" (opcional) contiene las funciones programadas asociadas (detalle)
    constructor({ id_obra, titulo, descripcion, director, imagen_banner, funciones = null }) {
        this.id_obra = id_obra;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.director = director;
        this.imagen_banner = imagen_banner;
        this.funciones = funciones;
    }
}

module.exports = Obra;
