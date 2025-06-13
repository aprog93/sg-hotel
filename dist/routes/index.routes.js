"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _clienteRoutes = _interopRequireDefault(require("../modules/clientes/cliente.routes.js"));
var _authRoutes = _interopRequireDefault(require("../modules/auth/auth.routes.js"));
var _userRoutes = _interopRequireDefault(require("../modules/users/user.routes.js"));
var _habitacionRoutes = _interopRequireDefault(require("../modules/habitacion/habitacion.routes.js"));
var _habitacionesRoutes = _interopRequireDefault(require("../modules/habitaciones/habitaciones.routes.js"));
var _piscinaRoutes = _interopRequireDefault(require("../modules/piscina/piscina.routes.js"));
var _restauranteRoutes = _interopRequireDefault(require("../modules/restaurante/restaurante.routes.js"));
var _horariosRoutes = _interopRequireDefault(require("../modules/horariosPiscina/horarios.routes.js"));
var _atencionClienteRoutes = _interopRequireDefault(require("../modules/atencionCliente/atencionCliente.routes.js"));
var _estadisticasRoutes = _interopRequireDefault(require("../modules/estadisticas/estadisticas.routes.js"));
var _ingresosRoutes = _interopRequireDefault(require("../modules/ingresos/ingresos.routes.js"));
var _reporteRoutes = _interopRequireDefault(require("../modules/reporte/reporte.routes.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Importacion de rutas

const router = (0, _express.Router)();

// Impplementacion de rutas
router.use("/clientes", _clienteRoutes.default);
router.use("/auth", _authRoutes.default);
router.use("/users", _userRoutes.default);
router.use("/habitaciones", _habitacionRoutes.default);
router.use("/reserva-habitacion", _habitacionesRoutes.default);
router.use("/reserva-piscina", _piscinaRoutes.default);
router.use("/reserva-restaurante", _restauranteRoutes.default);
router.use("/horarios-piscina", _horariosRoutes.default);
router.use("/feedback", _atencionClienteRoutes.default);
router.use("/estadisticas", _estadisticasRoutes.default);
router.use("/ingresos", _ingresosRoutes.default);
router.use("/reportes", _reporteRoutes.default);

// Exportacion de las rutas
var _default = exports.default = router;