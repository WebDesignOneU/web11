// src/dto/usuario.dto.js
// Enmascara el hash de contraseña y expone solo datos públicos del usuario.
class UsuarioDTO {
    constructor({ id_usuario, email, rol, estado, ultimo_acceso, fecha_registro }) {
        this.id = id_usuario;
        this.email = email;
        this.rol = rol;
        this.estado = estado;
        this.ultimoAcceso = ultimo_acceso;
        this.fechaRegistro = fecha_registro;
    }
}

module.exports = UsuarioDTO;
