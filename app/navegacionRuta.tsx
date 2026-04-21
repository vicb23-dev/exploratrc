import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapWebView, { MapWebViewRef } from "../components/MapWebView";
import API from "../services/api";

type Lugar = {
  lug_id: number;
  lug_nombre: string;
  lug_descripcion: string;
  imagen_principal_url: string | null;
  lug_latitud: number;
  lug_longitud: number;
  orden_en_ruta?: number;
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

  const mapRef = useRef<MapWebViewRef>(null);

  useEffect(() => {
    if (categoria) {
      obtenerLugaresRuta();
    } else {
      setLoading(false);
    }
  }, [categoria]);

  useEffect(() => {
    if (lugares.length > 0) {
      const lugarActual = lugares[indiceActual];

      mapRef.current?.setSingleMarker({
        lat: Number(lugarActual.lug_latitud),
        lng: Number(lugarActual.lug_longitud),
        title: lugarActual.lug_nombre,
      });
    }
  }, [lugares, indiceActual]);

  const obtenerLugaresRuta = async () => {
    try {
      const res = await API.get(
        `/lugares?categoria=${encodeURIComponent(categoria || "")}`
      );
      const data = res.data;
      setLugares(data);

      const indiceInicial = data.findIndex(
        (item: Lugar) => item.lug_id.toString() === id
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7B2CBF" />
        <Text style={styles.mensaje}>Cargando ruta...</Text>
      </View>
    );
  }

  if (!lugares.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.mensaje}>
          No se encontraron lugares para esta ruta.
        </Text>
      </View>
    );
  }

  const lugarActual = lugares[indiceActual];

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ruta {categoria}</Text>

      <Text style={styles.progreso}>
        Punto {indiceActual + 1} de {lugares.length}
      </Text>

      <MapWebView
        ref={mapRef}
        initialLat={Number(lugarActual.lug_latitud)}
        initialLng={Number(lugarActual.lug_longitud)}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 18,
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
  },
  botonNav: {
    backgroundColor: "#7B2CBF",
    width: "48%",
    paddingVertical: 12,
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
});