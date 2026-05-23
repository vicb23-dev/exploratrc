/**
 * Controlador de usuarios
 *
 * Contiene:
 * - Registro de usuarios
 * - Login
 * - Recuperación de contraseña
 * - Restablecimiento de contraseña
 * - Actualización de perfil
 * - Verificación de username único
 */

const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Validar contraseña segura
 *
 * Requisitos:
 * - mínimo 8 caracteres
 * - 1 mayúscula
 * - 1 minúscula
 * - 1 número
 * - 1 carácter especial
 */
const validarPasswordSegura = (password) => {
  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

  return regexPassword.test(password);
};

/**
 * Generar username único automáticamente
 */
const generarUsernameUnico = async (nombre) => {
  let baseUsername = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

  if (!baseUsername) {
    baseUsername = "usuario";
  }

  let username = baseUsername;
  let contador = 1;

  while (true) {
    const existe = await pool.query(
      "SELECT id FROM usuarios WHERE username = $1",
      [username],
    );

    if (existe.rows.length === 0) {
      return username;
    }

    username = `${baseUsername}${contador}`;
    contador++;
  }
};

/**
 * Registro de usuario
 */
const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    if (!validarPasswordSegura(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const username = await generarUsernameUnico(nombre);

    const result = await pool.query(
      `INSERT INTO usuarios(nombre,email,password,username)
       VALUES($1,$2,$3,$4)
       RETURNING id,nombre,email,username,imagen,rol`,
      [nombre, email, hashedPassword, username],
    );

    res.json({
      message: "Usuario registrado",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
      code: error.code,
    });
  }
};

/**
 * Login de usuario
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const usuario = result.rows[0];

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password,
    );

    if (!passwordValida) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
      },
      "secreto",
      {
        expiresIn: "1h",
      },
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        username: usuario.username,
        imagen: usuario.imagen,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Error en el login",
    });
  }
};

/**
 * Verificar si el email existe para recuperar contraseña
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json({
      message: "Usuario encontrado",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Error en recuperación",
    });
  }
};

/**
 * Restablecer contraseña
 */
const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!validarPasswordSegura(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE usuarios SET password=$1 WHERE email=$2",
      [hashedPassword, email],
    );

    res.json({
      message: "Contraseña actualizada",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Error al actualizar contraseña",
    });
  }
};

/**
 * Verificar si un username está disponible
 */
const verificarUsername = async (req, res) => {
  const { username, id } = req.query;

  try {
    if (!username) {
      return res.status(400).json({
        message: "Username requerido",
        disponible: false,
      });
    }

    const result = await pool.query(
      "SELECT id FROM usuarios WHERE username = $1 AND id <> $2",
      [username, id || 0],
    );

    res.json({
      disponible: result.rows.length === 0,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error al verificar username",
      disponible: false,
    });
  }
};

/**
 * Actualizar perfil
 *
 * Para guardar cambios siempre pide contraseña actual.
 */
const actualizarPerfil = async (req, res) => {
  const { id } = req.params;

  const {
    nombre,
    username,
    email,
    imagen,
    passwordActual,
    passwordNueva,
  } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const usuario = result.rows[0];

    if (!passwordActual) {
      return res.status(400).json({
        message: "Debes ingresar tu contraseña actual",
      });
    }

    const passwordValidaPerfil = await bcrypt.compare(
      passwordActual,
      usuario.password,
    );

    if (!passwordValidaPerfil) {
      return res.status(401).json({
        message: "La contraseña actual es incorrecta",
      });
    }

    const usernameExiste = await pool.query(
      "SELECT id FROM usuarios WHERE username = $1 AND id <> $2",
      [username, id],
    );

    if (usernameExiste.rows.length > 0) {
      return res.status(400).json({
        message: "Ese nombre de usuario ya está en uso",
      });
    }

    let passwordFinal = usuario.password;

    if (passwordNueva && passwordNueva.trim() !== "") {
      if (!validarPasswordSegura(passwordNueva)) {
        return res.status(400).json({
          message:
            "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial",
        });
      }

      passwordFinal = await bcrypt.hash(passwordNueva, 10);
    }

    const usuarioActualizado = await pool.query(
      `UPDATE usuarios
       SET nombre = $1,
           username = $2,
           email = $3,
           imagen = $4,
           password = $5
       WHERE id = $6
       RETURNING id,nombre,email,username,imagen,rol`,
      [
        nombre,
        username,
        email,
        imagen,
        passwordFinal,
        id,
      ],
    );

    res.json({
      message: "Perfil actualizado correctamente",
      usuario: usuarioActualizado.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Error al actualizar perfil",
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  actualizarPerfil,
  verificarUsername,
};