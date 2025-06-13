"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _atencionClienteController = require("./atencionCliente.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.get("/tickets", _atencionClienteController.getAllTickets);
router.post("/ticket", _atencionClienteController.crearTicket);
router.get("/tickets/:clienteId", _atencionClienteController.getTicketsByCliente);
router.post("/mensaje", _atencionClienteController.agregarMensaje);
router.get("/mensajes/:ticketId", _atencionClienteController.getMensajesByTicket);
var _default = exports.default = router;