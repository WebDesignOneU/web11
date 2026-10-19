// src/dto/reserva.dto.js
class ReservaDTO {
    constructor({
        id_reserva, codigo_reserva, id_funcion, id_espectador, cantidad_entradas,
        fecha_reserva, estado_reserva, obra_titulo = null,
        funcion_fecha_hora = null, funcion_lugar = null, funcion_estado = null
    }) {
        this.id = id_reserva;
        this.codigoReserva = codigo_reserva;
        this.idFuncion = id_funcion;
        this.idEspectador = id_espectador;
        this.cantidadEntradas = cantidad_entradas;
        this.fechaReserva = fecha_reserva;
        this.estadoReserva = estado_reserva;
        if (obra_titulo || funcion_fecha_hora) {
            // Resumen de la función asociada (JOIN)
            this.funcion = {
                id: id_funcion,
                obra: obra_titulo,
                fechaHora: funcion_fecha_hora,
                lugar: funcion_lugar,
                estado: funcion_estado
            };
        }
    }
}

module.exports = ReservaDTO;
