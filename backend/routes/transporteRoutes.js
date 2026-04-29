    const express = require("express");
const router = express.Router();

const {
  obtenerTransportesPorLugar,
} = require("../controllers/transporteController");

router.get("/transportes/lugar/:id", obtenerTransportesPorLugar);

module.exports = router;