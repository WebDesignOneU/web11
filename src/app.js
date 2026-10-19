// src/app.js
// Configuración de la aplicación Express: middlewares globales y rutas.
const express = require('express');
const cors = require('cors');

// Rutas por módulo del portal
const authRoutes = require('./routes/auth');
const noticiasRoutes = require('./routes/noticias');
const suscriptoresRoutes = require('./routes/suscriptores');
const obrasRoutes = require('./routes/obras');
const funcionesRoutes = require('./routes/funciones');
const reservasRoutes = require('./routes/reservas');
const convocatoriasRoutes = require('./routes/convocatorias');
const postulacionesRoutes = require('./routes/postulaciones');
const elencoRoutes = require('./routes/elenco');

const app = express();

app.use(cors());
app.use(express.json()); // parseo de JSON en el cuerpo de las peticiones

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API Ballet UCB operativa', fecha: new Date().toISOString() });
});

// Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/noticias', noticiasRoutes);
app.use('/api/suscriptores', suscriptoresRoutes);
app.use('/api/obras', obrasRoutes);
app.use('/api/funciones', funcionesRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/convocatorias', convocatoriasRoutes);
app.use('/api/postulaciones', postulacionesRoutes);
app.use('/api/elenco', elencoRoutes);

// 404: ruta no encontrada
// Nota: la documentación Swagger se monta antes del 404 (solo fuera de producción)
if (process.env.NODE_ENV !== 'production') {
    const swaggerUi = require('swagger-ui-express');
    const swaggerSpec = require('./config/swagger');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use((req, res) => {
    res.status(404).json({ success: false, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador global de errores (ej: JSON mal formado)
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ success: false, message: 'JSON inválido en el cuerpo de la petición' });
    }
    console.error('[API] Error no controlado:', err);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

module.exports = app;
