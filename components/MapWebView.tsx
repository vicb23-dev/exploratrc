//Este componente encapsula el WebView y expone métodos para interactuar con Leaflet.
//Permite actualizar la ubicación del mapa y agregar marcadores dinámicamente desde React Native.
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { getLeafletHtml } from "../constants/mapHtml";

type Place = {
  lat: number;
  lng: number;
  title?: string;
};

export type MapWebViewRef = {
  setSingleMarker: (place: Place) => void;
  setMultipleMarkers: (places: Place[]) => void;
};

type Props = {
  initialLat?: number;
  initialLng?: number;
  onMapClick?: (coords: { lat: number; lng: number }) => void;
};

const MapWebView = forwardRef<MapWebViewRef, Props>(
  ({ initialLat = 25.6866, initialLng = -100.3161, onMapClick }, ref) => {
    const webviewRef = useRef<WebView>(null);
    const html = useMemo(
      () => getLeafletHtml(initialLat, initialLng, 13),
      [initialLat, initialLng],
    );

    const handleMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "map_click" && onMapClick) {
          onMapClick({ lat: data.lat, lng: data.lng });
        }
      } catch (error) {
        console.log("Error leyendo mensaje del mapa:", error);
      }
    };

    useImperativeHandle(ref, () => ({
      setSingleMarker(place: Place) {
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: "set_single_marker",
            lat: place.lat,
            lng: place.lng,
            title: place.title || "Resultado",
            zoom: 15,
          }),
        );
      },
      setMultipleMarkers(places: Place[]) {
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: "set_multiple_markers",
            places,
          }),
        );
      },
    }));

    return (
      <View style={styles.container}>
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={handleMessage}
          style={styles.webview}
        />
      </View>
    );
  },
);

export default MapWebView;

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
