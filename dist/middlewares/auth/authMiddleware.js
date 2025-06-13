"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authMiddleware;
function authMiddleware(req, res, next) {
  if (req.session && req.session.user) next();else res.sendStatus(401);
}