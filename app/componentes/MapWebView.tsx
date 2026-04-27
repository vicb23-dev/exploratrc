import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

type RouteMarker = {
  id: number;
  lat: number;
  lng: number;
  title: string;
};

type UserLocation = {
  lat: number;
  lng: number;
} | null;

type SetRouteMarkersData = {
  markers: RouteMarker[];
  activeIndex: number;
  userLocation?: UserLocation;
};

export type MapWebViewRef = {
  setRouteMarkers: (data: SetRouteMarkersData) => void;
};

type Props = {
  initialLat: number;
  initialLng: number;
};

const MapWebView = forwardRef<MapWebViewRef, Props>(
  ({ initialLat, initialLng }, ref) => {
    const webViewRef = useRef<WebView>(null);
    const [mapReady, setMapReady] = useState(false);
    const pendingData = useRef<SetRouteMarkersData | null>(null);

    const sendRouteToMap = (data: SetRouteMarkersData) => {
      const jsCode = `
        if (window.setRouteMarkers) {
          window.setRouteMarkers(${JSON.stringify(data)});
        }
        true;
      `;

      webViewRef.current?.injectJavaScript(jsCode);
    };

    useImperativeHandle(ref, () => ({
      setRouteMarkers(data) {
        pendingData.current = data;

        if (mapReady) {
          sendRouteToMap(data);
        }
      },
    }));

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta 
            name="viewport" 
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" 
          />

          <link 
            rel="stylesheet" 
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          />

          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

          <style>
            html, body, #map {
              height: 100%;
              width: 100%;
              margin: 0;
              padding: 0;
            }

            .marker-normal {
              width: 18px;
              height: 18px;
              background: #2563eb;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            }

            .marker-active {
              width: 34px;
              height: 34px;
              background: #7B2CBF;
              border: 4px solid white;
              border-radius: 50%;
              box-shadow: 0 3px 12px rgba(0,0,0,0.45);
            }

            .marker-user {
              width: 26px;
              height: 26px;
              background: #00b4d8;
              border: 4px solid white;
              border-radius: 50%;
              box-shadow: 0 3px 10px rgba(0,0,0,0.35);
            }
          </style>
        </head>

        <body>
          <div id="map"></div>

          <script>
            var map = L.map("map").setView([${initialLat}, ${initialLng}], 15);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
              attribution: "© OpenStreetMap"
            }).addTo(map);

            var routeLine = null;
            var userToActiveLine = null;
            var routeMarkers = [];
            var userMarker = null;

            function createNormalIcon() {
              return L.divIcon({
                className: "",
                html: '<div class="marker-normal"></div>',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              });
            }

            function createActiveIcon() {
              return L.divIcon({
                className: "",
                html: '<div class="marker-active"></div>',
                iconSize: [42, 42],
                iconAnchor: [21, 21]
              });
            }

            function createUserIcon() {
              return L.divIcon({
                className: "",
                html: '<div class="marker-user"></div>',
                iconSize: [34, 34],
                iconAnchor: [17, 17]
              });
            }

            function limpiarMapa() {
              routeMarkers.forEach(function(marker) {
                map.removeLayer(marker);
              });

              routeMarkers = [];

              if (routeLine) {
                map.removeLayer(routeLine);
                routeLine = null;
              }

              if (userToActiveLine) {
                map.removeLayer(userToActiveLine);
                userToActiveLine = null;
              }

              if (userMarker) {
                map.removeLayer(userMarker);
                userMarker = null;
              }
            }

            window.setRouteMarkers = function(data) {
              limpiarMapa();

              if (!data || !data.markers || data.markers.length === 0) {
                return;
              }

              var path = data.markers.map(function(marker) {
                return [marker.lat, marker.lng];
              });

              routeLine = L.polyline(path, {
                color: "#7B2CBF",
                weight: 5,
                opacity: 0.95
              }).addTo(map);

              data.markers.forEach(function(item, index) {
                var isActive = index === data.activeIndex;

                var marker = L.marker([item.lat, item.lng], {
                  icon: isActive ? createActiveIcon() : createNormalIcon()
                })
                  .addTo(map)
                  .bindPopup(item.title);

                routeMarkers.push(marker);
              });

              var active = data.markers[data.activeIndex];

              if (data.userLocation) {
                userMarker = L.marker(
                  [data.userLocation.lat, data.userLocation.lng],
                  {
                    icon: createUserIcon()
                  }
                )
                  .addTo(map)
                  .bindPopup("Mi ubicación");

                if (active) {
                  userToActiveLine = L.polyline(
                    [
                      [data.userLocation.lat, data.userLocation.lng],
                      [active.lat, active.lng]
                    ],
                    {
                      color: "#00b4d8",
                      weight: 4,
                      opacity: 0.9,
                      dashArray: "8, 8"
                    }
                  ).addTo(map);
                }
              }

              var groupLayers = [];

              routeMarkers.forEach(function(marker) {
                groupLayers.push(marker);
              });

              if (routeLine) {
                groupLayers.push(routeLine);
              }

              if (userMarker) {
                groupLayers.push(userMarker);
              }

              if (userToActiveLine) {
                groupLayers.push(userToActiveLine);
              }

              if (groupLayers.length > 0) {
                var group = L.featureGroup(groupLayers);

                map.fitBounds(group.getBounds(), {
                  padding: [35, 35]
                });
              }

              if (active) {
                setTimeout(function() {
                  map.panTo([active.lat, active.lng]);
                }, 300);
              }
            };

            setTimeout(function() {
              window.ReactNativeWebView.postMessage("MAP_READY");
            }, 700);
          </script>
        </body>
      </html>
    `;

    return (
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={(event) => {
            if (event.nativeEvent.data === "MAP_READY") {
              setMapReady(true);

              if (pendingData.current) {
                setTimeout(() => {
                  sendRouteToMap(pendingData.current!);
                }, 300);
              }
            }
          }}
        />
      </View>
    );
  }
);

export default MapWebView;

const styles = StyleSheet.create({
  container: {
    height: 260,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
});