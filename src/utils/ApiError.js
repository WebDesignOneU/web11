// src/utils/ApiError.js
// Error de negocio con código HTTP asociado. Los servicios lo lanzan y los
// controladores lo traducen a la respuesta JSON correspondiente.
class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

module.exports = ApiError;
