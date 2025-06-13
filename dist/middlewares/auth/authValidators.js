"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usernameValidation = exports.roleValidation = exports.passwordValidation = void 0;
var _expressValidator = require("express-validator");
// Validaciones comunes
const usernameValidation = exports.usernameValidation = (0, _expressValidator.body)("username").trim().notEmpty().withMessage("Debe proporcionar un nombre de usuario.").isLength({
  max: 50
}).withMessage("El nombre de usuario debe tener como máximo 50 caracteres.");
const passwordValidation = exports.passwordValidation = (0, _expressValidator.body)("password").trim().notEmpty().withMessage("Debe proporcionar una contraseña.").isLength({
  min: 8,
  max: 50
}).withMessage("La contraseña debe tener entre 8 y 50 caracteres.");
const roleValidation = exports.roleValidation = (0, _expressValidator.body)("role").trim().notEmpty().withMessage("Debe proporcionar un rol.").isIn(["sudo", "administrador", "tramitadores", "comerciales"]).withMessage("El rol debe ser 'sudo', 'administrador', 'tramitadores' o 'comerciales'.");