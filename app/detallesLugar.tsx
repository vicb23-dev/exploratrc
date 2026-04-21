import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../services/api";

type LugarDetalle = {
  lug_id: number;
  lug_nombre: string;
  lug_descripcion: string;
  imagen_principal_url: string | null;
  lug_latitud?: number;
  lug_longitud?: number;
  lug_tags?: string | null;
  categoria?: string;
};

export default function DetalleLugar() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [lugar, setLugar] = useState<LugarDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      obtenerDetalleLugar();
    } else {
      setLoading(false);
    }
  }, [id]);

  const obtenerDetalleLugar = async () => {
    try {
      const res = await API.get(`/lugares/${id}`);
      setLugar(res.data);
    } catch (error) {
      console.log("Error al obtener detalle:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7B2CBF" />
      </View>
    );
  }

  if (!lugar) {
    return (
      <View style={styles.center}>
        <Text>No se encontró el lugar.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      {/* LOGO CENTRADO */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Image
        source={{
          uri: lugar.imagen_principal_url || "https://via.placeholder.com/300",
        }}
        style={styles.imagenPrincipal}
      />

      <View style={styles.content}>
        <View style={styles.tituloRow}>
          <Text style={styles.nombre}>{lugar.lug_nombre}</Text>
          <Ionicons name="bookmark-outline" size={26} color="#000" />
        </View>

        <Text style={styles.rutaTexto}>
          {lugar.categoria ? `Ruta ${lugar.categoria}` : "Sin categoría"}
        </Text>

        <Text style={styles.label}>Descripción</Text>
        <Text style={styles.descripcion}>{lugar.lug_descripcion}</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.labelVerde}>Latitud</Text>
            <Text style={styles.infoText}>
              {lugar.lug_latitud ?? "Sin dato"}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.labelVerde}>Longitud</Text>
            <Text style={styles.infoText}>
              {lugar.lug_longitud ?? "Sin dato"}
            </Text>
          </View>

          <View style={styles.infoBoxFull}>
            <Text style={styles.labelVerde}>Tags</Text>
            <Text style={styles.infoText}>
              {lugar.lug_tags || "Sin etiquetas"}
            </Text>
          </View>
        </View>

        <View style={styles.botonesRow}>
         <TouchableOpacity
  style={styles.botonRuta}
  onPress={() =>
    router.push({
      pathname: "/navegacionRuta",
      params: {
        categoria: lugar.categoria || "",
        id: lugar.lug_id.toString(),
      },
    })
  }
>
  <Text style={styles.textoBoton}>Ver Ruta</Text>
</TouchableOpacity>
          <TouchableOpacity style={styles.botonCalificar}>
            <Text style={styles.textoBoton}>Calificar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -85,
  },

  logo: {
    width: "20%",
    height: 120,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 10,
  },
  imagenPrincipal: {
    width: "90%",
    height: 220,
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "#ddd",
    marginTop: -15,
  },
  content: {
    padding: 20,
  },
  tituloRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
  },
  nombre: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    marginRight: 10,
  },
  rutaTexto: {
    fontSize: 18,
    color: "#FF6600",
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00AEEF",
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 15,
    color: "#333",
    marginBottom: 20,
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoBox: {
    width: "48%",
    marginBottom: 18,
  },
  infoBoxFull: {
    width: "100%",
    marginBottom: 18,
  },
  labelVerde: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#38B000",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  botonesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 30,
  },
  botonRuta: {
    backgroundColor: "#FF5A00",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: "48%",
    alignItems: "center",
  },
  botonCalificar: {
    backgroundColor: "#10BCEB",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: "48%",
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});