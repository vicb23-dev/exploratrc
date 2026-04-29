const pool = require("../config/db");

const obtenerTransportesPorLugar = async (req, res) => {
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
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error obteniendo transportes por lugar:", error);
    res.status(500).json({
      error: "Error al obtener transportes del lugar",
    });
  }
};

module.exports = { obtenerTransportesPorLugar };