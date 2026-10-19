// src/models/reserva.entity.js
class Reserva {
    // Campos de JOIN provistos por ReservaService:
    //   obra_titulo, funcion_fecha_hora, funcion_lugar, funcion_estado
    constructor({
        id_reserva, codigo_reserva, id_funcion, id_espectador, cantidad_entradas,
        fecha_reserva, estado_reserva,
        obra_titulo = null, funcion_fecha_hora = null, funcion_lugar = null, funcion_estado = null
    }) {
        this.id_reserva = id_reserva;
        this.codigo_reserva = codigo_reserva;
        this.id_funcion = id_funcion;
        this.id_espectador = id_espectador;
        this.cantidad_entradas = cantidad_entradas;
        this.fecha_reserva = fecha_reserva;
        this.estado_reserva = estado_reserva;
        this.obra_titulo = obra_titulo;
        this.funcion_fecha_hora = funcion_fecha_hora;
        this.funcion_lugar = funcion_lugar;
        this.funcion_estado = funcion_estado;
    }
}

module.exports = Reserva;
