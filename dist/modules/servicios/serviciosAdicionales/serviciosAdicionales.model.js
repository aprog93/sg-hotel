"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verificarDisponibilidad = exports.updateServicio = exports.getServiciosByCategoria = exports.getServicioById = exports.getReporteUsoServicios = exports.getDisponibilidadServicio = exports.getAllServicios = exports.deleteServicio = exports.createServicio = void 0;
var _mysql = require("../../../config/mysql.js");
var _dateFormatter = require("../../../utils/dateFormatter.js");
// models/serviciosAdicionales.model.js

// Obtener todos los servicios adicionales
const getAllServicios = async () => {
  const [results] = await _mysql.pool.query(`
        SELECT s.*, c.nombre AS categoria_nombre 
        FROM servicios_adicionales s
        LEFT JOIN categorias_servicio c ON s.categoria_id = c.categoria_id
    `);
  return results.map(_dateFormatter.formatDatesInObject);
};

// Obtener un servicio por ID
exports.getAllServicios = getAllServicios;
const getServicioById = async id => {
  const [rows] = await _mysql.pool.query(`SELECT s.*, c.nombre AS categoria_nombre 
         FROM servicios_adicionales s
         LEFT JOIN categorias_servicio c ON s.categoria_id = c.categoria_id
         WHERE s.servicio_id = ?`, [id]);
  return rows.length ? (0, _dateFormatter.formatDatesInObject)(rows[0]) : null;
};

// Crear un nuevo servicio
exports.getServicioById = getServicioById;
const createServicio = async servicioData => {
  const [result] = await _mysql.pool.query(`INSERT INTO servicios_adicionales SET ?`, [servicioData]);
  return result.insertId;
};

// Actualizar un servicio existente
exports.createServicio = createServicio;
const updateServicio = async (id, servicioData) => {
  const [result] = await _mysql.pool.query(`UPDATE servicios_adicionales SET ? WHERE servicio_id = ?`, [servicioData, id]);
  return result.affectedRows > 0;
};

// Eliminar un servicio
exports.updateServicio = updateServicio;
const deleteServicio = async id => {
  // Primero verificamos si hay reservas asociadas
  const [reservas] = await _mysql.pool.query(`SELECT COUNT(*) as count FROM reservas_servicio WHERE servicio_id = ?`, [id]);
  if (reservas[0].count > 0) {
    throw new Error("No se puede eliminar el servicio porque tiene reservas asociadas");
  }
  const [result] = await _mysql.pool.query(`DELETE FROM servicios_adicionales WHERE servicio_id = ?`, [id]);
  return result.affectedRows > 0;
};

// Obtener servicios por categoría
exports.deleteServicio = deleteServicio;
const getServiciosByCategoria = async categoriaId => {
  const [rows] = await _mysql.pool.query(`SELECT * FROM servicios_adicionales WHERE categoria_id = ? AND estado = 'activo'`, [categoriaId]);
  return rows.map(_dateFormatter.formatDatesInObject);
};

// Verificar si un horario específico está disponible
exports.getServiciosByCategoria = getServiciosByCategoria;
const verificarDisponibilidad = async (servicioId, fecha, horaInicio, horaFin) => {
  // Similar a la función anterior pero para un horario específico
  const [servicioRows] = await _mysql.pool.query(`SELECT * FROM servicios_adicionales WHERE servicio_id = ?`, [servicioId]);
  if (!servicioRows.length) {
    throw new Error("Servicio no encontrado");
  }
  const servicio = servicioRows[0];

  // Verificar si existen reservas en ese horario que generen conflicto
  const [reservas] = await _mysql.pool.query(`SELECT COUNT(*) AS count 
         FROM reservas_servicio 
         WHERE servicio_id = ? 
         AND fecha = ? 
         AND estado != 'cancelada'
         AND (
            (hora_inicio < ? AND hora_fin > ?) OR 
            (hora_inicio < ? AND hora_fin > ?) OR 
            (hora_inicio >= ? AND hora_fin <= ?)
         )`, [servicioId, fecha, horaFin, horaInicio, horaInicio, horaFin, horaInicio, horaFin]);

  // Si hay reservas solapadas y no hay aforo o está al límite, no está disponible
  if (reservas[0].count > 0 && (!servicio.aforo_maximo || servicio.aforo_maximo <= reservas[0].count)) {
    return false;
  }

  // También verificamos si hay horario definido para ese día de la semana
  const diaSemana = new Date(fecha).toLocaleDateString("es-ES", {
    weekday: "long"
  });
  const [horarios] = await _mysql.pool.query(`SELECT COUNT(*) AS count 
         FROM horarios_servicio 
         WHERE servicio_id = ? 
         AND dia_semana = ? 
         AND disponible = TRUE
         AND hora_inicio <= ? 
         AND hora_fin >= ?`, [servicioId, diaSemana, horaInicio, horaFin]);

  // Si no hay horarios definidos para ese día o hora, no está disponible
  return horarios[0].count > 0;
};

