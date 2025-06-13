"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateFailedAttempts = exports.resetFailedAttempts = exports.getUserByUsername = exports.createUser = exports.blockUser = void 0;
var _mysql = require("../../config/mysql.js");
// models/user.model.js

const getUserByUsername = async username => {
  const [users] = await _mysql.pool.query("SELECT * FROM users WHERE username = ?", [username]);
  // await pool.end();
  return users[0]; // null si no existe
};
exports.getUserByUsername = getUserByUsername;
const createUser = async (username, hashedPassword, role) => {
  await _mysql.pool.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, hashedPassword, role]);
  // await pool.end();
};
exports.createUser = createUser;
const updateFailedAttempts = async (userId, attempts) => {
  await _mysql.pool.query("UPDATE users SET failedAttempts = ? WHERE id = ?", [attempts, userId]);
  // await pool.end();
};
exports.updateFailedAttempts = updateFailedAttempts;
const blockUser = async (userId, attempts) => {
  await _mysql.pool.query("UPDATE users SET blocked = true, failedAttempts = ? WHERE id = ?", [attempts, userId]);
  // await pool.end();
};
exports.blockUser = blockUser;
const resetFailedAttempts = async userId => {
  await _mysql.pool.query("UPDATE users SET failedAttempts = 0 WHERE id = ?", [userId]);
  // await pool.end();
};
exports.resetFailedAttempts = resetFailedAttempts;