const express = require("express");
const router = express.Router();

const { obtenerPorCategoria } = require("../controllers/rutasController");

router.get("/lugares", obtenerPorCategoria);

module.exports = router;