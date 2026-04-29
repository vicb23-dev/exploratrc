const express = require("express");
const router = express.Router();

const {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito,
} = require("../controllers/favoritoController");

router.get("/favoritos/:usu_id", obtenerFavoritos);
router.post("/favoritos", agregarFavorito);
router.delete("/favoritos/:usu_id/:lug_id", eliminarFavorito);

module.exports = router;