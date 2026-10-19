// src/dto/convocatoria.dto.js
class ConvocatoriaDTO {
    constructor({ id_convocatoria, titulo, fecha_inicio, fecha_fin, requisitos, estado, total_postulaciones = null }) {
        this.id = id_convocatoria;
        this.titulo = titulo;
        this.fechaInicio = fecha_inicio;
        this.fechaFin = fecha_fin;
        this.requisitos = requisitos;
        this.estado = estado;
        if (total_postulaciones !== null) this.totalPostulaciones = Number(total_postulaciones);
    }
}

module.exports = ConvocatoriaDTO;
