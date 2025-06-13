"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _checkinController = require("./checkin.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.post("/checkin/:id", _checkinController.checkin); // /checkin/:id  → POST
router.post("/checkout/:id", _checkinController.checkout); // /checkout/:id → POST
var _default = exports.default = router;