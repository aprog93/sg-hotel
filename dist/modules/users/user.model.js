"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserById = exports.insertUser = exports.getAllUsers = exports.deleteUserById = void 0;
var _mysql = require("../../config/mysql.js");
const getAllUsers = async () => {
  const [results] = await _mysql.pool.query("SELECT * FROM users");
  // await pool.end();
  return results;
};
exports.getAllUsers = getAllUsers;
const insertUser = async ({
  id,
  fullname,
  username,
  password,
  role
}) => {
  const [results] = await _mysql.pool.query("INSERT INTO users (id, fullname, username, password, role) VALUES (?, ?, ?, ?, ?)", [id, fullname, username, password, role]);
  // await pool.end();
  return results.insertId;
};
exports.insertUser = insertUser;
const updateUserById = async (id, {
  username,
  password,
  role
}) => {
  const [results] = await _mysql.pool.query("UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?", [username, password, role, id]);
  // await pool.end();
  return results.affectedRows;
};
exports.updateUserById = updateUserById;
const deleteUserById = async id => {
  const [results] = await _mysql.pool.query("DELETE FROM users WHERE id = ?", [id]);
  // await pool.end();
  return results.affectedRows;
};
exports.deleteUserById = deleteUserById;