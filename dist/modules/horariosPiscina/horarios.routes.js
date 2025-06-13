"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _horariosController = require("./horarios.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// routes/horariosPiscina.js

// Si tienes middlewares de validación específicos, agrégalos aquí

const router = _express.default.Router();

// Obtener todos los horarios de piscina
router.get("/", _horariosController.getAllHorariosPiscina);

// Obtener solo horarios disponibles
router.get("/disponibles", _horariosController.getHorariosDisponibles);

// Comprobar disponibilidad para una fecha específica
router.get("/check", _horariosController.checkHorarioDisponibilidad);

// Obtener un horario de piscina por ID
router.get("/:id", _horariosController.getHorarioPiscinaById);

// Crear un horario de piscina
router.post("/", _horariosController.createHorarioPiscina);

// Actualizar un horario de piscina
router.put("/:id", _horariosController.updateHorarioPiscina);

// Eliminar un horario de piscina
router.delete("/:id", _horariosController.deleteHorarioPiscina);
var _default = exports.default = router;