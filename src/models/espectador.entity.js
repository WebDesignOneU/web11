// src/models/espectador.entity.js
// El espectador se crea/usa dentro del flujo de reservas (sp_registrar_reserva)
// a partir del CI proporcionado.
class Espectador {
    constructor({ id_espectador, id_usuario, ci, nombre_completo, correo, telefono, es_estudiante_ucb }) {
        this.id_espectador = id_espectador;
        this.id_usuario = id_usuario;
        this.ci = ci;
        this.nombre_completo = nombre_completo;
        this.correo = correo;
        this.telefono = telefono;
        this.es_estudiante_ucb = es_estudiante_ucb;
    }
}

module.exports = Espectador;
