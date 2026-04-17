const pool = require("../config/db");

const obtenerLugarPorId = async (req, res) => {
  const { id } = req.params;

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
        l.lug_tags,
        lr.rut_id,
        r.rut_nombre AS categoria,
        lr.orden_en_ruta
      FROM lugares l
      LEFT JOIN lugares_rutas lr ON l.lug_id = lr.lug_id
      LEFT JOIN rutas r ON lr.rut_id = r.rut_id
      WHERE l.lug_id = $1
      `,
      [id]
    );

    console.log("ID recibido:", id);
    console.log("RESULTADO SQL:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lugar no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.log("ERROR EN obtenerLugarPorId:", error);
    res.status(500).json({ error: "Error servidor" });
  }
};

module.exports = { obtenerLugarPorId };