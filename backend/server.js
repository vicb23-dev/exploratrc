/**
 * Servidor principal del backend
 *
 * Este archivo inicializa el servidor Express,
 * configura middlewares y registra las rutas de la API.
 */
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// importar rutas de usuarios
const userRoutes = require("./routes/userRoutes");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// rutas existentes
app.use("/api", userRoutes);

//importacion y uso de rutas de mapas
const mapRoutes = require("./routes/mapRoutes");
app.use("/api/maps", mapRoutes);
console.log("mapRoutes:", mapRoutes);

// 🔹 ruta raíz
app.get("/", (req, res) => {
  res.send("API funcionando");
});

const categorias = {
  gastronomica: '["amenity"~"restaurant|cafe|fast_food"]',
  cultura: '["tourism"~"museum|gallery"]',
  entretenimiento: '["leisure"~"park|playground|sports_centre"]',
  night: '["amenity"~"bar|pub|nightclub"]',
  familiar: '["tourism"~"zoo|attraction"]',
};

async function obtenerImagen(nombreLugar) {
  try {
    const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nombreLugar)}`;

    const response = await axios.get(url);

    return response.data.thumbnail?.source || null;
  } catch (error) {
    return null;
  }
}

//  endpoint OpenStreetMap
app.get("/lugares", async (req, res) => {
  const { categoria, lat, lng } = req.query;

  try {
    //  Validar categoría
    const filtro = categorias[categoria];

    if (!filtro) {
      return res.status(400).json({ error: "Categoría inválida" });
    }

    //  Query dinámica
    const query = `
      [out:json];
      node${filtro}(around:5000,${lat},${lng});
      out;
    `;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" } },
    );

    //  Limpiar datos
    const lugares = await Promise.all(
      response.data.elements.map(async (l) => {
        const nombre = l.tags?.name || "Sin nombre";

        const imagen = await obtenerImagen(nombre);

        return {
          id: l.id,
          nombre,
          latitud: l.lat,
          longitud: l.lon,
          imagen: imagen || "https://via.placeholder.com/150",
        };
      }),
    );

    res.json(lugares);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar OSM" });
  }
});

// SOLO UN listen
app.listen(5000, () => {
  console.log("Servidor en http://localhost:5000");
});
