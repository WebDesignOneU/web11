// src/services/convocatoria.service.js
// Convocatorias de audiciones (tabla "convocatorias").
const db = require('../config/db');
const Convocatoria = require('../models/convocatoria.entity');

const SELECT_CONVOCATORIA = `
    SELECT c.*, (SELECT COUNT(*) FROM postulaciones p WHERE p.id_convocatoria = c.id_convocatoria) AS total_postulaciones
    FROM convocatorias c`;

class ConvocatoriaService {
    static async getAll({ estado } = {}) {
        const condiciones = [];
        const parametros = [];
        if (estado) {
            condiciones.push('c.estado = ?');
            parametros.push(estado);
        }
        const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

        const [filas] = await db.query(
            `${SELECT_CONVOCATORIA} ${where} ORDER BY c.fecha_inicio DESC`,
            parametros
        );
        return filas.map((fila) => new Convocatoria(fila));
    }

    static async getById(id) {
        const [filas] = await db.query(`${SELECT_CONVOCATORIA} WHERE c.id_convocatoria = ? LIMIT 1`, [id]);
        if (filas.length === 0) return null;
        return new Convocatoria(filas[0]);
    }

    static async create({ titulo, fecha_inicio, fecha_fin, requisitos = null, estado = 'abierta' }) {
        const [resultado] = await db.query(
            'INSERT INTO convocatorias (titulo, fecha_inicio, fecha_fin, requisitos, estado) VALUES (?, ?, ?, ?, ?)',
            [titulo.trim(), fecha_inicio, fecha_fin, requisitos, estado]
        );
        return await this.getById(resultado.insertId);
    }

    static async update(id, datos) {
        const convocatoria = await this.getById(id);
        if (!convocatoria) return null;

        const campos = [];
        const valores = [];
        for (const columna of ['titulo', 'fecha_inicio', 'fecha_fin', 'requisitos', 'estado']) {
            if (datos[columna] !== undefined) {
                campos.push(`${columna} = ?`);
                valores.push(typeof datos[columna] === 'string' ? datos[columna].trim() : datos[columna]);
            }
        }
        if (campos.length > 0) {
            await db.query(`UPDATE convocatorias SET ${campos.join(', ')} WHERE id_convocatoria = ?`, [...valores, id]);
        }
        return await this.getById(id);
    }

    static async remove(id) {
        const [resultado] = await db.query('DELETE FROM convocatorias WHERE id_convocatoria = ?', [id]);
        return resultado.affectedRows > 0;
    }
}

module.exports = ConvocatoriaService;
