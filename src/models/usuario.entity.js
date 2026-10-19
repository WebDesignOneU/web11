// src/models/usuario.entity.js
class Usuario {
    constructor({ id_usuario, email, password_hash, rol, estado, ultimo_acceso, fecha_registro }) {
        this.id_usuario = id_usuario;
        this.email = email;
        this.password_hash = password_hash; // nunca se expone: usar UsuarioDTO
        this.rol = rol;
        this.estado = estado;
        this.ultimo_acceso = ultimo_acceso;
        this.fecha_registro = fecha_registro;
    }
}

module.exports = Usuario;
