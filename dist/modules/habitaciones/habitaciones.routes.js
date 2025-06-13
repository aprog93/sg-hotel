"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _habitacionesController = require("./habitaciones.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// routes/reservas.routes.js (o el archivo donde defines tus rutas)

const router = _express.default.Router();

// CRUD básico reservas de habitaciones
router.get("/", _habitacionesController.getAllReservacion);
router.get("/:id", _habitacionesController.getReservacionById);
router.post("/", _habitacionesController.createReservacion);
router.put("/:id", _habitacionesController.updateReservacion);
router.delete("/:id", _habitacionesController.deleteReservacion);
router.put("/:id/pagar", _habitacionesController.pagarReservacion);

// NUEVOS: Checkin/checkout
router.put("/:id/checkin", _habitacionesController.hacerCheckin);
router.put("/:id/checkout", _habitacionesController.hacerCheckout);
router.put("/:id/cancelar", _habitacionesController.cancelarReservacion);
var _default = exports.default = router;