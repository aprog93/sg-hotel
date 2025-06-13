"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateReservaRestaurante = exports.getReservasRestauranteByCliente = exports.getReservaRestauranteById = exports.getMesasDisponiblesRestaurante = exports.getAllReservaRestaurante = exports.deleteReservaRestaurante = exports.createReservaRestaurante = void 0;
var Restaurante = _interopRequireWildcard(require("./restaurante.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// controllers/reservaRestaurante.controller.js

// Listar todas las reservas de restaurante
const getAllReservaRestaurante = async (req, res) => {
  try {
    const reservas = await Restaurante.getAllReservaRestaurante();
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas de restaurante:", error);
    res.status(500).json({
      error: "Error al obtener reservas de restaurante"
    });
  }
};

// Obtener una reserva de restaurante por id
exports.getAllReservaRestaurante = getAllReservaRestaurante;
const getReservaRestauranteById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const reserva = await Restaurante.getReservaRestauranteById(id);
    if (reserva) {
      res.json(reserva);
    } else {
      res.status(404).json({
        message: "Reserva de restaurante no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al obtener reserva de restaurante:", error);
    res.status(500).json({
      error: "Error al obtener la reserva de restaurante"
    });
  }
};

// Crear una nueva reserva de restaurante
exports.getReservaRestauranteById = getReservaRestauranteById;
const createReservaRestaurante = async (req, res) => {
  try {
    const reservaData = req.body;
    const reservaId = await Restaurante.createReservaRestaurante(reservaData);
    res.status(201).json({
      id: reservaId,
      message: "Reserva de restaurante creada exitosamente"
    });
  } catch (error) {
    console.error("Error al crear reserva de restaurante:", error);
    res.status(500).json({
      error: error.message || "Error al crear la reserva de restaurante"
    });
  }
};

// Actualizar una reserva de restaurante
exports.createReservaRestaurante = createReservaRestaurante;
const updateReservaRestaurante = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const updateData = req.body;
    const updated = await Restaurante.updateReservaRestaurante(id, updateData);
    if (updated) {
      res.status(200).json({
        message: "Reserva de restaurante actualizada exitosamente"
      });
    } else {
      res.status(404).json({
        message: "Reserva de restaurante no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al actualizar reserva de restaurante:", error);
    res.status(500).json({
      error: "Error al actualizar la reserva de restaurante"
    });
  }
};

// Eliminar una reserva de restaurante
exports.updateReservaRestaurante = updateReservaRestaurante;
const deleteReservaRestaurante = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const deleted = await Restaurante.deleteReservaRestaurante(id);
    if (deleted) {
      res.status(200).json({
        message: "Reserva de restaurante eliminada exitosamente",
        id
      });
    } else {
      res.status(404).json({
        message: "Reserva de restaurante no encontrada"
      });
    }
  } catch (error) {
    console.error("Error al eliminar reserva de restaurante:", error);
    res.status(500).json({
      error: "Error al eliminar la reserva de restaurante"
    });
  }
};

// Obtener mesas disponibles dado un rango horario
exports.deleteReservaRestaurante = deleteReservaRestaurante;
const getMesasDisponiblesRestaurante = async (req, res) => {
  try {
    const {
      fecha,
      hora_inicio,
      hora_fin
    } = req.query;
    if (!fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({
        error: "Parámetros insuficientes"
      });
    }
    const mesas = await Restaurante.getMesasDisponibles(fecha, hora_inicio, hora_fin);
    res.json(mesas);
  } catch (error) {
    console.error("Error al obtener mesas disponibles del restaurante:", error);
    res.status(500).json({
      error: "Error al obtener mesas disponibles"
    });
  }
};

// Obtener reservas de restaurante por cliente
exports.getMesasDisponiblesRestaurante = getMesasDisponiblesRestaurante;
const getReservasRestauranteByCliente = async (req, res) => {
  try {
    const {
      cliente_id
    } = req.params;
    const reservas = await Restaurante.getReservasRestauranteByCliente(cliente_id);
    res.json(reservas);
  } catch (error) {
    console.error("Error al obtener reservas de restaurante por cliente:", error);
    res.status(500).json({
      error: "Error al obtener reservas del cliente"
    });
  }
};
exports.getReservasRestauranteByCliente = getReservasRestauranteByCliente;