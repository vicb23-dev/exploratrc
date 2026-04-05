//se crea mapController para manejar las rutas relacionadas con mapas, como búsqueda de lugares,
// geocodificación inversa y búsqueda de lugares cercanos.
const searchPlace = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Falta q" });

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "exploratrc/1.0",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error buscando lugar" });
  }
};

const reversePlace = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: "Faltan lat/lon" });

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "exploratrc/1.0",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error en reverse geocoding" });
  }
};

const nearbyPlaces = async (req, res) => {
  try {
    const { lat, lon, type = "restaurant" } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: "Faltan lat/lon" });

    const query = `
      [out:json];
      (
        node["amenity"="${type}"](around:3000,${lat},${lon});
        way["amenity"="${type}"](around:3000,${lat},${lon});
        relation["amenity"="${type}"](around:3000,${lat},${lon});
      );
      out center;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error buscando lugares cercanos" });
  }
};

module.exports = {
  searchPlace,
  reversePlace,
  nearbyPlaces,
};
