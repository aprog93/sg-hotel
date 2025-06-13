"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _habitacionController = require("./habitacion.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.get("/", _habitacionController.getHabitaciones);
router.get("/:id", _habitacionController.getHabitacionById);
router.put("/:id", _habitacionController.updateHabitacion);
var _default = exports.default = router;