"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _userController = require("./user.controller.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.get("/", _userController.getUsers);
router.post("/", _userController.createUser);
router.put("/:id", _userController.updateUser);
router.delete("/:id", _userController.deleteUser);
var _default = exports.default = router;