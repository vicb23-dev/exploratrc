/**
 * Servidor principal del backend
 *
 * Este archivo inicializa el servidor Express,
 * configura middlewares y registra las rutas de la API.
 */
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
const express = require("express");
const app = express();

const cors = require("cors");
const axios = require("axios");
const pool = require("./config/db"); //conexion
const path = require("path");

//transportes
const transporteRoutes = require("./routes/transporteRoutes");

// importar rutas de usuarios
const userRoutes = require("./routes/userRoutes");

//  importar rutas de rutas (gastronomica, cultura, etc.)
const rutasRoutes = require("./routes/rutas");
const detalleLugarRoutes = require("./routes/detallesLugarRuta");

//Importa los favoritos
const favoritoRoutes = require("./routes/favoritoRoutes");

//para chatbot
const chatbotRoutes = require("./routes/chatbotRoutes");

//importacion y uso de rutas de mapas
const mapRoutes = require("./routes/mapRoutes");

//temporal
console.log("userRoutes:", typeof userRoutes);
console.log("rutasRoutes:", typeof rutasRoutes);
console.log("detalleLugarRoutes:", typeof detalleLugarRoutes);
console.log("favoritoRoutes:", typeof favoritoRoutes);
console.log("chatbotRoutes:", typeof chatbotRoutes);
console.log("transporteRoutes:", typeof transporteRoutes);
console.log("mapRoutes:", typeof mapRoutes);

// Esto hace que al entrar a la IP, lo primero que vea el iPhone sean tus botones
app.use(express.static(path.join(__dirname, "public")));

// middlewares
app.use(cors());
app.use(express.json());

// rutas existentes
app.use("/api", userRoutes);

//  usar rutas de rutas
app.use("/api", rutasRoutes);
app.use("/api", detalleLugarRoutes);

app.use("/api", favoritoRoutes); //Favoritos
//app.use("/api", detalleLugarRoutes);

// rutas de chatbot
app.use("/api", chatbotRoutes);

app.get("/api/transportes/lugar/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        t.tp_id,
        t.tp_nombre,
        t.tp_tipo,
        t.tp_color,
        t.tp_descripcion
      FROM transportes_lugares tl
      JOIN transportes_publicos t ON tl.tp_id = t.tp_id
      WHERE tl.lug_id = $1
      ORDER BY t.tp_nombre ASC
    `,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error test transportes:", error);
    res.status(500).json({ error: error.message });
  }
});

// rutas de transporte
app.use("/api", transporteRoutes);

app.use("/api/maps", mapRoutes);
console.log("mapRoutes:", mapRoutes);

//  ruta raíz
app.get("/", (req, res) => {
  res.send("API funcionando");
});

//endpoint (ESTE LO DEJAMOS TAL CUAL PARA TU MAPA)
app.get("/lugares", async (req, res) => {
  const { categoria } = req.query; // Recibe 'Cultura', 'Gastronomica', etc.

  try {
    const query = `
      SELECT 
        l.lug_id, 
        l.lug_nombre, 
        l.lug_descripcion, 
        l.lug_latitud, 
        l.lug_longitud, 
        l.imagen_principal_url
      FROM lugares l
      JOIN lugares_rutas lr ON l.lug_id = lr.lug_id
      JOIN rutas r ON lr.rut_id = r.rut_id
      WHERE r.rut_nombre ILIKE $1
      ORDER BY lr.orden_en_ruta ASC;
    `;

    const result = await pool.query(query, [categoria]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar la DB:", error);
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

// SOLO UN listen
app.listen(5000, () => {
  console.log("Servidor en http://localhost:5000");
});
