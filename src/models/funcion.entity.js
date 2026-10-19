// src/models/funcion.entity.js
class Funcion {
    // "obra_titulo" proviene del JOIN con obras en FuncionService
    constructor({
        id_funcion, id_obra, fecha_hora, lugar, capacidad_total,
        asientos_disponibles, estado, obra_titulo = null
    }) {
        this.id_funcion = id_funcion;
        this.id_obra = id_obra;
        this.fecha_hora = fecha_hora;
        this.lugar = lugar;
        this.capacidad_total = capacidad_total;
        this.asientos_disponibles = asientos_disponibles;
        this.estado = estado;
        this.obra_titulo = obra_titulo;
    }
}

module.exports = Funcion;
