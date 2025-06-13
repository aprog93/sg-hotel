"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateQueryParams = validateQueryParams;
// utils/validateQuery.js
async function validateQueryParams(params, acceptedParams) {
  const unexpected = Object.keys(params).filter(p => !acceptedParams.includes(p));
  if (unexpected.length) throw new Error(`Parámetro(s) inválido(s) en la query: ${unexpected.join(", ")}`);
}