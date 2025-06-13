"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _restauranteController = require("./restaurante.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Importa middlewares de validación si los necesitas

const router = _express.default.Router();

// Listar todas las reservas de restaurante
router.get("/", _restauranteController.getAllReservaRestaurante);

// Reservas de restaurante por cliente
router.get("/cliente/:cliente_id", _restauranteController.getReservasRestauranteByCliente);

// Mesas disponibles para un horario (consulta por query: ?fecha=...&hora_inicio=...&hora_fin=...)
router.get("/mesas-disponibles", _restauranteController.getMesasDisponiblesRestaurante);

// Obtener una reserva de restaurante por id
router.get("/:id", _restauranteController.getReservaRestauranteById);

// Crear una reserva
router.post("/", _restauranteController.createReservaRestaurante);

// Actualizar
router.put("/:id", _restauranteController.updateReservaRestaurante);

// Eliminar
router.delete("/:id", _restauranteController.deleteReservaRestaurante);
var _default = exports.default = router;