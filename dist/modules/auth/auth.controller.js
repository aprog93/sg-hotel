"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUser = exports.logoutUser = exports.loginUser = void 0;
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _expressValidator = require("express-validator");
var UserModel = _interopRequireWildcard(require("./auth.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const VALID_ROLES = ["sudo", "administrador", "tramitadores", "comerciales"];
const MAX_FAILED_ATTEMPTS = 3;
const handleValidationErrors = (req, res) => {
  const errors = (0, _expressValidator.validationResult)(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  return null;
};
const registerUser = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;
  const {
    username,
    password,
    role
  } = req.body;
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({
      message: "Rol no válido."
    });
  }
  try {
    const existingUser = await UserModel.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        message: "El nombre de usuario ya está en uso."
      });
    }
    const hashedPassword = await _bcryptjs.default.hash(password, 10);
    await UserModel.createUser(username, hashedPassword, role);
    return res.status(201).json({
      message: "Usuario creado con éxito."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor."
    });
  }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return validationError;
  const {
    username,
    password
  } = req.body;
  try {
    const user = await UserModel.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        message: "Nombre de usuario o contraseña incorrectos."
      });
    }
    if (user.blocked) {
      return res.status(401).json({
        message: "Cuenta bloqueada."
      });
    }
    const isMatch = await _bcryptjs.default.compare(password, user.password);
    if (!isMatch) {
      const failedAttempts = (user.failedAttempts || 0) + 1;
      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        await UserModel.blockUser(user.id, failedAttempts);
        return res.status(401).json({
          message: "Cuenta bloqueada."
        });
      } else {
        await UserModel.updateFailedAttempts(user.id, failedAttempts);
        return res.status(401).json({
          message: "Nombre de usuario o contraseña incorrectos."
        });
      }
    }
    await UserModel.resetFailedAttempts(user.id);
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    return res.status(200).json({
      message: "Inicio de sesión exitoso.",
      role: user.role
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor."
    });
  }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
  try {
    await req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor."
    });
  }
};
exports.logoutUser = logoutUser;