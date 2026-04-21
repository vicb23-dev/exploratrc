// Implementación del frontend para el mapa utilizando Leaflet.js.
// Este código genera un HTML que se puede cargar en un WebView de React Native para mostrar un mapa interactivo.
// El mapa se centra inicialmente en Torreón, Coahuila, pero se puede actualizar dinámicamente mediante mensajes
// enviados desde React Native.

export const getLeafletHtml = (lat = 25.5428, lng = -103.4068, zoom = 13) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet/dist/leaflet.css"
  />
  <style>
    html, body, #map {
      height: 100%;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script>
    const map = L.map("map").setView([${lat}, ${lng}], ${zoom});

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    let markers = [];

    function clearMarkers() {
      markers.forEach(marker => map.removeLayer(marker));
      markers = [];
    }

    const initialMarker = L.marker([${lat}, ${lng}]).addTo(map);
    markers.push(initialMarker);

    map.on("click", function(e) {
      const data = {
        type: "map_click",
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };

      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    });

    document.addEventListener("message", function(event) {
      const data = JSON.parse(event.data);

      if (data.type === "set_single_marker") {
        clearMarkers();

        const marker = L.marker([data.lat, data.lng]).addTo(map);

        if (data.title) {
          marker.bindPopup(data.title);
        }

        markers.push(marker);
        map.setView([data.lat, data.lng], data.zoom || 15);
      }

      if (data.type === "set_multiple_markers") {
        clearMarkers();

        data.places.forEach(place => {
          const marker = L.marker([place.lat, place.lng]).addTo(map);

          if (place.title) {
            marker.bindPopup(place.title);
          }

          markers.push(marker);
        });

        if (data.places.length > 0) {
          const first = data.places[0];
          map.setView([first.lat, first.lng], 14);
        }
      }
    });
  </script>
</body>
</html>
`;