// src/controllers/auth.controller.js
const AuthService = require('../services/auth.service');
const UsuarioDTO = require('../dto/usuario.dto');
const { manejarError } = require('../utils/response');
const val = require('../utils/validators');

// POST /api/auth/register
exports.register = async (req, res) => {
    const { email, password, rol } = req.body || {};
    const errores = [];
    if (!val.esEmail(email)) errores.push({ campo: 'email', mensaje: 'El email es inválido' });
    if (!val.esPassword(password)) errores.push({ campo: 'password', mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    if (rol !== undefined && !val.esEnum(rol, val.ROLES_AUTOREGISTRO)) {
        errores.push({ campo: 'rol', mensaje: `El rol debe ser uno de: ${val.ROLES_AUTOREGISTRO.join(', ')}` });
    }
    if (errores.length) {
        return res.status(400).json({ success: false, message: 'Datos de entrada inválidos', errors: errores });
    }

    try {
        const usuario = await AuthService.register({ email, password, rol });
        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            data: new UsuarioDTO(usuario)
        });
    } catch (error) {
        manejarError(res, error, 'Error al registrar el usuario');
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body || {};
    const errores = [];
    if (!val.esEmail(email)) errores.push({ campo: 'email', mensaje: 'El email es inválido' });
    if (!val.esTexto(password, 6)) errores.push({ campo: 'password', mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    if (errores.length) {
        return res.status(400).json({ success: false, message: 'Datos de entrada inválidos', errors: errores });
    }

    try {
        const resultado = await AuthService.login({ email, password });
        res.json({ success: true, message: 'Inicio de sesión exitoso', data: resultado });
    } catch (error) {
        manejarError(res, error, 'Error al iniciar sesión');
    }
};

// GET /api/auth/perfil (requiere token)
exports.getPerfil = async (req, res) => {
    try {
        const usuario = await AuthService.getPerfil(req.user.id);
        if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        res.json({ success: true, data: new UsuarioDTO(usuario) });
    } catch (error) {
        manejarError(res, error);
    }
};
