"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReservasByCliente = exports.getAllReservasServicio = exports.createReservaServicio = exports.cancelarReservaServicio = void 0;
var ReservasModel = _interopRequireWildcard(require("./reservasServicios.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// controllers/reservasServicios.controller.js

// Crear una reserva de servicio
const createReservaServicio = async (req, res) => {
  try {
    const reservaData = req.body;

    // Validaciones básicas
    if (!reservaData.servicio_id || !reservaData.cliente_id || !reservaData.fecha || !reservaData.hora_inicio) {
      return res.status(400).json({
        error: "Faltan datos obligatorios para la reserva"
      });
    }

    // Verificar disponibilidad antes de crear la reserva
    const disponible = await ServiciosModel.verificarDisponibilidad(reservaData.servicio_id, reservaData.fecha, reservaData.hora_inicio, reservaData.hora_fin);
    if (!disponible) {
      return res.status(400).json({
        error: "El servicio no está disponible en el horario seleccionado"
      });
    }
    const reservaId = await ReservasModel.createReservaServicio(reservaData);
    res.status(201).json({
      id: reservaId,
      message: "Reserva de servicio creada exitosamente"
    });
  } catch (error) {
    console.error("Error al crear reserva de servicio:", error);
    res.status(500).json({
      error: error.message || "Error al crear la reserva de servicio"
    });
  }
};

// Obtener todas las reservas de servicios
exports.createReservaServicio = createReservaServicio;
const getAllReservasServicio = async (req, res) => {
  try {
    const reservas = await ReservasModel.getAllReservasServicio();
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas de servicios:", error);
    res.status(500).json({
      error: "Error al obtener reservas de servicios"
    });
  }
};

// Obtener reservas por cliente
exports.getAllReservasServicio = getAllReservasServicio;
const getReservasByCliente = async (req, res) => {
  try {
    const {
      clienteId
    } = req.params;
    const reservas = await ReservasModel.getReservasByCliente(clienteId);
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas por cliente:", error);
    res.status(500).json({
      error: "Error al obtener reservas para el cliente"
    });
  }
};

// Cancelar una reserva de servicio
exports.getReservasByCliente = getReservasByCliente;
const cancelarReservaServicio = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const canceled = await ReservasModel.cancelarReservaServicio(id);
    if (canceled) {
      res.status(200).json({
        message: "Reserva de servicio cancelada exitosamente"
      });
    } else {
      res.status(404).json({
        message: "Reserva de servicio no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al cancelar reserva de servicio:", error);
    res.status(500).json({
      error: "Error al cancelar la reserva de servicio"
    });
  }
};
exports.cancelarReservaServicio = cancelarReservaServicio;