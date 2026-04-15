/**
 * Controlador de usuarios
 *
 * Este archivo contiene la logica para:
 * - Registro de usuarios
 * - Inicio de sesión
 * - Recuperación de contraseña
 * - Restablecimiento de contraseña
 */

const pool = require("../config/db"); // conexión a la base de datos PostgreSQL
const bcrypt = require("bcrypt"); // librería para encriptar contraseñas
const jwt = require("jsonwebtoken"); // generación de tokens de autenticación

/**
 * Registro de usuario
 * Recibe nombre, email y password desde el frontend
 * Encripta la contraseña y guarda el usuario en la base de datos
 */
const register = async (req, res) => {
  console.log("DATOS RECIBIDOS:", req.body);

  const { nombre, email, password } = req.body;

  try {
    // encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // insertar usuario en base de datos
    const result = await pool.query(
      "INSERT INTO usuarios(nombre,email,password) VALUES($1,$2,$3) RETURNING *",
      [nombre, email, hashedPassword],
    );

    res.json({
      message: "Usuario registrado",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error("Error completo en registro:", error);
    console.error("Mensaje:", error.message);
    console.error("Código PostgreSQL:", error.code);

    res.status(500).json({
      error: error.message,
      code: error.code,
    });
  }
};

/**
 * Login de usuario
 * Verifica si el email existe y compara la contraseña encriptada
 * Si es válida, genera un token JWT para autenticación
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // buscar usuario por email
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const usuario = result.rows[0];

    // comparar contraseña ingresada con la almacenada
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
    }

    // generar token de autenticación
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      "secreto",
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login exitoso",
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en el login",
    });
  }
};

/**
 * Verificación para recuperación de contraseña
 * Comprueba si el email del usuario existe en la base de datos
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json({
      message: "Usuario encontrado",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en recuperación",
    });
  }
};

/**
 * Restablecer contraseña
 * Actualiza la contraseña del usuario en la base de datos
 * La nueva contraseña se guarda encriptada
 */
const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query("UPDATE usuarios SET password=$1 WHERE email=$2", [
      hashedPassword,
      email,
    ]);

    res.json({
      message: "Contraseña actualizada",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar contraseña",
    });
  }
};

// exportar funciones para usar en las rutas
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
