"use strict";

var _app = _interopRequireDefault(require("./app.js"));
var _mysql = require("./config/mysql.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const port = process.env.PORT || 3000;
const startServer = async () => {
  const dbConnected = await (0, _mysql.connectDB)();
  if (!dbConnected) {
    console.error("No se pudo conectar a la base de datos. Saliendo...");
    process.exit(1);
  }
  _app.default.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
};

// Captura errores no manejados
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", err => {
  console.error("Uncaught Exception:", err);
});
startServer();