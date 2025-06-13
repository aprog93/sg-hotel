"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateReservacion = exports.pagarReservacion = exports.hacerCheckout = exports.hacerCheckin = exports.getReservacionById = exports.getAllReservacion = exports.deleteReservacion = exports.createReservacion = exports.cancelarReservacion = void 0;
var Reserva = _interopRequireWildcard(require("./habitaciones.model.js"));
var Habitacion = _interopRequireWildcard(require("../habitacion/habitacion.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Buscar todas las reservaciones
const getAllReservacion = async (req, res) => {
  try {
    const reservas = await Reserva.getAllReservacion();
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    res.status(500).json({
      error: "Error al obtener reservas"
    });
  }
};

// Buscar reservación por ID
exports.getAllReservacion = getAllReservacion;
const getReservacionById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const reserva = await Reserva.getReservacionById(id);
    if (reserva) {
      res.json(reserva);
    } else {
      res.status(404).json({
        message: "Reserva no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al obtener reserva:", error);
    res.status(500).json({
      error: "Error al obtener la reserva"
    });
  }
};

// Crear reserva y actualizar habitación a "reservada"
exports.getReservacionById = getReservacionById;
const createReservacion = async (req, res) => {
  try {
    const reservaData = req.body;
    // Prevención de doble ocupación/reserva
    const habitacion = await Habitacion.getHabitacionById(reservaData.habitacion_id);
    if (!habitacion) {
      return res.status(404).json({
        message: "Habitación no encontrada"
      });
    }
    if (habitacion.estado !== "disponible") {
      return res.status(400).json({
        message: "La habitación no está disponible para reservar."
      });
    }
    const reservaId = await Reserva.createReservacion(reservaData);
    if (reservaId) {
      await Habitacion.updateEstadoHabitacion(reservaData.habitacion_id, "ocupada");
      // Auditoría opcional:
      // await Auditoria.registrar("creacion_reserva", { reservaId, user: req.user.id });

      res.status(201).json({
        id: reservaId,
        message: "Reserva creada exitosamente"
      });
    }
  } catch (error) {
    console.error("Error al crear reserva:", error);
    res.status(500).json({
      error: "Error al crear la reserva"
    });
  }
};

// Checkin: cambia estado reserva y habitación
exports.createReservacion = createReservacion;
const hacerCheckin = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const reserva = await Reserva.getReservacionById(id);
    if (!reserva) return res.status(404).json({
      message: "Reserva no encontrada"
    });
    if (reserva.estado !== "reservada") {
      return res.status(400).json({
        message: "Solo reservas en estado 'reservada' pueden hacer check-in"
      });
    }
    const successReserva = await Reserva.updateReservacionEstado(id, "checkin");
    const successHabitacion = await Habitacion.updateEstadoHabitacion(reserva.habitacion_id, "ocupada");
    if (successReserva && successHabitacion) {
      // Auditoría opcional:
      // await Auditoria.registrar("checkin", { reservaId: id, user: req.user.id });

      return res.json({
        message: "Check-in realizado correctamente"
      });
    }
    res.status(500).json({
      error: "Falló el proceso de check-in"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error procesando check-in"
    });
  }
};

// Checkout: cambia estado reserva y habitación
exports.hacerCheckin = hacerCheckin;
const hacerCheckout = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const reserva = await Reserva.getReservacionById(id);
    if (!reserva) return res.status(404).json({
      message: "Reserva no encontrada"
    });
    if (reserva.estado !== "checkin") {
      return res.status(400).json({
        message: "Solo reservas en estado 'checkin' pueden hacer check-out"
      });
    }
    const successReserva = await Reserva.updateReservacionEstado(id, "checkout");
    const successHabitacion = await Habitacion.updateEstadoHabitacion(reserva.habitacion_id, "disponible");
    if (successReserva && successHabitacion) {
      // Auditoría opcional:
      // await Auditoria.registrar("checkout", { reservaId: id, user: req.user.id });

      return res.json({
        message: "Check-out realizado correctamente"
      });
    }
    res.status(500).json({
      error: "Falló el proceso de check-out"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error procesando check-out"
    });
  }
};

// Cancelar reserva y poner habitación disponible
exports.hacerCheckout = hacerCheckout;
const cancelarReservacion = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const reserva = await Reserva.getReservacionById(id);
    if (!reserva) return res.status(404).json({
      message: "Reserva no encontrada"
    });
    if (!["reservada", "checkin"].includes(reserva.estado)) {
      return res.status(400).json({
        message: "Solo reservas en estado 'reservada' o 'checkin' pueden ser canceladas"
      });
    }
    const successReserva = await Reserva.cancelarReservacion(id);
    const successHabitacion = await Habitacion.updateEstadoHabitacion(reserva.habitacion_id, "disponible");
    if (successReserva && successHabitacion) {
      // Auditoría opcional:
      // await Auditoria.registrar("cancelacion", { reservaId: id, user: req.user.id });

      return res.json({
        message: "Reserva cancelada y habitación liberada correctamente"
      });
    }
    res.status(500).json({
      error: "Falló el proceso de cancelación"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error procesando la cancelación"
    });
  }
};

// Eliminar una reservacion y poner habitación disponible
exports.cancelarReservacion = cancelarReservacion;
const deleteReservacion = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const reserva = await Reserva.getReservacionById(id);
    const deleted = await Reserva.deleteReservacion(id);
    if (deleted && reserva) {
      await Habitacion.updateEstadoHabitacion(reserva.habitacion_id, "disponible");
      // Auditoría opcional:
      // await Auditoria.registrar("borrado", { reservaId: id, user: req.user.id });

      res.status(200).json({
        message: "Reserva eliminada y habitación liberada exitosamente",
        id
      });
    } else {
      res.status(404).json({
        message: "Reserva no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    res.status(500).json({
      error: "Error al eliminar la reserva"
    });
  }
};

// Actualizar una reservación (sin cambiar estado de habitación automáticamente)
exports.deleteReservacion = deleteReservacion;
const updateReservacion = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const updateData = req.body;
    const updated = await Reserva.updateReservacion(id, updateData);
    if (updated) {
      res.status(200).json({
        message: "Reserva actualizada exitosamente"
      });
    } else {
      res.status(404).json({
        message: "Reserva no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al actualizar reserva:", error);
    res.status(500).json({
      error: "Error al actualizar la reserva"
    });
  }
};

// Pagar reservación de habitación (si tu lógica incluye pagos separados del checkin)
exports.updateReservacion = updateReservacion;
const pagarReservacion = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const reserva = await Reserva.getReservacionById(id);
    if (!reserva) {
      return res.status(404).json({
        message: "Reserva no encontrada"
      });
    }

    // Esto puede ser más robusto, por ejemplo, sólo permitir pago si estado === 'reservada'
    const success = await Reserva.updateReservacionEstado(id, "checkin");
    if (success) {
      // Auditoría opcional:
      // await Auditoria.registrar("pago", { reservaId: id, user: req.user.id });
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
exports.pagarReservacion = pagarReservacion;