// src/dto/suscriptor.dto.js
class SuscriptorDTO {
    constructor({ id_suscriptor, email, nombre, id_usuario, fecha_suscripcion, estado }) {
        this.id = id_suscriptor;
        this.email = email;
        this.nombre = nombre;
        this.idUsuario = id_usuario;
        this.fechaSuscripcion = fecha_suscripcion;
        this.estado = estado;
    }
}

module.exports = SuscriptorDTO;
