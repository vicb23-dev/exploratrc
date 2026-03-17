/**
 * Rutas de usuarios
 * 
 * Define los endpoints relacionados con la autenticación:
 * - registro
 * - login
 * - recuperación de contraseña
 */

const express = require("express");
const router = express.Router();

// importar funciones del controlador
const { 
  register,
  login,
  forgotPassword,
  resetPassword
} = require("../controllers/userController");

// rutas de la API
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;