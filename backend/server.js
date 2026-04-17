/**
 * Servidor principal del backend
 *
 * Este archivo inicializa el servidor Express,
 * configura middlewares y registra las rutas de la API.
 */
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const { Pool } = require("pg");

// Configura los datos de TU base de datos de PostgreSQL
const pool = new Pool({
  user: "postgres",          // Tu usuario de pgAdmin
  host: "localhost",
  database: "exploratrc",    // El nombre de tu base de datos
  password: "1234",          // Tu contraseña de pgAdmin
  port: 5432,
});

// importar rutas de usuarios
const userRoutes = require("./routes/userRoutes");

// 🔥 🔹 NUEVO: importar rutas de rutas (gastronomica, cultura, etc.)
const rutasRoutes = require("./routes/rutas");
const detalleLugarRoutes = require("./routes/detallesLugarRuta");

const app = express();

const path = require('path');
// Esto hace que al entrar a la IP, lo primero que vea el iPhone sean tus botones
app.use(express.static(path.join(__dirname, 'public')));

// middlewares
app.use(cors());
app.use(express.json());

// rutas existentes
app.use("/api", userRoutes);

// 🔥 🔹 NUEVO: usar rutas de rutas
app.use("/api", rutasRoutes);
app.use("/api", detalleLugarRoutes);
//app.use("/api", detalleLugarRoutes);

//importacion y uso de rutas de mapas
const mapRoutes = require("./routes/mapRoutes");
app.use("/api/maps", mapRoutes);
console.log("mapRoutes:", mapRoutes);

// 🔹 ruta raíz
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