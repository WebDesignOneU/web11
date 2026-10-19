// src/dto/obra.dto.js
class ObraDTO {
    constructor({ id_obra, titulo, descripcion, director, imagen_banner, funciones = null }) {
        this.id = id_obra;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.director = director;
        this.imagenBanner = imagen_banner;
        if (funciones) this.funciones = funciones; // próximas funciones (detalle)
    }
}

module.exports = ObraDTO;
