"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _expressSession = _interopRequireDefault(require("express-session"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = (0, _expressSession.default)({
  secret: process.env.SESSION_SECRET || "defaultSecretKey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  }
});