// src/models/suscriptor.entity.js
class Suscriptor {
    constructor({ id_suscriptor, email, nombre, id_usuario, fecha_suscripcion, estado }) {
        this.id_suscriptor = id_suscriptor;
        this.email = email;
        this.nombre = nombre;
        this.id_usuario = id_usuario;
        this.fecha_suscripcion = fecha_suscripcion;
        this.estado = estado;
    }
}

module.exports = Suscriptor;
