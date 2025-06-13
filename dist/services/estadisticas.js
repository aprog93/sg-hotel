"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colaboradoresPorCausa = colaboradoresPorCausa;
exports.colaboradoresPorColorDeCabello = colaboradoresPorColorDeCabello;
exports.colaboradoresPorColorDeOjos = colaboradoresPorColorDeOjos;
exports.colaboradoresPorColorDePiel = colaboradoresPorColorDePiel;
exports.colaboradoresPorEspecialidad = colaboradoresPorEspecialidad;
exports.colaboradoresPorProvincia = colaboradoresPorProvincia;
exports.colaboradoresPorSexo = colaboradoresPorSexo;
exports.contratosPorPais = contratosPorPais;
var _mysql = require("../config/mysql.js");
var _AppError = _interopRequireDefault(require("../errors/AppError.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Utilidad para ejecutar consultas y manejar errores
async function executeQuery(query, errorMsg) {
  try {
    const [rows] = await _mysql.pool.query(query);
    return rows;
  } catch (err) {
    console.error(`${errorMsg}:`, err);
    throw new _AppError.default(errorMsg, 500);
  }
}
async function colaboradoresPorSexo() {
  return executeQuery(`
        SELECT sexo, COUNT(*) AS total
        FROM colaborador
        WHERE deleted_at IS NULL
        GROUP BY sexo
        `, "Error consultando colaboradores por sexo");
}
async function contratosPorPais() {
  return executeQuery(`
        SELECT pais, COUNT(*) AS total
        FROM colaborador
        WHERE deleted_at IS NULL
        GROUP BY pais
        `, "Error consultando contratos por país");
}
async function colaboradoresPorColorDeOjos() {
  return executeQuery(`
        SELECT colorDeOjos AS categoria, COUNT(*) AS total
        FROM colaborador
        WHERE deleted_at IS NULL
        GROUP BY colorDeOjos
        `, "Error consultando colaboradores por color de ojos");
}
async function colaboradoresPorColorDePiel() {
  return executeQuery(`
        SELECT piel AS categoria, COUNT(*) AS total
        FROM colaborador
        WHERE deleted_at IS NULL
        GROUP BY piel
        `, "Error consultando colaboradores por color de piel");
}
async function colaboradoresPorColorDeCabello() {
  return executeQuery(`
        SELECT colorDeCabello AS categoria, COUNT(*) AS total
        FROM colaborador
        WHERE deleted_at IS NULL
        GROUP BY colorDeCabello
        `, "Error consultando colaboradores por color de cabello");
}
async function colaboradoresPorProvincia() {
  return executeQuery(`
        SELECT provincia, COUNT(*) AS total
        FROM colaborador
        WHERE deleted_at IS NULL
        GROUP BY provincia
        `, "Error consultando colaboradores por provincia");
}
async function colaboradoresPorEspecialidad() {
  return executeQuery(`
        SELECT especialidad, COUNT(*) AS total
        FROM colaborador
        WHERE deleted_at IS NULL
        GROUP BY especialidad
        `, "Error consultando colaboradores por especialidad");
}
async function colaboradoresPorCausa() {
  return executeQuery(`
        SELECT causa, COUNT(*) AS total
        FROM colaborador
        WHERE deleted_at IS NULL AND causa IS NOT NULL AND causa <> ''
        GROUP BY causa
        `, "Error consultando colaboradores por causa");
}