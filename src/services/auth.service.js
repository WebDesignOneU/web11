// src/services/auth.service.js
// Autenticación contra la tabla "usuarios" (bcrypt + JWT).
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const Usuario = require('../models/usuario.entity');

class AuthService {
    // Auto-registro público: solo roles 'espectador' y 'postulante'
    static async register({ email, password, rol = 'espectador' }) {
        try {
            const passwordHash = await bcrypt.hash(password, 10);
            const [resultado] = await db.query(
                'INSERT INTO usuarios (email, password_hash, rol) VALUES (?, ?, ?)',
                [email.trim().toLowerCase(), passwordHash, rol]
            );
            return await this.getPerfil(resultado.insertId);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ApiError(409, 'El email ya está registrado');
            }
            throw error;
        }
    }

    // Inicio de sesión: valida credenciales y estado de la cuenta
    static async login({ email, password }) {
        const [filas] = await db.query('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [
            email.trim().toLowerCase()
        ]);
        if (filas.length === 0) {
            throw new ApiError(401, 'Credenciales incorrectas');
        }

        const usuario = new Usuario(filas[0]);
        const coincide = await bcrypt.compare(password, usuario.password_hash);
        if (!coincide) {
            throw new ApiError(401, 'Credenciales incorrectas');
        }
        if (usuario.estado !== 'activo') {
            throw new ApiError(403, `La cuenta está ${usuario.estado}. Contacta al administrador`);
        }

        // Registro del último acceso
        await db.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id_usuario = ?', [usuario.id_usuario]);

        const token = jwt.sign(
            { id: usuario.id_usuario, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        return {
            token,
            usuario: { id: usuario.id_usuario, email: usuario.email, rol: usuario.rol }
        };
    }

    // Perfil del usuario autenticado
    static async getPerfil(idUsuario) {
        const [filas] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ? LIMIT 1', [idUsuario]);
        if (filas.length === 0) return null;
        return new Usuario(filas[0]);
    }
}

module.exports = AuthService;
