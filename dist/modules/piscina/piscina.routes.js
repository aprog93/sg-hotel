"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _piscinaController = require("./piscina.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// routes/reservasPiscina.js

// Si tienes middlewares de validación específicos, agrégalos aquí

const router = _express.default.Router();

// Obtener todas las reservas de piscina
router.get("/", _piscinaController.getAllReservaPiscina);

// Obtener una reserva de piscina por ID
router.get("/:id", _piscinaController.getReservaPiscinaById);

// Crear una reserva de piscina
router.post("/", _piscinaController.createReservaPiscina);

// Actualizar una reserva de piscina
router.put("/:id", _piscinaController.updateReservaPiscina);

// Eliminar una reserva de piscina
router.delete("/:id", _piscinaController.deleteReservaPiscina);

// Pagar una reserva de piscina
router.put("/:id/pagar", _piscinaController.pagarReservaPiscina);
var _default = exports.default = router;