"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCliente = exports.obtenerClientesConEstadoReserva = exports.getClientes = exports.getClienteById = exports.deleteCliente = exports.createCliente = exports.buscarClientes = void 0;
var Cliente = _interopRequireWildcard(require("./cliente.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// controllers/cliente.controller.js

/**
 * Retorna todos los clientes sin información de reserva (básico)
 */
const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.getAllClientes();
    res.json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({
      error: "Error al obtener clientes"
    });
  }
};

/**
 * Búsqueda de clientes por coincidencia en nombre, habitación o teléfono
 */
exports.getClientes = getClientes;
const buscarClientes = async (req, res) => {
  try {
    const {
      q
    } = req.query;
    if (!q || !q.trim()) {
      return res.json([]); // Devuelve array vacío si la búsqueda está vacía
    }
    const clientes = await Cliente.buscarClientes(q);
    res.json(clientes);
  } catch (error) {
    console.error("Error al buscar clientes:", error);
    res.status(500).json({
      error: "Error al buscar clientes"
    });
  }
};

/**
 * Retorna un cliente por ID.
 */
exports.buscarClientes = buscarClientes;
const getClienteById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID inválido"
      });
    }
    const cliente = await Cliente.getClienteById(id);
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({
        message: "Cliente no encontrado"
      });
    }
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({
      error: "Error al obtener el cliente"
    });
  }
};

/**
 * Crea un nuevo cliente
 */
exports.getClienteById = getClienteById;
const createCliente = async (req, res) => {
  try {
    const clienteData = req.body;
    const clienteId = await Cliente.createCliente(clienteData);
    res.status(201).json({
      id: clienteId,
      message: "Cliente creado exitosamente"
    });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({
      error: "Error al crear el cliente"
    });
  }
};

/**
 * Actualiza un cliente existente
 */
exports.createCliente = createCliente;
const updateCliente = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID inválido"
      });
    }
    const updateData = req.body;
    const updated = await Cliente.updateCliente(id, updateData);
    if (updated) {
      res.status(200).json({
        message: "Cliente actualizado exitosamente"
      });
    } else {
      res.status(404).json({
        message: "Cliente no encontrado"
      });
    }
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({
      error: "Error al actualizar el cliente"
    });
  }
};

/**
 * Elimina un cliente
 */
exports.updateCliente = updateCliente;
const deleteCliente = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID inválido"
      });
    }
    const deleted = await Cliente.deleteCliente(id);
    if (deleted) {
      res.status(200).json({
        message: "Cliente eliminado exitosamente",
        id
      });
    } else {
      res.status(404).json({
        message: "Cliente no encontrado"
      });
    }
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({
      error: "Error al eliminar el cliente"
    });
  }
};

/**
 * Devuelve todos los clientes y un campo virtual `tieneReservaActiva`
 */
exports.deleteCliente = deleteCliente;
const obtenerClientesConEstadoReserva = async (req, res) => {
  try {
    const clientes = await Cliente.getAllClientesWithReservaActiva();
    res.json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes con reserva activa:", error);
    res.status(500).json({
      error: "Error al obtener los clientes"
    });
  }
};
exports.obtenerClientesConEstadoReserva = obtenerClientesConEstadoReserva;