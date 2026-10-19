// src/utils/validators.js
// Validaciones manuales de entrada con la librería "validator" (declarada en
// package.json), sin agregados externos. Cada función devuelve true/false y los
// controladores acumulan los mensajes para responder 400.
const validator = require('validator');

// ---------------------------------------------------------------
// Catálogos ENUM espejo del esquema sql/ballet_ucb_db_schema.sql
// ---------------------------------------------------------------
const ROLES_USUARIO = ['admin', 'director', 'bailarin', 'postulante', 'espectador'];
const ROLES_AUTOREGISTRO = ['espectador', 'postulante']; // auto-registro público
const ESTADOS_USUARIO = ['activo', 'inactivo', 'bloqueado'];
const ESTADOS_FUNCION = ['programada', 'agotada', 'cancelada', 'finalizada'];
const ESTADOS_RESERVA = ['confirmada', 'asistio', 'cancelada'];
const ESTADOS_CONVOCATORIA = ['abierta', 'cerrada'];
const ESTADOS_POSTULACION = ['pendiente', 'preseleccionado', 'aceptado', 'rechazado'];
const ROLES_ELENCO = ['solista', 'cuerpo_de_ballet', 'director', 'maestro'];

// ---------------------------------------------------------------
// Validadores genéricos
// ---------------------------------------------------------------
const esTexto = (valor, min = 1, max = Infinity) =>
    typeof valor === 'string' && valor.trim().length >= min && valor.trim().length <= max;

const esEntero = (valor, min = 1, max = Infinity) => {
    if (valor === null || valor === undefined || String(valor).trim() === '') return false;
    const numero = Number(valor);
    return Number.isInteger(numero) && numero >= min && numero <= max;
};

const esDecimalPositivo = (valor) => {
    const numero = Number(valor);
    return !Number.isNaN(numero) && numero > 0;
};

const esBooleano = (valor) => typeof valor === 'boolean';

const esEmail = (valor) =>
    typeof valor === 'string' && validator.isEmail(valor.trim(), { allow_utf8_local_part: false });

// Acepta 'YYYY-MM-DD HH:mm:ss' o ISO completo
const esFechaHora = (valor) =>
    typeof valor === 'string' && validator.isISO8601(valor.trim().replace(' ', 'T'));

// Acepta 'YYYY-MM-DD'
const esFecha = (valor) =>
    typeof valor === 'string' && validator.isISO8601(valor.trim(), { strict: true });

const esTelefono = (valor) => typeof valor === 'string' && /^\+?[\d\s-]{5,20}$/.test(valor.trim());

// Carnet de identidad boliviano: dígitos + código del departamento (ej. "6849302 LP")
const esCI = (valor) => typeof valor === 'string' && /^[\d]{5,12}(\s?[A-Za-z]{1,3})?$/.test(valor.trim());

// URL con protocolo o ruta local tipo "/images/obras/banner.jpg"
const esUrlOPerfil = (valor) =>
    typeof valor === 'string' && (valor.trim().startsWith('/') || esUrl(valor));

const esUrl = (valor) => typeof valor === 'string' && validator.isURL(valor.trim(), { require_protocol: true });

const esSlug = (valor) => typeof valor === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(valor);

const esEnum = (valor, permitidos) => permitidos.includes(valor);

const esPassword = (valor) => typeof valor === 'string' && valor.length >= 6;

module.exports = {
    ROLES_USUARIO,
    ROLES_AUTOREGISTRO,
    ESTADOS_USUARIO,
    ESTADOS_FUNCION,
    ESTADOS_RESERVA,
    ESTADOS_CONVOCATORIA,
    ESTADOS_POSTULACION,
    ROLES_ELENCO,
    esTexto,
    esEntero,
    esDecimalPositivo,
    esBooleano,
    esEmail,
    esFechaHora,
    esFecha,
    esTelefono,
    esCI,
    esUrlOPerfil,
    esUrl,
    esSlug,
    esEnum,
    esPassword
};
