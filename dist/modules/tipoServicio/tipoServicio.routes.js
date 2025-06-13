"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _tipoServicioController = require("./tipoServicio.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.get("/", _tipoServicioController.getTiposServicio);
router.get("/:id", _tipoServicioController.getTipoServicioById);
router.post("/", _tipoServicioController.createTipoServicio);
router.put("/:id", _tipoServicioController.updateTipoServicio);
router.delete("/:id", _tipoServicioController.deleteTipoServicio);
var _default = exports.default = router;