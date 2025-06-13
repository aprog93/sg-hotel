"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = exports.getUsers = exports.deleteUser = exports.createUser = void 0;
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _userModel = require("./user.model.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const saltRounds = 10;
const getUsers = async (req, res) => {
  try {
    const results = await (0, _userModel.getAllUsers)();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener usuarios"
    });
  }
};
exports.getUsers = getUsers;
const createUser = async (req, res) => {
  const {
    id,
    fullname,
    username,
    password,
    role
  } = req.body;
  try {
    const hashedPassword = await _bcryptjs.default.hash(password, saltRounds);
    const insertId = await (0, _userModel.insertUser)({
      id,
      fullname,
      username,
      password: hashedPassword,
      role
    });
    res.json({
      message: "Usuario creado correctamente",
      id: insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear usuario"
    });
  }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
  const {
    id
  } = req.params;
  const {
    username,
    password,
    role
  } = req.body;
  try {
    const hashedPassword = await _bcryptjs.default.hash(password, saltRounds);
    const affectedRows = await (0, _userModel.updateUserById)(id, {
      username,
      password: hashedPassword,
      role
    });
    if (affectedRows > 0) {
      res.json({
        message: "Usuario actualizado correctamente"
      });
    } else {
      res.status(404).json({
        message: "Usuario no encontrado"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar usuario"
    });
  }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const affectedRows = await (0, _userModel.deleteUserById)(id);
    if (affectedRows > 0) {
      res.json({
        message: "Usuario eliminado correctamente"
      });
    } else {
      res.status(404).json({
        message: "Usuario no encontrado"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al eliminar usuario"
    });
  }
};
exports.deleteUser = deleteUser;