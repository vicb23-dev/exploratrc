// 1. Inicializar mapa centrado en Torreón
const map = L.map("map").setView([25.5439, -103.4190], 13);

// 2. Cargar mapa base (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Arreglo para controlar los marcadores y poder borrarlos
let markers = [];

// Función para limpiar el mapa antes de cargar una nueva ruta
function limpiarMapa() {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];
}

// 3. FUNCIÓN PRINCIPAL: Cargar lugares de TU base de datos
async function cargarLugares(categoria) {
  console.log("Cargando categoría:", categoria);

  try {
    // IMPORTANTE: Cambia 'localhost' por tu IP (ej. 192.168.100.154) si pruebas en iPhone
    const response = await fetch(`http:/10.19.139.235:5000/lugares?categoria=${categoria}`);
    const datos = await response.json();

    limpiarMapa();

    datos.forEach((lugar) => {
      // Usamos los nombres de columna de la tabla: lug_latitud, lug_longitud
      const marker = L.marker([lugar.lug_latitud, lugar.lug_longitud]).addTo(map);

      marker.bindPopup(`
        <div style="text-align: center;">
          <h3 style="margin: 5px 0;">${lugar.lug_nombre}</h3>
          <p>${lugar.lug_descripcion || 'Sin descripción'}</p>
          ${lugar.imagen_principal_url ? `<img src="${lugar.imagen_principal_url}" width="150"/>` : ''}
        </div>
      `);

      markers.push(marker);
    });

    // Si hay lugares, centrar el mapa en el primero de la lista
    if (datos.length > 0) {
      map.panTo([datos[0].lug_latitud, datos[0].lug_longitud]);
    }

  } catch (error) {
    console.error("Error al conectar con la API:", error);
    alert("Error: Asegúrate de que el servidor Node.js esté corriendo.");
  }
}