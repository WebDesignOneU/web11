// src/services/suscriptor.service.js
// Suscripciones al boletín de noticias (tabla "suscriptores").
const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const Suscriptor = require('../models/suscriptor.entity');

class SuscriptorService {
    // Alta de suscripción. Si el email ya existe se reactiva (estado 'activo').
    static async suscribir({ email, nombre = null }) {
        try {
            await db.query(
                `INSERT INTO suscriptores (email, nombre)
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE
                    nombre = COALESCE(VALUES(nombre), nombre),
                    estado = 'activo'`,
                [email.trim().toLowerCase(), nombre ? nombre.trim() : null]
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new ApiError(409, 'El email ya está suscrito');
            throw error;
        }

        const [filas] = await db.query('SELECT * FROM suscriptores WHERE email = ? LIMIT 1', [
            email.trim().toLowerCase()
        ]);
        return new Suscriptor(filas[0]);
    }

    // Baja de suscripción (estado 'desuscrito')
    static async desuscribir(email) {
        const correo = email.trim().toLowerCase();
        const [resultado] = await db.query(
            "UPDATE suscriptores SET estado = 'desuscrito' WHERE email = ? AND estado = 'activo'",
            [correo]
        );
        if (resultado.affectedRows === 0) {
            const [existe] = await db.query('SELECT * FROM suscriptores WHERE email = ? LIMIT 1', [correo]);
            if (existe.length === 0) throw new ApiError(404, 'El email no está suscrito');
            throw new ApiError(409, 'La suscripción ya estaba dada de baja');
        }
        const [filas] = await db.query('SELECT * FROM suscriptores WHERE email = ? LIMIT 1', [correo]);
        return new Suscriptor(filas[0]);
    }

    // Listado general (solo administración)
    static async getAll({ estado } = {}) {
        const condiciones = [];
        const parametros = [];
        if (estado) {
            condiciones.push('estado = ?');
            parametros.push(estado);
        }
        const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
        const [filas] = await db.query(`SELECT * FROM suscriptores ${where} ORDER BY fecha_suscripcion DESC`, parametros);
        return filas.map((fila) => new Suscriptor(fila));
    }
}

module.exports = SuscriptorService;
