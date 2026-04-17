const pool = require("../config/db");

const obtenerPorCategoria = async (req, res) => {
  const { categoria } = req.query;

  try {
    const result = await pool.query(`
      SELECT 
        l.lug_id,
        l.lug_nombre,
        l.lug_descripcion,
        l.imagen_principal_url,
        l.lug_latitud,
        l.lug_longitud
      FROM lugares l
      JOIN lugares_rutas lr ON l.lug_id = lr.lug_id
      JOIN rutas r ON r.rut_id = lr.rut_id
      WHERE r.rut_nombre ILIKE $1
      ORDER BY lr.orden_en_ruta
    `, [categoria]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener lugares" });
  }
};

module.exports = { obtenerPorCategoria };