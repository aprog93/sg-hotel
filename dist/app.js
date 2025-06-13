"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("dotenv/config");
var _express = _interopRequireDefault(require("express"));
var _path = _interopRequireDefault(require("path"));
var _morganBody = _interopRequireDefault(require("morgan-body"));
var _cors = _interopRequireDefault(require("cors"));
var _globalErrorHandler = _interopRequireDefault(require("./middlewares/globalErrorHandler.js"));
var _session = _interopRequireDefault(require("./config/session.js"));
var _cors2 = require("./config/cors.js");
var _indexRoutes = _interopRequireDefault(require("./routes/index.routes.js"));
var _authMiddleware = _interopRequireDefault(require("./middlewares/auth/authMiddleware.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const app = (0, _express.default)();

// Middlewares globales
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
app.use((0, _cors.default)(_cors2.corsOptions));
app.use(_session.default);

// Logger
(0, _morganBody.default)(app, {
  skip: (req, res) => res.statusCode < 400 || [403, 404, 409, 401].includes(res.statusCode)
});

// API Routes
app.use("/api", _indexRoutes.default);

// Auth ejemplo
app.get("/protected", _authMiddleware.default, (req, res) => {
  res.send("You can only see this after you've logged in.");
});

// 404 API (antes del frontend)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      error: "Recurso no encontrado"
    });
  }
  next();
});

// --- FRONTEND ESTÁTICO ---
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "dist")));
// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "dist/dist", "index.html"));
// });

// --- FRONTEND ESTÁTICO ---
app.use(_express.default.static(_path.default.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(_path.default.join(__dirname, "dist", "index.html"));
});

// Manejador errores global
app.use(_globalErrorHandler.default);
var _default = exports.default = app;