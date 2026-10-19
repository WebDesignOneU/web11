// src/dto/noticia.dto.js
class NoticiaDTO {
    constructor({ id_noticia, titulo, slug, contenido, imagen_url, fecha_publicacion, destacado, autor_email = null }) {
        this.id = id_noticia;
        this.titulo = titulo;
        this.slug = slug;
        this.contenido = contenido;
        this.imagenUrl = imagen_url;
        this.fechaPublicacion = fecha_publicacion;
        this.destacado = Boolean(destacado);
        this.autor = autor_email ? { email: autor_email } : undefined;
    }
}

module.exports = NoticiaDTO;
