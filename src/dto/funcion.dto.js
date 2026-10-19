// src/dto/funcion.dto.js
class FuncionDTO {
    constructor({ id_funcion, id_obra, fecha_hora, lugar, capacidad_total, asientos_disponibles, estado, obra_titulo = null }) {
        this.id = id_funcion;
        this.idObra = id_obra;
        this.obra = obra_titulo; // título de la obra (JOIN)
        this.fechaHora = fecha_hora;
        this.lugar = lugar;
        this.capacidadTotal = capacidad_total;
        this.asientosDisponibles = asientos_disponibles;
        this.estado = estado;
    }
}

module.exports = FuncionDTO;
