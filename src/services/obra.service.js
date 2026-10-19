// src/services/obra.service.js
// CRUD de obras (tabla "obras"), con sus funciones asociadas.
const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const Obra = require('../models/obra.entity');
const Funcion = require('../models/funcion.entity');

class ObraService {
    static async getAll() {
        const [filas] = await db.query('SELECT * FROM obras ORDER BY titulo ASC');
        return filas.map((fila) => new Obra(fila));
    }

    // Incluye las funciones programadas de la obra
    static async getById(id) {
        const [filas] = await db.query('SELECT * FROM obras WHERE id_obra = ? LIMIT 1', [id]);
        if (filas.length === 0) return null;

        const [funciones] = await db.query(
            `SELECT f.*, o.titulo AS obra_titulo
             FROM funciones f
             INNER JOIN obras o ON o.id_obra = f.id_obra
             WHERE f.id_obra = ? AND f.estado = 'programada'
             ORDER BY f.fecha_hora ASC`,
            [id]
        );
        return new Obra({ ...filas[0], funciones: funciones.map((fila) => new Funcion(fila)) });
    }

    static async create({ titulo, descripcion = null, director = null, imagen_banner = null }) {
        const [resultado] = await db.query(
            'INSERT INTO obras (titulo, descripcion, director, imagen_banner) VALUES (?, ?, ?, ?)',
            [titulo.trim(), descripcion, director ? director.trim() : null, imagen_banner]
        );
        return await this.getById(resultado.insertId);
    }

    static async update(id, datos) {
        const obra = await this.getById(id);
        if (!obra) return null;

        const campos = [];
        const valores = [];
        for (const columna of ['titulo', 'descripcion', 'director', 'imagen_banner']) {
            if (datos[columna] !== undefined) {
                campos.push(`${columna} = ?`);
                valores.push(typeof datos[columna] === 'string' ? datos[columna].trim() : datos[columna]);
            }
        }
        if (campos.length > 0) {
            await db.query(`UPDATE obras SET ${campos.join(', ')} WHERE id_obra = ?`, [...valores, id]);
        }
        return await this.getById(id);
    }

    static async remove(id) {
        // Las funciones hijas se eliminan en cascada (ON DELETE CASCADE)
        const [resultado] = await db.query('DELETE FROM obras WHERE id_obra = ?', [id]);
        return resultado.affectedRows > 0;
    }
}

module.exports = ObraService;
