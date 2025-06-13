"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _authController = require("./auth.controller.js");
var _authValidators = require("../../middlewares/auth/authValidators.js");
var _auth = require("../../middlewares/auth/auth.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();

// Ruta pública para el inicio de sesión
router.post("/login", [_authValidators.usernameValidation, _authValidators.passwordValidation], _authController.loginUser);

// Ruta para cerrar sesión (requiere estar autenticado)
router.post("/logout", _auth.authenticate, _authController.logoutUser);

// Ruta para registro de usuarios (solo administradores o sudo)
// Solo usuarios autenticados con roles específicos pueden registrar nuevos usuarios
router.post("/register", _auth.authenticate,
// Primero verifica que esté autenticado
(0, _auth.authorize)(["sudo", "administrador"]),
// Luego verifica que tenga rol adecuado
[_authValidators.usernameValidation, _authValidators.passwordValidation, _authValidators.roleValidation],
// Valida los datos
_authController.registerUser // Finalmente ejecuta el registro
);
var _default = exports.default = router;