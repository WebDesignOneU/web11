// src/controllers/convocatoria.controller.js
const ConvocatoriaService = require('../services/convocatoria.service');
const ConvocatoriaDTO = require('../dto/convocatoria.dto');
const { manejarError } = require('../utils/response');
const val = require('../utils/validators');

function validarCuerpo(body, { parcial = false } = {}) {
    const { titulo, fecha_inicio, fecha_fin, requisitos, estado } = body || {};
    const errores = [];
    if (!parcial || titulo !== undefined) {
        if (!val.esTexto(titulo, 5, 150)) errores.push({ campo: 'titulo', mensaje: 'El título debe tener entre 5 y 150 caracteres' });
    }
    if (!parcial || fecha_inicio !== undefined) {
        if (!val.esFecha(fecha_inicio)) errores.push({ campo: 'fecha_inicio', mensaje: 'fecha_inicio debe ser una fecha válida (YYYY-MM-DD)' });
    }
    if (!parcial || fecha_fin !== undefined) {
        if (!val.esFecha(fecha_fin)) errores.push({ campo: 'fecha_fin', mensaje: 'fecha_fin debe ser una fecha válida (YYYY-MM-DD)' });
    }
    if (
        fecha_inicio !== undefined &&
        fecha_fin !== undefined &&
        val.esFecha(fecha_inicio) &&
        val.esFecha(fecha_fin) &&
        fecha_fin < fecha_inicio
    ) {
        errores.push({ campo: 'fecha_fin', mensaje: 'fecha_fin no puede ser anterior a fecha_inicio' });
    }
    if (requisitos !== undefined && requisitos !== null && typeof requisitos !== 'string') {
        errores.push({ campo: 'requisitos', mensaje: 'Los requisitos deben ser texto' });
    }
    if (estado !== undefined && !val.esEnum(estado, val.ESTADOS_CONVOCATORIA)) {
        errores.push({ campo: 'estado', mensaje: `Estado inválido. Use: ${val.ESTADOS_CONVOCATORIA.join(', ')}` });
    }
    return errores;
}

// GET /api/convocatorias
exports.getAll = async (req, res) => {
    try {
        const { estado } = req.query;
        const errores = [];
        if (estado !== undefined && !val.esEnum(estado, val.ESTADOS_CONVOCATORIA)) {
            errores.push({ campo: 'estado', mensaje: `Estado inválido. Use: ${val.ESTADOS_CONVOCATORIA.join(', ')}` });
        }
        if (errores.length) {
            return res.status(400).json({ success: false, message: 'Datos de entrada inválidos', errors: errores });
        }

        const convocatorias = await ConvocatoriaService.getAll({ estado });
        res.json({ success: true, data: convocatorias.map((convocatoria) => new ConvocatoriaDTO(convocatoria)) });
    } catch (error) {
        manejarError(res, error);
    }
};

// GET /api/convocatorias/:id
exports.getById = async (req, res) => {
    try {
        const convocatoria = await ConvocatoriaService.getById(req.params.id);
        if (!convocatoria) return res.status(404).json({ success: false, message: 'Convocatoria no encontrada' });
        res.json({ success: true, data: new ConvocatoriaDTO(convocatoria) });
    } catch (error) {
        manejarError(res, error);
    }
};

// POST /api/convocatorias (admin/director)
exports.create = async (req, res) => {
    const errores = validarCuerpo(req.body);
    if (errores.length) {
        return res.status(400).json({ success: false, message: 'Datos de entrada inválidos', errors: errores });
    }

    const { titulo, fecha_inicio, fecha_fin, requisitos, estado } = req.body;
    try {
        const convocatoria = await ConvocatoriaService.create({
            titulo,
            fecha_inicio,
            fecha_fin,
            requisitos: requisitos || null,
            estado: estado || 'abierta'
        });
        res.status(201).json({ success: true, message: 'Convocatoria creada correctamente', data: new ConvocatoriaDTO(convocatoria) });
    } catch (error) {
        manejarError(res, error, 'Error al crear la convocatoria');
    }
};

// PUT /api/convocatorias/:id (admin/director)
exports.update = async (req, res) => {
    const errores = validarCuerpo(req.body, { parcial: true });
    if (errores.length) {
        return res.status(400).json({ success: false, message: 'Datos de entrada inválidos', errors: errores });
    }

    try {
        const convocatoria = await ConvocatoriaService.update(req.params.id, req.body);
        if (!convocatoria) return res.status(404).json({ success: false, message: 'Convocatoria no encontrada' });
        res.json({ success: true, message: 'Convocatoria actualizada correctamente', data: new ConvocatoriaDTO(convocatoria) });
    } catch (error) {
        manejarError(res, error, 'Error al actualizar la convocatoria');
    }
};

// DELETE /api/convocatorias/:id (admin)
exports.remove = async (req, res) => {
    try {
        const eliminada = await ConvocatoriaService.remove(req.params.id);
        if (!eliminada) return res.status(404).json({ success: false, message: 'Convocatoria no encontrada' });
        res.json({ success: true, message: 'Convocatoria eliminada correctamente' });
    } catch (error) {
        manejarError(res, error, 'Error al eliminar la convocatoria');
    }
};
