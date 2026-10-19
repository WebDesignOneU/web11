// src/middlewares/auth.middleware.js
// Middlewares de autenticación (JWT) y autorización por rol.
const jwt = require('jsonwebtoken');

// Exige token JWT válido en el header "Authorization: Bearer <token>"
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Acceso denegado, token no proporcionado' });
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, email, rol }
        next();
    } catch (error) {
        res.status(403).json({ success: false, message: 'Token inválido o expirado' });
    }
}

// Debe usarse después de authenticateToken: restringe por rol.
// Ej: authorizeRoles('admin', 'director')
function authorizeRoles(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Autenticación requerida' });
        }
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ success: false, message: 'No tienes permisos para realizar esta operación' });
        }
        next();
    };
}

// Adjunta req.user si hay token; si no lo hay (o es inválido) continúa como invitado.
// Útil para endpoints públicos que se enriquecen con datos del usuario logueado.
function optionalAuth(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            req.user = null;
        }
    }
    next();
}

module.exports = { authenticateToken, authorizeRoles, optionalAuth };
