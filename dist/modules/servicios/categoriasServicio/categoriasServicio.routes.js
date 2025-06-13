"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _categoriasServicioController = require("../controllers/categoriasServicio.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// routes/categoriasServicio.routes.js

const router = _express.default.Router();

// Operaciones CRUD para categorías
router.get("/", _categoriasServicioController.getAllCategorias);
router.post("/", _categoriasServicioController.createCategoria);
router.put("/:id", _categoriasServicioController.updateCategoria);
router.delete("/:id", _categoriasServicioController.deleteCategoria);
var _default = exports.default = router;