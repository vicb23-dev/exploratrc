const express = require("express");
const router = express.Router();

const {
  obtenerLugarPorId,
} = require("../controllers/detallesLugarController");

router.get("/lugares/:id", obtenerLugarPorId);

module.exports = router;