//Funcion para la distancia
function calcularDistancia(lat1, lon1, lat2, lon2) {
const R = 6371; // radio de la tierra en km

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distancia en km
}

//funcion para calcular el tiempo
function calcularTiempo(distancia, velocidad) {
  return (distancia / velocidad) * 60; // minutos
}

// 1. Crear mapa (posición inicial temporal)
const map = L.map("map").setView([25.54, -103.44], 13);

//  2. Cargar mapa base
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

//  3. GEOLOCALIZACIÓN
navigator.geolocation.getCurrentPosition((pos) => {
  const { latitude, longitude } = pos.coords;

  // centrar mapa en usuario
  map.setView([latitude, longitude], 14);

  // opcional: marcador de tu ubicación
  L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup("Tu ubicación actual aquí ")
    .openPopup();
});

//  4. Consumir tu API (usar ubicación fija o luego dinámica)
navigator.geolocation.getCurrentPosition((pos) => {
  const { latitude, longitude } = pos.coords;

  map.setView([latitude, longitude], 14);

  L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup("Estás aquí 📍")
    .openPopup();

  // usar ubicación real en la API
  fetch(
    `http://localhost:5000/lugares?categoria=gastronomica&lat=${latitude}&lng=${longitude}`,
  )
    .then((res) => res.json())
    .then((data) => {
      data.forEach((lugar) => {
        const marker = L.marker([lugar.latitud, lugar.longitud]).addTo(map);

        marker.bindPopup(`
  <h3>${lugar.nombre}</h3>
  <img src="${lugar.imagen}" width="150"/>
  <br/>
  <button onclick='guardarFavorito(${JSON.stringify(lugar)})'>⭐ Guardar</button>
`);
      });
    });
});

let markers = [];

function limpiarMapa() {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];
}

function cargarLugares(categoria) {
  console.log("Categoría:", categoria); // 🔍 debug

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      console.log("Ubicación:", latitude, longitude); // 🔍 debug

      map.setView([latitude, longitude], 14);

      limpiarMapa();

      fetch(
        `http://localhost:5000/lugares?categoria=${categoria}&lat=${latitude}&lng=${longitude}`,
      )
        .then((res) => res.json())
        .then((data) => {
           console.log("Datos:", data); //IMPORTANTE

           data.forEach((lugar) => {
            console.log("USER:", latitude, longitude);
            console.log("LUGAR:", lugar.latitud, lugar.longitud);


            const distancia = calcularDistancia(
            latitude,
            longitude,
            lugar.latitud,
            lugar.longitud    
            );
            
            const tiempoCaminando = calcularTiempo(distancia, 5);   // km/h
            const tiempoCarro = calcularTiempo(distancia, 40);     // km/h
            
            console.log("CAMINANDO:", tiempoCaminando);
            console.log("CARRO:", tiempoCarro);
            console.log("DISTANCIA:", distancia);
            
            const marker = L.marker([lugar.latitud, lugar.longitud]).addTo(map);

          marker.bindPopup(`
          <h3>${lugar.nombre}</h3>
          <img src="${lugar.imagen}" width="150"/>
          <br/>
          Distancia: ${distancia.toFixed(2)} km
          <br/>
          Caminando: ${tiempoCaminando.toFixed(1)} min
          <br/>
          En carro: ${tiempoCarro.toFixed(1)} min
          `);

            markers.push(marker);
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    (error) => {
      console.error("Error ubicación:", error);

      // fallback si no hay ubicación
      const latitude = 25.54;
      const longitude = -103.44;

      fetch(
        `http://localhost:5000/lugares?categoria=${categoria}&lat=${latitude}&lng=${longitude}`,
      )
        .then((res) => res.json())
        .then((data) => {
          data.forEach((lugar) => {
            const marker = L.marker([lugar.latitud, lugar.longitud]).addTo(map);

            marker.bindPopup(`
            <h3>${lugar.nombre}</h3>
            <img src="${lugar.imagen}" width="150"/>
          `);

            markers.push(marker);
          });
        });
    },
  );
}
