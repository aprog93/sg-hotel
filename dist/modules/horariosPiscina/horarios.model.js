"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateHorarioPiscina = exports.getHorariosDisponibles = exports.getHorarioPiscinaById = exports.getAllHorariosPiscina = exports.deleteHorarioPiscina = exports.createHorarioPiscina = exports.checkHorarioDisponibilidad = void 0;
var _mysql = require("../../config/mysql.js");
var _dateFormatter = require("../../utils/dateFormatter.js");
// models/horarioPiscina.model.js

// Obtener todos los horarios de piscina
const getAllHorariosPiscina = async () => {
  const [results] = await _mysql.pool.query(`
    SELECT 
      horario_id, 
      hora_inicio, 
      hora_fin, 
      aforo_maximo, 
      estado, 
      creado_en, 
      actualizado_en
    FROM horarios_piscina
  `);
  return results.map(_dateFormatter.formatDatesInObject);
};

// Obtener los horarios disponibles
exports.getAllHorariosPiscina = getAllHorariosPiscina;
const getHorariosDisponibles = async () => {
  const [results] = await _mysql.pool.query(`
    SELECT 
      horario_id, 
      hora_inicio, 
      hora_fin, 
      aforo_maximo, 
      estado, 
      creado_en, 
      actualizado_en
    FROM horarios_piscina
    WHERE estado = 'disponible'
  `);
  return results.map(_dateFormatter.formatDatesInObject);
};

// Obtener horario por ID
exports.getHorariosDisponibles = getHorariosDisponibles;
const getHorarioPiscinaById = async id => {
  const [rows] = await _mysql.pool.query(`
    SELECT 
      horario_id, 
      hora_inicio, 
      hora_fin, 
      aforo_maximo, 
      estado, 
      creado_en, 
      actualizado_en
    FROM horarios_piscina
    WHERE horario_id = ?
  `, [id]);
  return rows.length ? (0, _dateFormatter.formatDatesInObject)(rows[0]) : null;
};

// Crear un nuevo horario de piscina
exports.getHorarioPiscinaById = getHorarioPiscinaById;
const createHorarioPiscina = async horarioData => {
  const [result] = await _mysql.pool.query(`INSERT INTO horarios_piscina SET ?`, [horarioData]);
  return result.insertId;
};

// Actualizar un horario de piscina
exports.createHorarioPiscina = createHorarioPiscina;
const updateHorarioPiscina = async (id, horarioData) => {
  const [result] = await _mysql.pool.query(`UPDATE horarios_piscina SET ? WHERE horario_id = ?`, [horarioData, id]);
  return result.affectedRows > 0;
};

// Eliminar un horario de piscina
exports.updateHorarioPiscina = updateHorarioPiscina;
const deleteHorarioPiscina = async id => {
  const [result] = await _mysql.pool.query(`DELETE FROM horarios_piscina WHERE horario_id = ?`, [id]);
  return result.affectedRows > 0;
};

// Verificar disponibilidad para una fecha específica
exports.deleteHorarioPiscina = deleteHorarioPiscina;
const checkHorarioDisponibilidad = async (horarioId, fecha) => {
  // Contar reservas activas para este horario en la fecha dada
  const [rows] = await _mysql.pool.query(`
    SELECT COUNT(*) as reservas_count
    FROM reservas_piscina
    WHERE horario_id = ? AND fecha = ? AND estado = 'reservada'
  `, [horarioId, fecha]);

  // Obtener aforo máximo del horario
  const [horarioInfo] = await _mysql.pool.query(`
    SELECT aforo_maximo, estado
    FROM horarios_piscina
    WHERE horario_id = ?
  `, [horarioId]);
  if (!horarioInfo.length) {
    throw new Error("Horario no encontrado");
  }
  const {
    aforo_maximo,
    estado
  } = horarioInfo[0];
  const {
    reservas_count
  } = rows[0];
  return {
    disponible: estado === "disponible" && reservas_count < aforo_maximo,
    aforo_maximo,
    reservas_actuales: reservas_count,
    plazas_disponibles: aforo_maximo - reservas_count,
    estado
  };
};
exports.checkHorarioDisponibilidad = checkHorarioDisponibilidad;