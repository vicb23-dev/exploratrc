//Implementación del frontend para el mapa utilizando Leaflet.js.
//Este código genera un HTML que se puede cargar en un WebView de React Native para mostrar un mapa interactivo.
//El mapa se centra inicialmente en Monterrey, México, pero se puede actualizar dinámicamente mediante mensajes
//enviados desde React Native.
export const getLeafletHtml = (lat = 25.6866, lng = -100.3161, zoom = 13) => `
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
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />
  <style>
    html, body, #map {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
    }

    .leaflet-container {
      font-family: Arial, sans-serif;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map').setView([${lat}, ${lng}], ${zoom});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let markers = [];

    function clearMarkers() {
      markers.forEach(marker => map.removeLayer(marker));
      markers = [];
    }

    function addMarker(lat, lng, title = 'Ubicación') {
      const marker = L.marker([lat, lng]).addTo(map).bindPopup(title);
      markers.push(marker);
      return marker;
    }

    addMarker(${lat}, ${lng}, 'Punto inicial');

    map.on('click', function(e) {
      const payload = {
        type: 'map_click',
        lat: e.latlng.lat,
        lng: e.latlng.lng
      };

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(payload));
      }
    });

    function handleMessage(event) {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'set_center') {
          map.setView([data.lat, data.lng], data.zoom || 15);
        }

        if (data.type === 'set_single_marker') {
          clearMarkers();
          addMarker(data.lat, data.lng, data.title || 'Resultado');
          map.setView([data.lat, data.lng], data.zoom || 15);
        }

        if (data.type === 'set_multiple_markers') {
          clearMarkers();
          const bounds = [];

          data.places.forEach(place => {
            const marker = addMarker(place.lat, place.lng, place.title || 'Lugar');
            bounds.push([place.lat, place.lng]);
          });

          if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [40, 40] });
          }
        }
      } catch (error) {
        console.log('Error parsing message:', error);
      }
    }

    document.addEventListener('message', handleMessage);
    window.addEventListener('message', handleMessage);
  </script>
</body>
</html>
`;
