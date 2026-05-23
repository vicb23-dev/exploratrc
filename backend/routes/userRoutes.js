// /**
//  * Rutas de usuarios
//  * 
//  * Define los endpoints relacionados con la autenticación:
//  * - registro
//  * - login
//  * - recuperación de contraseña
//  */

// const express = require("express");
// const router = express.Router();

// // importar funciones del controlador
// const { 
//   register,
//   login,
//   forgotPassword,
//   resetPassword
// } = require("../controllers/userController");

// // rutas de la API
// router.post("/register", register);
// router.post("/login", login);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

// module.exports = router;

/**
 * Rutas de usuarios
 *
 * Define los endpoints relacionados con:
 * - registro
 * - login
 * - recuperación de contraseña
 * - perfil
 * - validación de username
 */
const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();

/**
 * Configuración de multer
 * Guarda imágenes dentro de /uploads
 */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });



// importar funciones del controlador
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  actualizarPerfil,
  verificarUsername,
} = require("../controllers/userController");

/**
 * Autenticación
 */
router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

/**
 * Perfil
 */
router.get(
  "/usuarios/verificar-username",
  verificarUsername,
);

router.put(
  "/usuarios/:id/perfil",
  actualizarPerfil,
);

/**
 * Subir imagen de perfil
 */
router.post(
  "/usuarios/upload-image",
  upload.single("imagen"),
  (req, res) => {
    try {
      const imageUrl =
        `http://192.168.1.13:5000/uploads/${req.file.filename}`;

      res.json({
        imageUrl,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Error al subir imagen",
      });
    }
  },
);

module.exports = router;