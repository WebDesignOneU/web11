// src/middlewares/param.middleware.js
// Valida que los parámetros numéricos de ruta (:id) sean enteros positivos,
// evitando que valores como "undefined" o "abc" lleguen a las consultas SQL.
function validarIdRuta(req, res, next) {
    const id = req.params.id;
    if (!/^\d+$/.test(id) || Number(id) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Datos de entrada inválidos',
            errors: [{ campo: 'id', mensaje: 'El id debe ser un número entero positivo' }]
        });
    }
    next();
}

module.exports = { validarIdRuta };
