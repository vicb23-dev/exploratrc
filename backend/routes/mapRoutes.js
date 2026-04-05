//creamos mapRoutes.js para manejar las rutas relacionadas con el mapa.
//Este archivo define una ruta GET que devuelve el HTML del mapa generado por la función getLeafletHtml.
// Esto permite que el frontend cargue el mapa dinámicamente desde el backend.
const express = require("express");
const router = express.Router();
const {
  searchPlace,
  reversePlace,
  nearbyPlaces,
} = require("../controllers/mapController");

router.get("/search", searchPlace);
router.get("/reverse", reversePlace);
router.get("/nearby", nearbyPlaces);

module.exports = router;
