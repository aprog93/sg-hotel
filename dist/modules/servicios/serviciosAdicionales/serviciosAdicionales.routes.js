"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _serviciosAdicionalesController = require("./serviciosAdicionales.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// routes/serviciosAdicionales.routes.js

const router = _express.default.Router();

// Rutas de servicios adicionales (CRUD básico)
router.get("/", _serviciosAdicionalesController.getAllServicios);
router.get("/:id", _serviciosAdicionalesController.getServicioById);
router.post("/", _serviciosAdicionalesController.createServicio);
router.put("/:id", _serviciosAdicionalesController.updateServicio);
router.delete("/:id", _serviciosAdicionalesController.deleteServicio);

// Operaciones relacionadas con categorías
router.get("/categoria/:categoriaId", _serviciosAdicionalesController.getServiciosByCategoria);

// Consulta de disponibilidad
router.get("/:id/disponibilidad", _serviciosAdicionalesController.getDisponibilidadServicio);
var _default = exports.default = router;