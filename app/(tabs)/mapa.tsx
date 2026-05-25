import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ORS_API_KEY } from "../../config/keys";

import { router, useFocusEffect } from "expo-router";
import { reversePlace, searchPlace } from "../../services/api";
import MapWebView, { MapWebViewRef } from "../componentes/MapWebView";

export default function MapScreen() {
  const [query, setQuery] = useState("");

  const [userLocation, setUserLocation] = useState({
    lat: 25.5428,
    lng: -103.4068,
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  //Sesion
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  const mapRef = useRef<MapWebViewRef>(null);

    useEffect(() => {
    getCurrentLocation();
    cargarUsuario();
  }, []);

  useFocusEffect(
  useCallback(() => {
    cargarUsuario();
  }, [])
);

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "No se permitió acceder a la ubicación.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      setUserLocation({ lat, lng });
      setTimeout(() => {
        mapRef.current?.setSingleMarker({
          lat,
          lng,
          title: "Mi ubicación actual",
        });
      },800);
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener la ubicación actual.");
    } finally {
      setLoadingLocation(false);
    }
  };

    const cargarUsuario = async () => {
      try {
        const usuarioGuardado = await AsyncStorage.getItem("usuario");

        if (usuarioGuardado) {
          setUsuario(JSON.parse(usuarioGuardado));
        }
      } catch (error) {
        console.log(error);
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

      const placeLat = Number(first.lat);
      const placeLng = Number(first.lon);

      if (Number.isNaN(placeLat) || Number.isNaN(placeLng)) {
        Alert.alert(
          "Error",
          "El lugar encontrado no tiene coordenadas válidas."
        );
        return;
      }

      const orsRes = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Authorization: ORS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: [
              [userLocation.lng, userLocation.lat],
              [placeLng, placeLat],
            ],
          }),
        }
      );

      const orsData = await orsRes.json();

      console.log("ORS STATUS:", orsRes.status);
      console.log("ORS DATA:", orsData);

      if (!orsData.features || !orsData.features[0]) {
        Alert.alert("Error", "No se pudo cargar la ruta");
        return;
      }

      const coordinates =
        orsData.features[0].geometry.coordinates;

      mapRef.current?.drawSearchORSRoute({
      coordinates,
      placeLat,
      placeLng,
      placeTitle: first.display_name,
    });

    } catch (error) {
      console.log(error);
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
  //chatbot

    //Sesion 
    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("usuario");

        router.replace("/login" as any);
      } catch (error) {
        console.log(error);
      }
    };
  const handleChatbot = () => {
    router.push("/(tabs)/chatbot" as any);
  };
  const ocultarCorreo = (email: string) => {
  if (!email) return "Correo no disponible";

  const [nombre, dominio] = email.split("@");

  if (!dominio) return "Correo no disponible";

  return `${nombre.substring(0, 3)}***@${dominio}`;
};

const irPerfil = () => {
  setMenuOpen(false);
  router.push("/Perfil" as any);
};
  return (
    <SafeAreaView style={styles.container}>
      {/* //Sesion */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuOpen(true)}
      >
        <Ionicons name="menu" size={32} color="#000" />
      </TouchableOpacity>

      <MapWebView
        ref={mapRef}
        initialLat={userLocation.lat}
        initialLng={userLocation.lng}
        onMapClick={handleMapClick}
      />

      {menuOpen && (
  <View style={styles.overlay}>
    <TouchableOpacity
      style={styles.darkArea}
      onPress={() => setMenuOpen(false)}
    />

    <View style={styles.sideMenu}>
      <View style={styles.menuContent}>

        <TouchableOpacity style={styles.userBox} onPress={irPerfil}>
          <View style={styles.avatarContainer}>
            {usuario?.imagen && usuario.imagen.trim() !== "" ? (
              <Image
                source={{ uri: usuario.imagen }}
                style={styles.avatarImage}
              />
            ) : (
              <Ionicons
                name="person-circle"
                size={95}
                color="#111"
              />
            )}

            {/* Botón editar foto */}
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={irPerfil}
            >
              <Ionicons
                name="pencil"
                size={16}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* Nombre */}
          <Text style={styles.userName}>
            {usuario?.nombre || "Usuario"}
          </Text>

          {/* Username */}
          <Text style={styles.userUsername}>
            @{usuario?.username || "usuario"}
          </Text>

          {/* Correo oculto */}
          <Text style={styles.userEmail}>
            {ocultarCorreo(usuario?.email)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configButton} onPress={irPerfil}>
          <Ionicons name="settings-outline" size={24} color="#111" />
          <Text style={styles.configText}>Configuraciones</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>






  </View>
)}

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
          <Ionicons
            name="search"
            size={24}
            color="#666"
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.floatingButtons}>
        <TouchableOpacity
          style={styles.fab}
          onPress={getCurrentLocation}
          disabled={loadingLocation}
        >
          <Ionicons name="locate" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.fabChat} onPress={handleChatbot}>
          <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
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
    top: 40,
    left: 60,
    right: 15,
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

  //Sesion
menuButton: {
  position: "absolute",
  top: 45,
  left: 10,
  zIndex: 20,
  backgroundColor: "#fff",
  width: 48,
  height: 48,
  borderRadius: 14,
  justifyContent: "center",
  alignItems: "center",
  elevation: 6,

  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 6,
  shadowOffset: {
    width: 0,
    height: 3,
  },
},

overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 100,
  flexDirection: "row",
},

darkArea: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.45)",
},

sideMenu: {
  width: "78%",
  backgroundColor: "#fff",
  paddingTop: 75,
  paddingHorizontal: 22,
  paddingBottom: 35,
  justifyContent: "space-between",

  borderTopRightRadius: 25,
  borderBottomRightRadius: 25,
},

menuContent: {
  flex: 1,
},

userBox: {
  alignItems: "center",
  marginBottom: 40,
},

avatarContainer: {
  position: "relative",
},

avatarImage: {
  width: 95,
  height: 95,
  borderRadius: 48,
},

editAvatarButton: {
  position: "absolute",
  right: 0,
  bottom: 4,
  width: 34,
  height: 34,
  borderRadius: 17,
  backgroundColor: "#111",
  justifyContent: "center",
  alignItems: "center",

  elevation: 5,

  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 4,
  shadowOffset: {
    width: 0,
    height: 2,
  },
},

userName: {
  fontSize: 23,
  fontWeight: "bold",
  marginTop: 12,
  color: "#111",
},

userEmail: {
  color: "#777",
  marginTop: 5,
  fontSize: 14,
},

configButton: {
  backgroundColor: "#f3f3f3",
  height: 56,
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  gap: 10,

  marginTop: 10,
},

configText: {
  color: "#111",
  fontSize: 16,
  fontWeight: "700",
},

logoutButton: {
  backgroundColor: "#D62828",
  height: 54,
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  gap: 10,

  elevation: 3,
},

logoutText: {
  color: "#fff",
  fontSize: 17,
  fontWeight: "bold",
},
userUsername: {
  color: "#02A0C6",
  fontSize: 15,
  fontWeight: "700",
  marginTop: 4,
},



});
//Image