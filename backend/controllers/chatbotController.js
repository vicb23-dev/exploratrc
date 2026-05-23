const { GoogleGenAI } = require("@google/genai");
const pool = require("../config/db");

// Configuración de Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
//gemini
/**
 * Normaliza texto:
 * - Convierte a minúsculas
 * - Quita acentos
 */
const normalizarTexto = (texto) => {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

/**
 * Busca palabras completas.
 * Evita que "barata" se detecte como "bar".
 */
const contienePalabra = (texto, palabra) => {
  const regex = new RegExp(`\\b${palabra}\\b`, "i");
  return regex.test(texto);
};

/**
 * Detecta si el usuario solamente está saludando.
 */
const esSaludo = (mensaje) => {
  const texto = normalizarTexto(mensaje).trim();

  return ["hola", "holaa", "buenas", "hey", "ola"].includes(texto);
};

/**
 * Decide si vale la pena usar Gemini.
 * Si el mensaje ya se entiende localmente, se ahorran tokens.
 */
  const debeUsarGemini = (mensaje) => {
  const texto = normalizarTexto(mensaje).trim();
  const palabras = texto.split(/\s+/);

  // Mensajes muy simples: local
  const mensajesSimples = [
    "gastronomica",
    "gastronomia",
    "cultura",
    "cultural",
    "entretenimiento",
    "familiar",
    "night",
    "noche",
  ];

  if (mensajesSimples.includes(texto)) {
    return false;
  }

  // Saludos: local
  if (esSaludo(mensaje)) {
    return false;
  }

  // Si el usuario escribe algo más natural, usa Gemini
  if (palabras.length >= 4) {
    return true;
  }

  // Si pide algo con intención más humana, usa Gemini
  const frasesIA = [
    "quiero",
    "me gustaria",
    "recomienda",
    "recomendacion",
    "plan",
    "salir",
    "ir con",
    "para mi",
    "con mi",
    "no se",
    "algo",
    "opcion",
    "opciones",
  ];

  const requiereIA = frasesIA.some((frase) => texto.includes(frase));

  if (requiereIA) {
    return true;
  }

  // Si solo menciona categoría o palabra clave, local
  return false;
};

/**
 * Extrae preferencias SIN IA.
 * Funciona rápido y no consume tokens.
 */
const extraerPreferenciasLocal = (mensaje) => {
  const texto = normalizarTexto(mensaje);

  let categoria = "cualquiera";

  if (contienePalabra(texto, "cultura") || contienePalabra(texto, "cultural"))
    categoria = "cultura";

  if (
    texto.includes("gastronom") ||
    contienePalabra(texto, "comida") ||
    contienePalabra(texto, "comer") ||
    contienePalabra(texto, "restaurante") ||
    contienePalabra(texto, "restaurantes")
  )
    categoria = "gastronomica";

  if (
    contienePalabra(texto, "entretenimiento") ||
    contienePalabra(texto, "divertido") ||
    contienePalabra(texto, "diversion")
  )
    categoria = "entretenimiento";

  if (contienePalabra(texto, "familia") || contienePalabra(texto, "familiar"))
    categoria = "familiar";

  if (
    contienePalabra(texto, "night") ||
    contienePalabra(texto, "noche") ||
    contienePalabra(texto, "bar") ||
    contienePalabra(texto, "bares") ||
    contienePalabra(texto, "antro") ||
    contienePalabra(texto, "antros")
  )
    categoria = "night";

  let presupuesto = "cualquiera";

  if (
    contienePalabra(texto, "barata") ||
    contienePalabra(texto, "barato") ||
    contienePalabra(texto, "bajo") ||
    contienePalabra(texto, "economico") ||
    contienePalabra(texto, "gratis")
  )
    presupuesto = "bajo";

  if (contienePalabra(texto, "medio") || contienePalabra(texto, "normal"))
    presupuesto = "medio";

  if (
    contienePalabra(texto, "caro") ||
    contienePalabra(texto, "premium") ||
    contienePalabra(texto, "alto") ||
    contienePalabra(texto, "lujo")
  )
    presupuesto = "alto";

  const matchTiempo = texto.match(/(\d+)\s*(hora|horas|hr|hrs)/);
  const tiempo = matchTiempo ? parseInt(matchTiempo[1]) : null;

  let ambiente = "cualquiera";

  if (contienePalabra(texto, "tranquilo") || contienePalabra(texto, "relajado"))
    ambiente = "tranquilo";

  if (contienePalabra(texto, "divertido") || contienePalabra(texto, "diversion"))
    ambiente = "divertido";

  if (contienePalabra(texto, "romantico") || contienePalabra(texto, "pareja"))
    ambiente = "romantico";

  if (contienePalabra(texto, "aventura")) ambiente = "aventura";

  if (contienePalabra(texto, "familia") || contienePalabra(texto, "familiar"))
    ambiente = "familiar";

  let transporte = "cualquiera";

  if (contienePalabra(texto, "camion") || contienePalabra(texto, "transporte"))
    transporte = "camion";

  if (contienePalabra(texto, "caminando") || contienePalabra(texto, "caminar"))
    transporte = "caminando";

  if (contienePalabra(texto, "auto") || contienePalabra(texto, "carro"))
    transporte = "auto";

  let interes = "cualquiera";

  if (contienePalabra(texto, "museo")) interes = "museo";

  if (
    contienePalabra(texto, "comida") ||
    contienePalabra(texto, "comer") ||
    contienePalabra(texto, "restaurante") ||
    contienePalabra(texto, "restaurantes")
  )
    interes = "comida";

  if (contienePalabra(texto, "parque") || contienePalabra(texto, "bosque"))
    interes = "parque";

  if (
    contienePalabra(texto, "bar") ||
    contienePalabra(texto, "bares") ||
    contienePalabra(texto, "antro") ||
    contienePalabra(texto, "antros")
  )
    interes = "bar";

  if (contienePalabra(texto, "historia") || contienePalabra(texto, "historico"))
    interes = "historia";

  if (contienePalabra(texto, "compras") || contienePalabra(texto, "plaza"))
    interes = "compras";

  return {
    categoria,
    presupuesto,
    tiempo,
    ambiente,
    transporte,
    interes,
  };
};

/**
 * Usa Gemini solo si el mensaje es ambiguo.
 * Si el mensaje es simple, usa modo local para ahorrar tokens.
 */
const extraerPreferencias = async (mensaje) => {
  const preferenciasLocales = extraerPreferenciasLocal(mensaje);

  if (!debeUsarGemini(mensaje)) {
    return preferenciasLocales;
  }

  try {
    const prompt = `
Eres un asistente turístico inteligente de la app Explora TRC.

Analiza el mensaje del usuario y extrae sus preferencias turísticas.

Responde SOLO JSON válido, sin explicaciones.

Valores permitidos:

categoria:
"cultura", "gastronomica", "entretenimiento", "familiar", "night", "cualquiera"

presupuesto:
"bajo", "medio", "alto", "cualquiera"

ambiente:
"tranquilo", "divertido", "romantico", "familiar", "aventura", "cualquiera"

transporte:
"camion", "caminando", "auto", "cualquiera"

interes:
"museo", "comida", "parque", "bar", "historia", "compras", "cualquiera"

tiempo:
número de horas o null.

Reglas:
- Si el usuario menciona cena, comer, restaurante o comida, usa categoria "gastronomica".
- Si menciona bares, antros, noche, cocteles o karaoke, usa categoria "night".
- Si menciona niños, familia o plan familiar, usa categoria "familiar".
- Si menciona museos, historia o cultura, usa categoria "cultura".
- Si menciona diversión, juegos, pintura, cine o entretenimiento, usa categoria "entretenimiento".
- Si no estás seguro, usa "cualquiera".
- No inventes valores fuera de los permitidos.

Formato exacto:
{
  "categoria": "cualquiera",
  "presupuesto": "cualquiera",
  "tiempo": null,
  "ambiente": "cualquiera",
  "transporte": "cualquiera",
  "interes": "cualquiera"
}

Mensaje del usuario:
"${mensaje}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const texto = response.text.replace(/```json|```/g, "").trim();
    const preferenciasGemini = JSON.parse(texto);

    return {
      ...preferenciasLocales,
      ...preferenciasGemini,
    };
  } catch (error) {
    console.log("Gemini falló, usando modo local:", error.message);
    return preferenciasLocales;
  }
};

/**
 * Calcula qué tan recomendable es un lugar.
 * Entre mayor score, más relevante.
 */
const calcularScore = (lugar, preferencias) => {
  let score = 0;

  const categoria = normalizarTexto(lugar.rut_nombre);
  const tags = normalizarTexto(lugar.lug_tags);
  const descripcion = normalizarTexto(lugar.lug_descripcion);
  const nombre = normalizarTexto(lugar.lug_nombre);

  /**
   * Coincidencia de categoría.
   * Ejemplo:
   * "gastronomica" coincide con "Gastronómica".
   */
  if (preferencias.categoria !== "cualquiera") {
    if (categoria.includes(normalizarTexto(preferencias.categoria))) {
      score += 10;
    } else {
      score -= 100;
    }
  }

  /**
   * Coincidencia por intereses.
   */
  if (
    preferencias.interes !== "cualquiera" &&
    (tags.includes(preferencias.interes) ||
      descripcion.includes(preferencias.interes) ||
      nombre.includes(preferencias.interes))
  ) {
    score += 6;
  }

  /**
   * Coincidencia por ambiente.
   */
  if (
    preferencias.ambiente !== "cualquiera" &&
    (tags.includes(preferencias.ambiente) ||
      descripcion.includes(preferencias.ambiente))
  ) {
    score += 4;
  }

  /**
   * Presupuesto sin campo de precio.
   * Se calcula con palabras en tags o descripción.
   */
  if (preferencias.presupuesto === "bajo") {
    if (
      tags.includes("barato") ||
      tags.includes("economico") ||
      tags.includes("gratis") ||
      descripcion.includes("gratis") ||
      descripcion.includes("economico")
    ) {
      score += 6;
    } else {
      score += 1;
    }
  }

  if (preferencias.presupuesto === "medio") {
    score += 2;
  }

  if (preferencias.presupuesto === "alto") {
    if (
      tags.includes("premium") ||
      tags.includes("lujo") ||
      tags.includes("caro") ||
      descripcion.includes("premium") ||
      descripcion.includes("lujo")
    ) {
      score += 6;
    } else {
      score += 1;
    }
  }

  /**
   * Tiempo disponible.
   */
  if (preferencias.tiempo) {
    if (preferencias.tiempo <= 2) score += 2;
    if (preferencias.tiempo > 2 && preferencias.tiempo <= 4) score += 3;
    if (preferencias.tiempo > 4) score += 4;
  }

  /**
   * Transporte disponible.
   */
  if (preferencias.transporte !== "cualquiera" && lugar.transportes) {
    const transportesTexto = normalizarTexto(JSON.stringify(lugar.transportes));

    if (transportesTexto.includes(preferencias.transporte)) {
      score += 3;
    }
  }

  if (lugar.imagen_principal_url) score += 1;

  return score;
};

/**
 * Genera el texto que se muestra en el chat.
 */
const generarRespuestaFinal = (recomendados, preferencias) => {
  if (!recomendados || recomendados.length === 0) {
    return `
No encontré lugares que coincidan con tu búsqueda.
Intenta con otra categoría o revisa que existan lugares asociados a esa ruta.
`;
  }

  const lugaresTexto = recomendados
    .slice(0, 4)
    .map((lugar, index) => {
      return `
${index + 1}. ${lugar.lug_nombre}
Ruta: ${lugar.rut_nombre || "Sin ruta"}
${lugar.lug_descripcion || "Sin descripción"}
`;
    })
    .join("\n");

  return `
Te preparé una ruta personalizada:

${lugaresTexto}

Preferencias detectadas:
Categoría: ${preferencias.categoria}
Presupuesto: ${preferencias.presupuesto}
Tiempo: ${preferencias.tiempo || "Flexible"} horas
`;
};

const generarRespuestaConGemini = async (mensaje, recomendados, preferencias) => {
  try {
    const lugaresResumen = recomendados.slice(0, 5).map((lugar, index) => ({
      numero: index + 1,
      nombre: lugar.lug_nombre,
      ruta: lugar.rut_nombre,
      descripcion: lugar.lug_descripcion,
      tags: lugar.lug_tags,
    }));

    const prompt = `
Eres el asistente turístico de Explora TRC.

Responde de forma natural, breve y útil.
No inventes lugares.
Usa únicamente estos lugares recomendados.

Mensaje del usuario:
"${mensaje}"

Preferencias detectadas:
${JSON.stringify(preferencias)}

Lugares disponibles:
${JSON.stringify(lugaresResumen)}

Genera una respuesta amigable recomendando la ruta.
Máximo 120 palabras.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.log("Gemini falló al redactar respuesta:", error.message);
    return null;
  }
};

/**
 * Controlador principal del chatbot.
 */
const chatbot = async (req, res) => {
  const { mensaje } = req.body;

  try {
    if (!mensaje || !mensaje.trim()) {
      return res.json({
        respuesta: "Escribe qué tipo de ruta te gustaría conocer.",
        preferencias: null,
        lugares: [],
      });
    }

    if (esSaludo(mensaje)) {
      return res.json({
        respuesta:
          "Hola, soy tu asistente de Explora TRC. Puedo ayudarte a encontrar rutas culturales, gastronómicas, familiares, de entretenimiento o nocturnas. Dime qué tipo de plan buscas, tu presupuesto y cuánto tiempo tienes.",
        preferencias: null,
        lugares: [],
      });
    }

    const preferencias = await extraerPreferencias(mensaje);

    const result = await pool.query(`
      SELECT 
        l.lug_id,
        l.lug_nombre,
        l.lug_descripcion,
        l.lug_latitud,
        l.lug_longitud,
        l.imagen_principal_url,
        l.lug_tags,

        r.rut_id,
        r.rut_nombre,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'tp_id', tp.tp_id,
              'tp_nombre', tp.tp_nombre
            )
          ) FILTER (
            WHERE tp.tp_id IS NOT NULL
          ),
          '[]'
        ) AS transportes

      FROM lugares l

      LEFT JOIN lugares_rutas lr
        ON l.lug_id = lr.lug_id

      LEFT JOIN rutas r
        ON lr.rut_id = r.rut_id

      LEFT JOIN transportes_lugares tl
        ON l.lug_id = tl.lug_id

      LEFT JOIN transportes_publicos tp
        ON tl.tp_id = tp.tp_id

      GROUP BY
        l.lug_id,
        r.rut_id
    `);

    let lugaresFiltrados = result.rows;

    /**
     * Filtro fuerte por categoría.
     * Si pide gastronómica, solo devuelve lugares de Gastronómica.
     */
    if (preferencias.categoria !== "cualquiera") {
      lugaresFiltrados = result.rows.filter((lugar) => {
        const ruta = normalizarTexto(lugar.rut_nombre);
        const categoriaBuscada = normalizarTexto(preferencias.categoria);

        return ruta.includes(categoriaBuscada);
      });
    }

    /**
     * Elimina lugares repetidos.
     */
    const lugaresUnicos = [];

    lugaresFiltrados.forEach((lugar) => {
      const existe = lugaresUnicos.find((item) => item.lug_id === lugar.lug_id);

      if (!existe) {
        lugaresUnicos.push(lugar);
      }
    });

    const lugaresConScore = lugaresUnicos.map((lugar) => ({
      ...lugar,
      score: calcularScore(lugar, preferencias),
    }));

    const limite = preferencias.tiempo ? Math.min(preferencias.tiempo * 2, 8) : 5;

    const recomendados = lugaresConScore
      .sort((a, b) => b.score - a.score)
      .slice(0, limite);

    let modo = "local";

    let respuestaFinal = await generarRespuestaConGemini(
      mensaje,
      recomendados,
      preferencias
    );

    if (respuestaFinal) {
      modo = "gemini";
    } else {
      respuestaFinal = generarRespuestaFinal(recomendados, preferencias);
    }

    res.json({
      respuesta: respuestaFinal,
      preferencias,
      lugares: recomendados,
      modo,
    });


  } catch (error) {
    console.error("ERROR CHATBOT:", error);

    res.status(500).json({
      error: "Error en chatbot",
      detalle: error.message,
      respuesta: "Ocurrió un error al generar la recomendación.",
      lugares: [],
    });
  }
};

module.exports = {
  chatbot,
};