// Obtener disponibilidad de un servicio en una fecha específica
exports.verificarDisponibilidad = verificarDisponibilidad;
const getDisponibilidadServicio = async (servicioId, fecha) => {
  // 1. Obtenemos el servicio para verificar duración, aforo, etc.
  const [servicioRows] = await _mysql.pool.query(`SELECT * FROM servicios_adicionales WHERE servicio_id = ?`, [servicioId]);
  if (!servicioRows.length) {
    throw new Error("Servicio no encontrado");
  }
  const servicio = servicioRows[0];

  // 2. Obtenemos los horarios regulares para ese día de la semana
  const diaSemana = new Date(fecha).toLocaleDateString("es-ES", {
    weekday: "long"
  });
  const [horariosRows] = await _mysql.pool.query(`SELECT * FROM horarios_servicio 
         WHERE servicio_id = ? AND dia_semana = ? AND disponible = TRUE
         ORDER BY hora_inicio`, [servicioId, diaSemana]);

  // 3. Obtenemos las reservas existentes para esa fecha
  const [reservasRows] = await _mysql.pool.query(`SELECT hora_inicio, hora_fin, numero_personas 
         FROM reservas_servicio 
         WHERE servicio_id = ? AND fecha = ? AND estado != 'cancelada'`, [servicioId, fecha]);

  // 4. Calculamos los slots disponibles
  const horariosPosibles = horariosRows.map(h => {
    // Convertimos a objetos Date para facilitar comparaciones
    const horaInicio = new Date(`${fecha}T${h.hora_inicio}`);
    const horaFin = new Date(`${fecha}T${h.hora_fin}`);

    // Verificamos solapamientos con reservas existentes
    const reservasConflicto = reservasRows.filter(r => {
      const reservaInicio = new Date(`${fecha}T${r.hora_inicio}`);
      const reservaFin = new Date(`${fecha}T${r.hora_fin}`);
      return reservaInicio < horaFin && reservaFin > horaInicio || horaInicio < reservaFin && horaFin > reservaInicio;
    });

    // Calculamos capacidad disponible (si aplica)
    let aforoDisponible = servicio.aforo_maximo || null;
    if (aforoDisponible && reservasConflicto.length > 0) {
      const personasReservadas = reservasConflicto.reduce((total, r) => total + r.numero_personas, 0);
      aforoDisponible = Math.max(0, aforoDisponible - personasReservadas);
    }
    return {
      horario_id: h.horario_id,
      hora_inicio: h.hora_inicio,
      hora_fin: h.hora_fin,
      disponible: aforoDisponible !== 0,
      aforo_disponible: aforoDisponible
    };
  });
  return {
    servicio_id: servicio.servicio_id,
    nombre: servicio.nombre,
    fecha,
    horarios_disponibles: horariosPosibles
  };
};

// Obtener reportes de uso de servicios
exports.getDisponibilidadServicio = getDisponibilidadServicio;
const getReporteUsoServicios = async (fechaInicio, fechaFin) => {
  const [rows] = await _mysql.pool.query(`SELECT sa.nombre, sa.categoria_id, COUNT(rs.reserva_servicio_id) as total_reservas,
                SUM(rs.total) as ingresos_totales
         FROM servicios_adicionales sa
         LEFT JOIN reservas_servicio rs ON sa.servicio_id = rs.servicio_id
         WHERE rs.fecha BETWEEN ? AND ? AND rs.estado != 'cancelada'
         GROUP BY sa.servicio_id
         ORDER BY total_reservas DESC`, [fechaInicio, fechaFin]);
  return rows;
};
exports.getReporteUsoServicios = getReporteUsoServicios;