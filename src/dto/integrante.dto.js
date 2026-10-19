// src/dto/integrante.dto.js
// El id_usuario (vínculo con la cuenta de acceso) solo se expone a admins.
class IntegranteDTO {
    constructor({ id_integrante, nombre_completo, rol, fotografia_url, biografia, activo }, { incluirUsuario = false } = {}) {
        this.id = id_integrante;
        this.nombreCompleto = nombre_completo;
        this.rol = rol;
        this.fotografiaUrl = fotografia_url;
        this.biografia = biografia;
        this.activo = Boolean(activo);
    }
}

module.exports = IntegranteDTO;
