//Esta será la pantalla nueva del mapa.
import React, { useRef, useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import MapWebView, { MapWebViewRef } from "../components/MapWebView";
import { getNearby, reversePlace, searchPlace } from "../services/api";

export default function MapScreen() {
  const [query, setQuery] = useState("");
  const mapRef = useRef<MapWebViewRef>(null);

  const handleSearch = async () => {
    try {
      const results = await searchPlace(query);

      if (!results.length) {
        Alert.alert("Sin resultados", "No se encontró ningún lugar");
        return;
      }

      const first = results[0];

      mapRef.current?.setSingleMarker({
        lat: Number(first.lat),
        lng: Number(first.lon),
        title: first.display_name,
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo realizar la búsqueda");
    }
  };

  const handleMapClick = async ({ lat, lng }: { lat: number; lng: number }) => {
    try {
      const result = await reversePlace(lat, lng);
      Alert.alert("Ubicación", result.display_name || `${lat}, ${lng}`);
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener la dirección");
    }
  };

  const handleNearby = async () => {
    try {
      const data = await getNearby(25.6866, -100.3161, "restaurant");

      const places = (data.elements || [])
        .map((item: any) => ({
          lat: item.lat || item.center?.lat,
          lng: item.lon || item.center?.lon,
          title: item.tags?.name || "Lugar cercano",
        }))
        .filter((p: any) => p.lat && p.lng);

      mapRef.current?.setMultipleMarkers(places);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar lugares cercanos");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="Buscar lugar"
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Buscar" onPress={handleSearch} />
        <Button title="Cercanos" onPress={handleNearby} />
      </View>

      <MapWebView
        ref={mapRef}
        initialLat={25.6866}
        initialLng={-100.3161}
        onMapClick={handleMapClick}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    padding: 12,
    gap: 8,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 42,
  },
});
