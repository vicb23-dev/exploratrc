const pool = require("../config/db");

// Obtener favoritos por usuario
const obtenerFavoritos = async (req, res) => {
  const { usu_id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        l.lug_id,
        l.lug_nombre,
        l.lug_descripcion,
        l.lug_latitud,
        l.lug_longitud,
        l.imagen_principal_url,
        r.rut_nombre,
        r.rut_color
      FROM favoritos f
      INNER JOIN lugares l ON f.lug_id = l.lug_id
      INNER JOIN lugares_rutas lr ON l.lug_id = lr.lug_id
      INNER JOIN rutas r ON lr.rut_id = r.rut_id
      WHERE f.usu_id = $1
      ORDER BY r.rut_nombre ASC, l.lug_nombre ASC
      `,
      [usu_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
};

// Agregar favorito
const agregarFavorito = async (req, res) => {
  const { usu_id, lug_id } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO favoritos (usu_id, lug_id)
      VALUES ($1, $2)
      ON CONFLICT (usu_id, lug_id) DO NOTHING
      `,
      [usu_id, lug_id]
    );

    res.json({ mensaje: "Lugar agregado a favoritos" });
  } catch (error) {
    console.error("Error al agregar favorito:", error);
    res.status(500).json({ error: "Error al agregar favorito" });
  }
};

// Eliminar favorito
const eliminarFavorito = async (req, res) => {
  const { usu_id, lug_id } = req.params;

  try {
    await pool.query(
      `
      DELETE FROM favoritos
      WHERE usu_id = $1 AND lug_id = $2
      `,
      [usu_id, lug_id]
    );

    res.json({ mensaje: "Lugar eliminado de favoritos" });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
};

module.exports = {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito,
};