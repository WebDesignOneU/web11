// src/models/postulacion.entity.js
class Postulacion {
    // "convocatoria_titulo" proviene del JOIN con convocatorias en PostulacionService
    constructor({
        id_postulacion, id_convocatoria, id_usuario, nombre_completo, ci, email, telefono,
        carrera_ucb, experiencia_anios, estilo_danza, link_video_demo,
        fecha_postulacion, estado_evaluacion, convocatoria_titulo = null
    }) {
        this.id_postulacion = id_postulacion;
        this.id_convocatoria = id_convocatoria;
        this.id_usuario = id_usuario;
        this.nombre_completo = nombre_completo;
        this.ci = ci;
        this.email = email;
        this.telefono = telefono;
        this.carrera_ucb = carrera_ucb;
        this.experiencia_anios = experiencia_anios;
        this.estilo_danza = estilo_danza;
        this.link_video_demo = link_video_demo;
        this.fecha_postulacion = fecha_postulacion;
        this.estado_evaluacion = estado_evaluacion;
        this.convocatoria_titulo = convocatoria_titulo;
    }
}

module.exports = Postulacion;
