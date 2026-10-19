// src/services/funcion.service.js
// Funciones (representaciones) de las obras. Los cupos se gestionan mediante
// triggers (reservas) y el procedimiento sp_registrar_reserva.
const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const Funcion = require('../models/funcion.entity');

class FuncionService {
    // Listado con filtros opcionales por estado y obra
    static async getAll({ estado, id_obra } = {}) {
        const condiciones = [];
        const parametros = [];
        if (estado) {
            condiciones.push('f.estado = ?');
            parametros.push(estado);
        }
        if (id_obra) {
            condiciones.push('f.id_obra = ?');
            parametros.push(id_obra);
        }
        const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

        const [filas] = await db.query(
            `SELECT f.*, o.titulo AS obra_titulo
             FROM funciones f
             INNER JOIN obras o ON o.id_obra = f.id_obra
             ${where}
             ORDER BY f.fecha_hora ASC`,
            parametros
        );
        return filas.map((fila) => new Funcion(fila));
    }

    static async getById(id) {
        const [filas] = await db.query(
            `SELECT f.*, o.titulo AS obra_titulo
             FROM funciones f
             INNER JOIN obras o ON o.id_obra = f.id_obra
             WHERE f.id_funcion = ? LIMIT 1`,
            [id]
        );
        if (filas.length === 0) return null;
        return new Funcion(filas[0]);
    }

    // Al crear, los asientos disponibles parten de la capacidad total
    static async create({ id_obra, fecha_hora, lugar = 'Auditorio UCB', capacidad_total, estado = 'programada' }) {
        // Validar que la obra exista
        const [obras] = await db.query('SELECT id_obra FROM obras WHERE id_obra = ? LIMIT 1', [id_obra]);
        if (obras.length === 0) throw new ApiError(404, 'La obra indicada no existe');

        const [resultado] = await db.query(
            `INSERT INTO funciones (id_obra, fecha_hora, lugar, capacidad_total, asientos_disponibles, estado)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id_obra, fecha_hora, lugar.trim(), capacidad_total, capacidad_total, estado]
        );
        return await this.getById(resultado.insertId);
    }

    static async update(id, datos) {
        const funcion = await this.getById(id);
        if (!funcion) return null;

        const campos = [];
        const valores = [];
        const mapa = {
            fecha_hora: 'fecha_hora',
            lugar: 'lugar',
            capacidad_total: 'capacidad_total',
            estado: 'estado'
        };
        Object.entries(mapa).forEach(([origen, destino]) => {
            if (datos[origen] !== undefined) {
                campos.push(`${destino} = ?`);
                valores.push(typeof datos[origen] === 'string' ? datos[origen].trim() : datos[origen]);
            }
        });

        if (campos.length > 0) {
            await db.query(`UPDATE funciones SET ${campos.join(', ')} WHERE id_funcion = ?`, [...valores, id]);
        }
        return await this.getById(id);
    }

    static async remove(id) {
        const [reservas] = await db.query(
            "SELECT COUNT(*) AS total FROM reservas WHERE id_funcion = ? AND estado_reserva <> 'cancelada'",
            [id]
        );
        if (reservas[0].total > 0) {
            throw new ApiError(409, 'No se puede eliminar la función: existen reservas asociadas');
        }
        const [resultado] = await db.query('DELETE FROM funciones WHERE id_funcion = ?', [id]);
        return resultado.affectedRows > 0;
    }

    // Reporte de ocupación generado por el procedimiento sp_reporte_ocupacion_funciones
    static async reporteOcupacion() {
        const [resultSets] = await db.query('CALL sp_reporte_ocupacion_funciones()');
        return resultSets[0]; // primer result set: filas del reporte
    }
}

module.exports = FuncionService;
