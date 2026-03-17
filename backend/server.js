/**
 * Servidor principal del backend
 * 
 * Este archivo inicializa el servidor Express,
 * configura middlewares y registra las rutas de la API.
 */

const express = require("express");
const cors = require("cors");

// importar rutas de usuarios
const userRoutes = require("./routes/userRoutes");

const app = express();

// middleware para permitir peticiones desde otros dominios
app.use(cors());

// middleware para interpretar JSON
app.use(express.json());

// rutas principales de la API
app.use("/api", userRoutes);

// iniciar servidor en puerto 5000
app.listen(5000, () => {
  console.log("Servidor corriendo en puerto 5000");
});