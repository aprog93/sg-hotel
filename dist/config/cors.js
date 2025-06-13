"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.corsOptions = exports.allowedOrigins = void 0;
var _AppError = _interopRequireDefault(require("../errors/AppError.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const corsAllowey = process.env.CORS_ALLOWED_ORIGINS;
if (!corsAllowey) throw new _AppError.default("CORS_ALLOWED_ORIGINS no está definido en las variables de entorno", 500);
const allowedOrigins = exports.allowedOrigins = corsAllowey.split(",");
const corsOptions = exports.corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);else callback(new Error("No permitido por CORS"));
  },
  credentials: true,
  methods: ["POST", "GET", "PUT", "PATCH", "DELETE"]
};