"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTicketsByCliente = exports.getMensajesByTicket = exports.getAllTickets = exports.crearTicket = exports.agregarMensaje = void 0;
var AtencionModel = _interopRequireWildcard(require("./atencionCliente.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Lista todos los tickets de atención
const getAllTickets = async (req, res) => {
  try {
    const tickets = await AtencionModel.getTickets();
    res.json(tickets);
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    res.status(500).json({
      error: "Error al obtener tickets"
    });
  }
};
exports.getAllTickets = getAllTickets;
const crearTicket = async (req, res) => {
  try {
    const {
      cliente_id,
      asunto,
      descripcion
    } = req.body;
    if (!cliente_id || !asunto || !descripcion) {
      return res.status(400).json({
        error: "Datos incompletos"
      });
    }
    const ticketId = await AtencionModel.crearTicket({
      cliente_id,
      asunto,
      descripcion
    });
    res.status(201).json({
      ticket_id: ticketId,
      message: "Ticket creado"
    });
  } catch (error) {
    console.error("Error al crear ticket:", error); // ⬅️ esto imprime el error real en la consola
    res.status(500).json({
      error: error.message || "Error al crear ticket"
    }); // ⬅️ esto lo muestra en la respuesta
  }
};
exports.crearTicket = crearTicket;
const getTicketsByCliente = async (req, res) => {
  try {
    const {
      clienteId
    } = req.params;
    const tickets = await AtencionModel.getTicketsByCliente(clienteId);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener tickets"
    });
  }
};
exports.getTicketsByCliente = getTicketsByCliente;
const agregarMensaje = async (req, res) => {
  try {
    const {
      ticket_id,
      remitente,
      mensaje
    } = req.body;
    if (!ticket_id || !remitente || !mensaje) {
      return res.status(400).json({
        error: "Datos incompletos"
      });
    }
    const mensajeId = await AtencionModel.agregarMensaje({
      ticket_id,
      remitente,
      mensaje
    });
    res.status(201).json({
      mensaje_id: mensajeId,
      message: "Mensaje enviado"
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al enviar mensaje"
    });
  }
};
exports.agregarMensaje = agregarMensaje;
const getMensajesByTicket = async (req, res) => {
  try {
    const {
      ticketId
    } = req.params;
    const mensajes = await AtencionModel.getMensajesByTicket(ticketId);
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener mensajes"
    });
  }
};
exports.getMensajesByTicket = getMensajesByTicket;