//Esta será la pantalla nueva del mapa.
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import MapWebView, { MapWebViewRef } from "../../components/MapWebView";
import { getNearby, reversePlace, searchPlace } from "../../services/api";

export default function MapScreen() {
  const [query, setQuery] = useState("");
  const [userLocation, setUserLocation] = useState({
    lat: 25.5428, // Torreón por defecto
    lng: -103.4068,
  });
  const [loadingLocation, setLoadingLocation] = useState(false);

  const mapRef = useRef<MapWebViewRef>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "No se permitió acceder a la ubicación. Se mostrará Torreón por defecto.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      setUserLocation({ lat, lng });

      mapRef.current?.setSingleMarker({
        lat,
        lng,
        title: "Mi ubicación",
      });
    } catch (error) {
      console.log("Error obteniendo ubicación:", error);
      Alert.alert(
        "Error",
        "No se pudo obtener la ubicación actual. Se mostrará Torreón por defecto.",
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSearch = async () => {
    try {
      if (!query.trim()) {
        Alert.alert("Aviso", "Escribe un lugar para buscar");
        return;
      }

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
      console.log("Error en búsqueda:", error);
      Alert.alert("Error", "No se pudo realizar la búsqueda");
    }
  };

  const handleMapClick = async ({ lat, lng }: { lat: number; lng: number }) => {
    try {
      const result = await reversePlace(lat, lng);
      Alert.alert("Ubicación", result.display_name || `${lat}, ${lng}`);
    } catch (error) {
      console.log("Error en reversePlace:", error);
      Alert.alert("Error", "No se pudo obtener la dirección");
    }
  };

  const handleNearby = async () => {
    try {
      const data = await getNearby(
        userLocation.lat,
        userLocation.lng,
        "restaurant",
      );

      const places = (data.elements || [])
        .map((item: any) => ({
          lat: item.lat || item.center?.lat,
          lng: item.lon || item.center?.lon,
          title: item.tags?.name || "Lugar cercano",
        }))
        .filter((p: any) => p.lat && p.lng);

      if (!places.length) {
        Alert.alert("Sin resultados", "No se encontraron lugares cercanos");
        return;
      }

      mapRef.current?.setMultipleMarkers(places);
    } catch (error) {
      console.log("Error cargando cercanos:", error);
      Alert.alert("Error", "No se pudieron cargar lugares cercanos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa</Text>
      <Text style={{ color: "red", fontSize: 22 }}>PRUEBA TORREÓN</Text>

      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="Buscar lugar"
          value={query}
          onChangeText={setQuery}
        />

        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>BUSCAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleNearby}>
          <Text style={styles.buttonText}>CERCANOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={getCurrentLocation}
          disabled={loadingLocation}
        >
          <Text style={styles.buttonText}>
            {loadingLocation ? "OBTENIENDO UBICACIÓN..." : "MI UBICACIÓN"}
          </Text>
        </TouchableOpacity>
      </View>

      <MapWebView
        ref={mapRef}
        initialLat={userLocation.lat}
        initialLng={userLocation.lng}
        onMapClick={handleMapClick}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    marginTop: 50,
    marginLeft: 20,
    marginBottom: 10,
  },
  controls: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 4,
    marginBottom: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
