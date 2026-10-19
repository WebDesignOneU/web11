// src/models/noticia.entity.js
class Noticia {
    // "autor_email" proviene del JOIN con usuarios en NoticiaService.getAll/getBySlug
    constructor({
        id_noticia, id_autor, titulo, slug, contenido, imagen_url,
        fecha_publicacion, destacado, autor_email = null
    }) {
        this.id_noticia = id_noticia;
        this.id_autor = id_autor;
        this.titulo = titulo;
        this.slug = slug;
        this.contenido = contenido;
        this.imagen_url = imagen_url;
        this.fecha_publicacion = fecha_publicacion;
        this.destacado = destacado;
        this.autor_email = autor_email;
    }
}

module.exports = Noticia;
