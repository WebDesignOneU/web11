// src/server.js
// Punto de entrada de la API (npm start / npm run dev)
require('dotenv').config();
const app = require('./app'); // requiere src/config/db.js, que valida la conexión a MySQL

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

// La documentación Swagger (/api-docs) se monta en app.js y solo se activa
// fuera de producción: expone el detalle de los endpoints y no debería quedar
// pública en un entorno real.
app.listen(PORT, () => {
    console.log(`[Server] API Ballet UCB corriendo en http://localhost:${PORT} (${NODE_ENV})`);
    if (NODE_ENV !== 'production') {
        console.log(`[Server] Documentación disponible en http://localhost:${PORT}/api-docs`);
    }
});
