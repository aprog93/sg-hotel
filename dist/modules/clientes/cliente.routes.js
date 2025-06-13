"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _clienteController = require("./cliente.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.get("/feedback", _clienteController.buscarClientes);
router.get("/reservaciones", _clienteController.obtenerClientesConEstadoReserva);
router.get("/", _clienteController.getClientes);
router.get("/:id", _clienteController.getClienteById);
router.post("/", _clienteController.createCliente);
router.put("/:id", _clienteController.updateCliente);
router.delete("/:id", _clienteController.deleteCliente);
var _default = exports.default = router;