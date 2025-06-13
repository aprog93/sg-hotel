"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateReservaTipoQuery = exports.validateReservaTipoBody = exports.validateReservaExists = exports.validateHabitacionReserva = exports.validateClienteReservaDuplicada = void 0;
var habitacionModel = _interopRequireWildcard(require("../modules/habitacion/habitacion.model.js"));
var piscinaModel = _interopRequireWildcard(require("../modules/piscina/piscina.model.js"));
var restauranteModel = _interopRequireWildcard(require("../modules/restaurante/restaurante.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Determina qué modelo usar según el tipo de reserva
const getReservaModel = tipo => {
  switch (tipo) {
    case "habitacion":
      return habitacionModel;
    case "piscina":
      return piscinaModel;
    case "restaurante":
      return restauranteModel;
    default:
      return null;
  }
};

// Obtiene el nombre del campo de fecha según el tipo de reserva
function getReservaFechaCampoPorTipo(tipo) {
  switch (tipo) {
    case "habitacion":
      return "fecha_inicio";
    case "piscina":
    case "restaurante":
      return "fecha";
    default:
      return "fecha";
  }
}

// Convierte fecha a YYYY-MM-DD o null si inválido
function toIsoDateOnly(fechaStr) {
  if (!fechaStr) return null;
  const d = new Date(fechaStr);
  return isNaN(d.getTime()) ? null : d.toISOString().split("T");
}

// Valida tipo de reserva en la query: ?tipo=habitacion|piscina|restaurante
const validateReservaTipoQuery = (req, res, next) => {
  const {
    tipo
  } = req.query;
  const model = getReservaModel(tipo);
  if (!tipo || !model) {
    return res.status(400).json({
      error: "Tipo de reserva inválido o no especificado"
    });
  }
  req.reservaTipo = tipo;
  next();
};

// Valida tipo de reserva en el body: { tipo: ... }
exports.validateReservaTipoQuery = validateReservaTipoQuery;
const validateReservaTipoBody = (req, res, next) => {
  const {
    tipo
  } = req.body;
  const model = getReservaModel(tipo);
  if (!tipo || !model) {
    return res.status(400).json({
      error: "Tipo de reserva inválido o no especificado"
    });
  }
  req.reservaTipo = tipo;
  next();
};

// Verifica que el cliente no tenga una reserva duplicada para esa fecha y tipo
exports.validateReservaTipoBody = validateReservaTipoBody;
const validateClienteReservaDuplicada = async (req, res, next) => {
  try {
    const {
      tipo,
      cliente_id
    } = req.body;
    const model = getReservaModel(tipo);
    if (!model) {
      return res.status(400).json({
        error: "Tipo de reserva inválido."
      });
    }
    const campoFecha = getReservaFechaCampoPorTipo(tipo);
    const fechaNuevaReserva = toIsoDateOnly(req.body[campoFecha]);
    if (!fechaNuevaReserva) {
      return res.status(400).json({
        error: `La fecha de la reserva es inválida o faltante para el tipo "${tipo}"`
      });
    }
    const reservasCliente = await model.getByCliente(cliente_id);
    const reservaExistente = reservasCliente.some(r => {
      const fechaExistente = toIsoDateOnly(r[campoFecha]);
      return fechaExistente && fechaExistente === fechaNuevaReserva;
    });
    if (reservaExistente) {
      return res.status(400).json({
        error: `El cliente ya tiene una reserva de ${tipo} para esta fecha`
      });
    }
    next();
  } catch (error) {
    console.error("Error validando reserva duplicada:", error);
    res.status(500).json({
      error: "Error al validar reserva duplicada"
    });
  }
};

// Verifica que la reserva existe antes de actualizar/eliminar
exports.validateClienteReservaDuplicada = validateClienteReservaDuplicada;
const validateReservaExists = async (req, res, next) => {
  try {
    const {
      reserva_id
    } = req.params;
    const {
      reservaTipo
    } = req;
    const model = getReservaModel(reservaTipo);
    if (!model) {
      return res.status(400).json({
        error: "Tipo de reserva inválido."
      });
    }
    const reserva = await model.getById(reserva_id);
    if (!reserva) {
      return res.status(404).json({
        error: `La reserva de ${reservaTipo} con ID ${reserva_id} no existe`
      });
    }
    req.reserva = reserva;
    next();
  } catch (error) {
    console.error("Error validando existencia de reserva:", error);
    res.status(500).json({
      error: "Error al validar la reserva"
    });
  }
};

// Específico para reservas de habitación (para pagar/checkin)
exports.validateReservaExists = validateReservaExists;
const validateHabitacionReserva = async (req, res, next) => {
  try {
    const {
      reserva_id
    } = req.params;
    const reserva = await habitacionModel.getById(reserva_id);
    if (!reserva) {
      return res.status(404).json({
        error: `La reserva de habitación con ID ${reserva_id} no existe`
      });
    }
    if (reserva.estado === "checkin") {
      return res.status(400).json({
        error: `La reserva ya tiene estado de check-in`
      });
    }
    req.reserva = reserva;
    next();
  } catch (error) {
    console.error("Error validando reserva de habitación:", error);
    res.status(500).json({
      error: "Error al validar la reserva de habitación"
    });
  }
};
exports.validateHabitacionReserva = validateHabitacionReserva;