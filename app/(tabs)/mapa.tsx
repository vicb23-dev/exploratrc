import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import MapWebView, { MapWebViewRef } from "../../components/MapWebView";
import { getNearby, reversePlace, searchPlace } from "../../services/api";

export default function MapScreen() {
  const [query, setQuery] = useState("");
  const [userLocation, setUserLocation] = useState({
    lat: 25.5428,
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
          "No se permitió acceder a la ubicación."
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
      Alert.alert("Error", "No se pudo obtener la ubicación actual.");
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
      const data = await getNearby(userLocation.lat, userLocation.lng, "restaurant");

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
      Alert.alert("Error", "No se pudieron cargar lugares cercanos");
    }
  };

  const handleChatbot = () => {
    Alert.alert("Chatbot", "Aquí irá el asistente virtual 🤖");
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapWebView
        ref={mapRef}
        initialLat={userLocation.lat}
        initialLng={userLocation.lng}
        onMapClick={handleMapClick}
      />

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar lugar..."
          placeholderTextColor="#777"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      {/* Botones flotantes */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity style={styles.fab} onPress={handleNearby}>
          <Ionicons name="restaurant" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fab}
          onPress={getCurrentLocation}
          disabled={loadingLocation}
        >
          <Ionicons name="locate" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.fabChat} onPress={handleChatbot}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchContainer: {
    position: "absolute",
    top: 15,
    left: 70,   // deja libre la esquina del zoom
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 52,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  searchIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
  },

  floatingButtons: {
    position: "absolute",
    bottom: 30,
    right: 20,
    gap: 12,
  },

  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  fabChat: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});