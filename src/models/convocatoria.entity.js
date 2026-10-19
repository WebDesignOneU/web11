// src/models/convocatoria.entity.js
class Convocatoria {
    // "total_postulaciones" proviene del subconsulta COUNT en ConvocatoriaService
    constructor({
        id_convocatoria, titulo, fecha_inicio, fecha_fin, requisitos, estado,
        total_postulaciones = null
    }) {
        this.id_convocatoria = id_convocatoria;
        this.titulo = titulo;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.requisitos = requisitos;
        this.estado = estado;
        this.total_postulaciones = total_postulaciones;
    }
}

module.exports = Convocatoria;
