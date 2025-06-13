"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  // You can further customize per status code
  let errorResponse = {
    status: "error",
    message
  };

  // Add more details based on status code if you want
  switch (status) {
    case 400:
      errorResponse.message = errorResponse.message || "Bad Request";
      break;
    case 401:
      errorResponse.message = errorResponse.message || "Unauthorized";
      break;
    case 403:
      errorResponse.message = errorResponse.message || "Forbidden";
      break;
    case 404:
      errorResponse.message = errorResponse.message || "Error 404 - Not Found";
      break;
    case 409:
      errorResponse.message = errorResponse.message || "Conflict";
      break;
    case 500:
    default:
      errorResponse.message = errorResponse.message || "Internal Server Error";
      break;
  }
  res.status(status).json(errorResponse);
}
var _default = exports.default = errorHandler;