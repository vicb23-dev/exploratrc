import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import API, { getTransportesPorLugar } from "../../services/api";

type LugarDetalle = {
  lug_id: number;
  lug_nombre: string;
  lug_descripcion: string;
  lug_latitud: number;
  lug_longitud: number;
  imagen_principal_url: string;
  lug_tags: string;
  categoria: string;
};

type Transporte = {
  tp_id: number;
  tp_nombre: string;
  tp_tipo: string;
  tp_color: string;
  tp_descripcion: string;
};

function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calcularTiempo(distancia: number, velocidad: number) {
  return (distancia / velocidad) * 60;
}

export default function detallesLugar() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [lugar, setLugar] = useState<LugarDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [transportes, setTransportes] = useState<Transporte[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const obtenerUbicacionUsuario = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permiso de ubicación denegado");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      console.log("Error obteniendo ubicación:", error);
    }
  };

  useEffect(() => {
    obtenerUbicacionUsuario();

    if (id) {
      obtenerDetalleLugar();
      obtenerTransportes();
    }
  }, [id]);

  const obtenerDetalleLugar = async () => {
    try {
      const res = await API.get(`/lugares/${id}`);
      setLugar(res.data);
    } catch (error) {
      console.log("Error al obtener lugar:", error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerTransportes = async () => {
    try {
      const data = await getTransportesPorLugar(id);
      setTransportes(data);
    } catch (error) {
      console.log("Error transportes:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!lugar) {
    return (
      <View style={styles.center}>
        <Text>No se encontró el lugar</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: lugar.imagen_principal_url }}
            style={styles.image}
          />

         {/*Flecha de regreso */}
          <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (lugar.categoria === "Cultura") {
              router.replace("/(tabs)/rutaCultura");
            } else if (lugar.categoria === "Gastronomica") {
              router.replace("/(tabs)/rutaGastronomica");
            } else if (lugar.categoria === "Entretenimiento") {
              router.replace("/(tabs)/rutaEntretenimiento");
            } else if (lugar.categoria === "Night") {
              router.replace("/(tabs)/rutaNight");
            } else if (lugar.categoria === "Familiar") {
              router.replace("/(tabs)/rutaFamiliar");
            } else {
              router.replace("/(tabs)/rutas");
            }
          }}
        >
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>




        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{lugar.lug_nombre}</Text>

          <Text style={styles.category}>Ruta {lugar.categoria}</Text>

          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{lugar.lug_descripcion}</Text>

          <View style={styles.coordsRow}>
            <View>
              <Text style={styles.coordTitle}>Latitud</Text>
              <Text style={styles.coordText}>{lugar.lug_latitud}</Text>
            </View>

            <View>
              <Text style={styles.coordTitle}>Longitud</Text>
              <Text style={styles.coordText}>{lugar.lug_longitud}</Text>
            </View>
          </View>

          <Text style={styles.coordTitle}>Tags</Text>
          <Text style={styles.tags}>{lugar.lug_tags}</Text>

          <View style={styles.transportSection}>
            <Text style={styles.transportTitle}>🚌 Cómo llegar</Text>
            <Text style={styles.transportSubtitle}>
              Rutas de transporte público cercanas a este destino
            </Text>

            {transportes.length === 0 ? (
              <Text style={styles.noTransportText}>
                No hay transporte disponible
              </Text>
            ) : (
              transportes.map((tp: Transporte) => {
                const distancia = userLocation
                  ? calcularDistancia(
                      userLocation.lat,
                      userLocation.lng,
                      Number(lugar.lug_latitud),
                      Number(lugar.lug_longitud)
                    )
                  : 0;

                const tiempo = userLocation
                  ? Math.max(calcularTiempo(distancia, 20), 1)
                  : null;

                return (
                  <View key={tp.tp_id} style={styles.transportCard}>
                    <View style={styles.transportHeader}>
                      <View
                        style={[
                          styles.transportColor,
                          { backgroundColor: tp.tp_color || "#22B8D8" },
                        ]}
                      />
                      <Text style={styles.transportName}>{tp.tp_nombre}</Text>
                    </View>

                    <Text style={styles.transportType}>{tp.tp_tipo}</Text>

                    <Text style={styles.transportTime}>
                      {tiempo
                        ? `⏱ Tiempo estimado: ${tiempo.toFixed(0)} min`
                        : "📍 Obteniendo tu ubicación..."}
                    </Text>

                    <Text style={styles.transportDescription}>
                      {tp.tp_descripcion}
                    </Text>
                  </View>
                );
              })
            )}
          </View>

          <View style={styles.botonesRow}>
            <TouchableOpacity
              style={styles.btnRuta}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/navegacionRuta",
                  params: {
                    id: lugar.lug_id.toString(),
                    categoria: lugar.categoria,
                  },
                })
              }
            >
              <Text style={styles.btnText}>Ver Ruta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },

  backButton: {
    position: "absolute",
    top: 18,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#111",
    marginBottom: 8,
  },

  category: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FF5A00",
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#22B8D8",
    marginBottom: 10,
  },

  description: {
    fontSize: 19,
    color: "#333",
    lineHeight: 28,
    marginBottom: 22,
  },

  coordsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  coordTitle: {
    fontSize: 20,
    color: "#41B933",
    fontWeight: "900",
    marginBottom: 6,
  },

  coordText: {
    fontSize: 18,
    color: "#333",
  },

  tags: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },

  transportSection: {
    marginTop: 20,
    marginBottom: 25,
    backgroundColor: "#EAF9FC",
    padding: 16,
    borderRadius: 18,
  },

  transportTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#009CC6",
    marginBottom: 4,
  },

  transportSubtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 14,
  },

  transportCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 6,
    borderLeftColor: "#22B8D8",
    elevation: 3,
  },

  transportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  transportColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },

  transportName: {
    fontSize: 21,
    fontWeight: "900",
    color: "#222",
  },

  transportType: {
    fontSize: 16,
    fontWeight: "700",
    color: "#41B933",
    marginBottom: 5,
  },

  transportTime: {
    fontSize: 15,
    color: "#FF6B00",
    fontWeight: "800",
    marginBottom: 6,
  },

  transportDescription: {
    fontSize: 15,
    color: "#555",
    lineHeight: 21,
  },

  noTransportText: {
    fontSize: 15,
    color: "#777",
    fontStyle: "italic",
  },

  botonesRow: {
    marginTop: 10,
    marginBottom: 30,
  },

  btnRuta: {
    width: "100%",
    backgroundColor: "#FF5A00",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
});