"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateReservaPiscina = exports.pagarReservaPiscina = exports.getReservaPiscinaById = exports.getAllReservaPiscina = exports.deleteReservaPiscina = exports.createReservaPiscina = void 0;
var ReservaPiscina = _interopRequireWildcard(require("./piscina.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Obtener todas las reservas de piscina
const getAllReservaPiscina = async (req, res) => {
  try {
    const reservas = await ReservaPiscina.getAllReservaPiscina();
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas de piscina:", error);
    res.status(500).json({
      error: "Error al obtener reservas de piscina"
    });
  }
};

// Obtener una reserva de piscina por id
exports.getAllReservaPiscina = getAllReservaPiscina;
const getReservaPiscinaById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const reserva = await ReservaPiscina.getReservaPiscinaById(id);
    if (reserva) {
      res.json(reserva);
    } else {
      res.status(404).json({
        message: "Reserva de piscina no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al obtener reserva de piscina:", error);
    res.status(500).json({
      error: "Error al obtener la reserva de piscina"
    });
  }
};

// Crear una reserva de piscina
exports.getReservaPiscinaById = getReservaPiscinaById;
const createReservaPiscina = async (req, res) => {
  try {
    // Extraer todos los campos enviados por el frontend
    const {
      cliente_id,
      horario_id,
      fecha,
      estado = "reservada",
      total,
      metodo_pago,
      numero_personas
    } = req.body;
    const reservaData = {
      cliente_id,
      horario_id,
      fecha,
      estado,
      total,
      metodo_pago,
      numero_personas
    };
    const reservaId = await ReservaPiscina.createReservaPiscina(reservaData);
    res.status(201).json({
      id: reservaId,
      message: "Reserva de piscina creada exitosamente"
    });
  } catch (error) {
    console.error("Error al crear reserva de piscina:", error);
    res.status(500).json({
      error: error.message || "Error al crear la reserva de piscina"
    });
  }
};

// Actualizar una reserva de piscina
exports.createReservaPiscina = createReservaPiscina;
const updateReservaPiscina = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const updateData = req.body;
    const updated = await ReservaPiscina.updateReservaPiscina(id, updateData);
    if (updated) {
      res.status(200).json({
        message: "Reserva de piscina actualizada exitosamente"
      });
    } else {
      res.status(404).json({
        message: "Reserva de piscina no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al actualizar reserva de piscina:", error);
    res.status(500).json({
      error: "Error al actualizar la reserva de piscina"
    });
  }
};

// Eliminar una reserva de piscina
exports.updateReservaPiscina = updateReservaPiscina;
const deleteReservaPiscina = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const deleted = await ReservaPiscina.deleteReservaPiscina(id);
    if (deleted) {
      res.status(200).json({
        message: "Reserva de piscina eliminada exitosamente",
        id
      });
    } else {
      res.status(404).json({
        message: "Reserva de piscina no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al eliminar reserva de piscina:", error);
    res.status(500).json({
      error: "Error al eliminar la reserva de piscina"
    });
  }
};

// Pagar reservación de piscina
exports.deleteReservaPiscina = deleteReservaPiscina;
const pagarReservaPiscina = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    // Primero verifica que existe la reserva
    const reserva = await ReservaPiscina.getReservaPiscinaById(id);
    if (!reserva) {
      return res.status(404).json({
        message: "Reserva no encontrada"
      });
    }

    // Actualiza el estado a pagada/finalizada
    const success = await ReservaPiscina.pagarReservaPiscina(id);
    if (success) {
      res.json({
        message: "Pago registrado correctamente"
      });
    } else {
      res.status(500).json({
        error: "No se pudo registrar el pago"
      });
    }
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    res.status(500).json({
      error: "Error al procesar el pago"
    });
  }
};
exports.pagarReservaPiscina = pagarReservaPiscina;