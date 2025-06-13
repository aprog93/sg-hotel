"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDatesInObject = void 0;
var _dateFns = require("date-fns");
/**
 * Formatea campos de fecha en un objeto o un array de objetos al formato 'yyyy-MM-dd'.
 * Si recibe null/undefined, retorna tal cual.
 * Si recibe un array, formatea cada elemento.
 * Si recibe un objeto, lo formatea.
 *
 * @param {Object|Array} data - Objeto o array de objetos a formatear.
 * @param {Array<string>} [dateFields] - (Opcional) Campos a formatear, si no se especifica, autodetecta.
 * @returns {Object|Array} - Objeto(s) con los campos de fecha formateados.
 */
const formatDatesInObject = (data, dateFields = []) => {
  if (!data) return data;
  // Si es un array, formatea cada elemento recursivamente
  if (Array.isArray(data)) {
    return data.map(obj => formatDatesInObject(obj, dateFields));
  }
  // Si NO es un objeto, retorna tal cual
  if (typeof data !== "object" || data === null) return data;
  const formattedObj = {
    ...data
  };
  let fields = dateFields;

  // Autodetecta campos de fecha si no se pasan
  if (!fields || !fields.length) {
    fields = Object.keys(formattedObj).filter(key => {
      const value = formattedObj[key];
      // Valida como fecha válida (permite formatos ISO y Date)
      return typeof value === "string" && (0, _dateFns.isValid)((0, _dateFns.parseISO)(value)) // intenta parsear ISO
      ;
    });
  }

  // Formatea los campos especificados
  for (const key of fields) {
    const value = formattedObj[key];
    if (value) {
      // Permite Date o string convertible
      const dt = typeof value === "string" && (0, _dateFns.isValid)((0, _dateFns.parseISO)(value)) ? (0, _dateFns.parseISO)(value) : new Date(value);
      formattedObj[key] = (0, _dateFns.isValid)(dt) ? (0, _dateFns.format)(dt, "yyyy-MM-dd") : null;
    }
  }
  return formattedObj;
};
exports.formatDatesInObject = formatDatesInObject;