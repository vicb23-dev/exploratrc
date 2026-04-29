const { GoogleGenAI } = require("@google/genai");
const pool = require("../config/db");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const extraerPreferencias = async (mensaje) => {
  try {
    const prompt = `
Extrae las preferencias del usuario para una ruta turística.
Responde SOLO en JSON válido.

{
  "categoria": "cultura | gastronomica | entretenimiento | familiar | night | cualquiera",
  "presupuesto": "bajo | medio | alto | cualquiera",
  "tiempo": número de horas o null
}

Mensaje: "${mensaje}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const texto = response.text.replace(/```json|```/g, "").trim();
    return JSON.parse(texto);
  } catch (error) {
    console.log("Gemini falló, usando modo local:", error.message);

    const texto = mensaje.toLowerCase();

    let categoria = "cualquiera";
    if (texto.includes("cultural") || texto.includes("cultura"))
      categoria = "cultura";
    if (texto.includes("gastronom")) categoria = "gastronomica";
    if (texto.includes("entretenimiento")) categoria = "entretenimiento";
    if (texto.includes("familiar") || texto.includes("familia"))
      categoria = "familiar";
    if (texto.includes("night") || texto.includes("noche")) categoria = "night";

    let presupuesto = "cualquiera";
    if (
      texto.includes("barata") ||
      texto.includes("barato") ||
      texto.includes("bajo")
    )
      presupuesto = "bajo";
    if (texto.includes("medio")) presupuesto = "medio";
    if (texto.includes("alto") || texto.includes("caro")) presupuesto = "alto";

    const matchTiempo = texto.match(/(\d+)\s*(hora|horas)/);
    const tiempo = matchTiempo ? parseInt(matchTiempo[1]) : null;

    return {
      categoria,
      presupuesto,
      tiempo,
    };
  }
};

const calcularScore = (lugar, preferencias) => {
  let score = 0;

  const categoriaLugar = (
    lugar.categoria ||
    lugar.rut_nombre ||
    ""
  ).toLowerCase();

  if (
    preferencias.categoria &&
    preferencias.categoria !== "cualquiera" &&
    categoriaLugar.includes(preferencias.categoria.toLowerCase())
  ) {
    score += 5;
  }

  if (preferencias.presupuesto === "bajo") score += 3;
  if (preferencias.presupuesto === "medio") score += 2;
  if (preferencias.presupuesto === "alto") score += 1;

  if (preferencias.tiempo) {
    if (preferencias.tiempo <= 2) score += 2;
    if (preferencias.tiempo > 2) score += 3;
  }

  return score;
};

const chatbot = async (req, res) => {
  const { mensaje } = req.body;

  try {
    const preferencias = await extraerPreferencias(mensaje);

    const result = await pool.query(`
      SELECT 
        l.lug_id,
        l.lug_nombre,
        l.lug_descripcion,
        l.lug_latitud,
        l.lug_longitud,
        r.rut_nombre
      FROM lugares l
      LEFT JOIN lugares_rutas lr ON l.lug_id = lr.lug_id
      LEFT JOIN rutas r ON lr.rut_id = r.rut_id
    `);

    const lugaresConScore = result.rows.map((lugar) => ({
      ...lugar,
      score: calcularScore(lugar, preferencias),
    }));

    const recomendados = lugaresConScore
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    const nombres = recomendados.map((l) => l.lug_nombre).join(", ");

    res.json({
      respuesta: `Te recomiendo esta ruta: ${nombres}. Esta recomendación se generó según tus intereses, presupuesto y tiempo disponible.`,
      preferencias,
      lugares: recomendados,
    });
  } catch (error) {
    console.error("ERROR CHATBOT:", error);

    if (error.status === 429) {
      return res.json({
        respuesta:
          "El asistente alcanzó el límite gratuito de Gemini. Intenta de nuevo en unos segundos.",
      });
    }

    res.status(500).json({
      error: "Error en chatbot",
      detalle: error.message,
    });
  }
};

module.exports = {
  chatbot,
};
