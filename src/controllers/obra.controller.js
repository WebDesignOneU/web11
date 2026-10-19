// src/controllers/obra.controller.js
const ObraService = require('../services/obra.service');
const ObraDTO = require('../dto/obra.dto');
const FuncionDTO = require('../dto/funcion.dto');
const { manejarError } = require('../utils/response');
const val = require('../utils/validators');

// GET /api/obras
exports.getAll = async (req, res) => {
    try {
        const obras = await ObraService.getAll();
        res.json({ success: true, data: obras.map((obra) => new ObraDTO(obra)) });
    } catch (error) {
        manejarError(res, error);
    }
};

// GET /api/obras/:id
exports.getById = async (req, res) => {
    try {
        const obra = await ObraService.getById(req.params.id);
        if (!obra) return res.status(404).json({ success: false, message: 'Obra no encontrada' });
        res.json({ success: true, data: new ObraDTO({ ...obra, funciones: obra.funciones.map((f) => new FuncionDTO(f)) }) });
    } catch (error) {
        manejarError(res, error);
    }
};

// POST /api/obras (admin/director)
exports.create = async (req, res) => {
    const { titulo, descripcion, director, imagen_banner } = req.body || {};
    const errores = [];
    if (!val.esTexto(titulo, 2, 150)) errores.push({ campo: 'titulo', mensaje: 'El título debe tener entre 2 y 150 caracteres' });
    if (descripcion !== undefined && descripcion !== null && typeof descripcion !== 'string') {
        errores.push({ campo: 'descripcion', mensaje: 'La descripción debe ser texto' });
    }
    if (director !== undefined && director !== null && !val.esTexto(director, 2, 100)) {
        errores.push({ campo: 'director', mensaje: 'El director debe tener entre 2 y 100 caracteres' });
    }
    if (imagen_banner !== undefined && imagen_banner !== null && !val.esUrlOPerfil(imagen_banner)) {
        errores.push({ campo: 'imagen_banner', mensaje: 'El banner debe ser una URL válida o una ruta local (/images/...)' });
    }
    if (errores.length) {
        return res.status(400).json({ success: false, message: 'Datos de entrada inválidos', errors: errores });
    }

    try {
        const obra = await ObraService.create({ titulo, descripcion: descripcion || null, director: director || null, imagen_banner: imagen_banner || null });
        res.status(201).json({ success: true, message: 'Obra creada correctamente', data: new ObraDTO(obra) });
    } catch (error) {
        manejarError(res, error, 'Error al crear la obra');
    }
};

// PUT /api/obras/:id (admin/director)
exports.update = async (req, res) => {
    const { titulo, descripcion, director, imagen_banner } = req.body || {};
    const errores = [];
    if (titulo !== undefined && !val.esTexto(titulo, 2, 150)) errores.push({ campo: 'titulo', mensaje: 'El título debe tener entre 2 y 150 caracteres' });
    if (descripcion !== undefined && descripcion !== null && typeof descripcion !== 'string') {
        errores.push({ campo: 'descripcion', mensaje: 'La descripción debe ser texto' });
    }
    if (director !== undefined && director !== null && !val.esTexto(director, 2, 100)) {
        errores.push({ campo: 'director', mensaje: 'El director debe tener entre 2 y 100 caracteres' });
    }
    if (imagen_banner !== undefined && imagen_banner !== null && !val.esUrlOPerfil(imagen_banner)) {
        errores.push({ campo: 'imagen_banner', mensaje: 'El banner debe ser una URL válida o una ruta local (/images/...)' });
    }
    if (errores.length) {
        return res.status(400).json({ success: false, message: 'Datos de entrada inválidos', errors: errores });
    }

    try {
        const obra = await ObraService.update(req.params.id, { titulo, descripcion, director, imagen_banner });
        if (!obra) return res.status(404).json({ success: false, message: 'Obra no encontrada' });
        res.json({ success: true, message: 'Obra actualizada correctamente', data: new ObraDTO(obra) });
    } catch (error) {
        manejarError(res, error, 'Error al actualizar la obra');
    }
};

// DELETE /api/obras/:id (admin)
exports.remove = async (req, res) => {
    try {
        const eliminada = await ObraService.remove(req.params.id);
        if (!eliminada) return res.status(404).json({ success: false, message: 'Obra no encontrada' });
        res.json({ success: true, message: 'Obra eliminada correctamente (sus funciones se eliminaron en cascada)' });
    } catch (error) {
        manejarError(res, error, 'Error al eliminar la obra');
    }
};
