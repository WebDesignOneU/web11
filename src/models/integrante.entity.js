// src/models/integrante.entity.js
class Integrante {
    constructor({ id_integrante, id_usuario, nombre_completo, rol, fotografia_url, biografia, activo }) {
        this.id_integrante = id_integrante;
        this.id_usuario = id_usuario;
        this.nombre_completo = nombre_completo;
        this.rol = rol;
        this.fotografia_url = fotografia_url;
        this.biografia = biografia;
        this.activo = activo;
    }
}

module.exports = Integrante;
