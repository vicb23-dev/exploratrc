import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import API from "../../services/api";
import MapWebView, { MapWebViewRef } from "../componentes/MapWebView";

type Lugar = {
  lug_id: number;
  lug_nombre: string;
  lug_descripcion: string;
  imagen_principal_url: string | null;
  lug_latitud: number;
  lug_longitud: number;
  orden_en_ruta?: number;
};

type Ubicacion = {
  lat: number;
  lng: number;
};

export default function NavegacionRuta() {
  const params = useLocalSearchParams();

  const categoria = Array.isArray(params.categoria)
    ? params.categoria[0]
    : params.categoria;

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(true);
  const [indiceActual, setIndiceActual] = useState(0);
  const [miUbicacion, setMiUbicacion] = useState<Ubicacion | null>(null);

  const mapRef = useRef<MapWebViewRef>(null);

  useEffect(() => {
    obtenerMiUbicacion();
  }, []);

  useEffect(() => {
    if (categoria) {
      obtenerLugaresRuta();
    } else {
      setLoading(false);
    }
  }, [categoria]);

  useEffect(() => {
    if (lugares.length > 0) {
      const markers = lugares.map((lugar) => ({
        id: lugar.lug_id,
        lat: Number(lugar.lug_latitud),
        lng: Number(lugar.lug_longitud),
        title: lugar.lug_nombre,
      }));

      setTimeout(() => {
        if (!markers.length) return;

        mapRef.current?.setRouteMarkers({
          markers,
          activeIndex: indiceActual,
          userLocation: miUbicacion ?? null,
        });
      }, 500);
    }
  }, [lugares, indiceActual, miUbicacion]);

  const obtenerMiUbicacion = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permiso de ubicación denegado");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setMiUbicacion({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      console.log("Error obteniendo ubicación:", error);
    }
  };

  const obtenerLugaresRuta = async () => {
    try {
      const res = await API.get(
        `/lugares?categoria=${encodeURIComponent(categoria || "")}`,
      );

      const data: Lugar[] = res.data;

      const lugaresOrdenados = [...data].sort((a, b) => {
        const ordenA = a.orden_en_ruta ?? 0;
        const ordenB = b.orden_en_ruta ?? 0;
        return ordenA - ordenB;
      });

      setLugares(lugaresOrdenados);

      const indiceInicial = lugaresOrdenados.findIndex(
        (item) => item.lug_id.toString() === id,
      );

      if (indiceInicial >= 0) {
        setIndiceActual(indiceInicial);
      }
    } catch (error) {
      console.log("Error cargando navegación de ruta:", error);
    } finally {
      setLoading(false);
    }
  };

  const siguienteLugar = () => {
    if (indiceActual < lugares.length - 1) {
      setIndiceActual(indiceActual + 1);
    }
  };

  const anteriorLugar = () => {
    if (indiceActual > 0) {
      setIndiceActual(indiceActual - 1);
    }
  };

  const irADetalle = () => {
    const lugarActual = lugares[indiceActual];

    router.push({
      pathname: "/detallesLugar",
      params: { id: lugarActual.lug_id.toString() },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#7B2CBF" />
        <Text style={styles.mensaje}>Cargando ruta...</Text>
      </SafeAreaView>
    );
  }

  if (!lugares.length) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.mensaje}>
          No se encontraron lugares para esta ruta.
        </Text>
      </SafeAreaView>
    );
  }

  const lugarActual = lugares[indiceActual];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              const lugarActual = lugares[indiceActual];

              router.replace({
                pathname: "/(tabs)/detallesLugar",
                params: { id: lugarActual.lug_id.toString() },
              });
            }}
          >
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>

          <Text style={styles.titulo}>Ruta {categoria}</Text>
        </View>

        <Text style={styles.progreso}>
          Punto {indiceActual + 1} de {lugares.length}
        </Text>

        <View style={styles.mapContainer}>
          <MapWebView
            ref={mapRef}
            initialLat={Number(lugarActual.lug_latitud)}
            initialLng={Number(lugarActual.lug_longitud)}
          />
        </View>

        <View style={styles.card}>
          <Image
            source={{
              uri:
                lugarActual.imagen_principal_url ||
                "https://via.placeholder.com/300",
            }}
            style={styles.imagen}
          />

          <Text style={styles.nombre}>{lugarActual.lug_nombre}</Text>
          <Text style={styles.descripcion}>{lugarActual.lug_descripcion}</Text>

          <TouchableOpacity style={styles.botonDetalle} onPress={irADetalle}>
            <Text style={styles.textoBotonDetalle}>Ver detalle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.botonesRow}>
          <TouchableOpacity
            style={[
              styles.botonNav,
              indiceActual === 0 && styles.botonDeshabilitado,
            ]}
            onPress={anteriorLugar}
            disabled={indiceActual === 0}
          >
            <Text style={styles.textoBoton}>Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonNav,
              indiceActual === lugares.length - 1 && styles.botonDeshabilitado,
            ]}
            onPress={siguienteLugar}
            disabled={indiceActual === lugares.length - 1}
          >
            <Text style={styles.textoBoton}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  mensaje: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7B2CBF",
    marginTop: 20,
    marginBottom: 6,
  },
  progreso: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  card: {
    marginTop: 12,
    backgroundColor: "#f3e8ff",
    borderRadius: 16,
    padding: 12,
  },
  imagen: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#ddd",
    marginBottom: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
  },
  descripcion: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
  },
  botonesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 20,
  },
  botonNav: {
    backgroundColor: "#7B2CBF",
    width: "48%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  botonDeshabilitado: {
    backgroundColor: "#c9a7eb",
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
  botonDetalle: {
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotonDetalle: {
    color: "#fff",
    fontWeight: "bold",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  backButton: {
    position: "absolute",
    top: -18,
    left: 2,
    zIndex: 10,
  },

  mapContainer: {
    height: 260,
    marginTop: 18,
    marginBottom: 20,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
});
