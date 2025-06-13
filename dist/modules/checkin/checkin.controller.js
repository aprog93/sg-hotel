"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkout = exports.checkin = void 0;
var CheckinModel = _interopRequireWildcard(require("./checkin.model.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Realiza el Check-in
const checkin = async (req, res) => {
  try {
    const {
      id
    } = req.params; // id de la reserva
    await CheckinModel.doCheckin(id);
    res.status(200).json({
      message: "Check-in realizado exitosamente"
    });
  } catch (error) {
    console.error("Error en check-in:", error);
    res.status(500).json({
      error: "Error al realizar check-in"
    });
  }
};

// Realiza el Check-out
exports.checkin = checkin;
const checkout = async (req, res) => {
  try {
    const {
      id
    } = req.params; // id de la reserva
    await CheckinModel.doCheckout(id);
    res.status(200).json({
      message: "Check-out realizado exitosamente"
    });
  } catch (error) {
    console.error("Error en check-out:", error);
    res.status(500).json({
      error: "Error al realizar check-out"
    });
  }
};
exports.checkout = checkout;