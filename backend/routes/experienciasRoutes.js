const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const { categoria } = req.query;

    const result = await pool.query(
      `
      SELECT 
        er.exp_id,
        er.exp_nombre,
        er.exp_descripcion,
        er.exp_imagen_url,
        r.rut_nombre
      FROM experiencias_rutas er
      INNER JOIN rutas r ON er.rut_id = r.rut_id
      WHERE LOWER(r.rut_nombre) = LOWER($1)
      ORDER BY er.exp_id
      `,
      [categoria]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener experiencias:", error);
    res.status(500).json({ error: "Error al obtener experiencias" });
  }
});

router.get("/:id/lugares", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        l.lug_id,
        l.lug_nombre,
        l.lug_descripcion,
        l.lug_latitud,
        l.lug_longitud,
        l.imagen_principal_url,
        el.momento,
        el.orden_en_experiencia
      FROM experiencias_lugares el
      INNER JOIN lugares l ON el.lug_id = l.lug_id
      WHERE el.exp_id = $1
      ORDER BY el.orden_en_experiencia
      `,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener lugares de experiencia:", error);
    res.status(500).json({ error: "Error al obtener lugares de experiencia" });
  }
});

module.exports = router;