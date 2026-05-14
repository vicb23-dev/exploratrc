import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../../services/api";

type Experiencia = {
  exp_id: number;
  exp_nombre: string;
  exp_descripcion: string;
};

type Props = {
  categoria: string;
  titulo: string;
  headerColor: string;
  cardColor: string;
  loaderColor: string;
};

export default function RutaComponentes({
  categoria,
  titulo,
  headerColor,
  cardColor,
  loaderColor,
}: Props) {
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarExperiencias();
  }, []);

  const cargarExperiencias = async () => {
    try {
      const res = await API.get(
        `/experiencias?categoria=${categoria}`
      );

      setExperiencias(res.data);
    } catch (error) {
      console.log("Error experiencias:", error);
    } finally {
      setLoading(false);
    }
  };

  const irARuta = (exp_id: number, nombre: string) => {
    router.push({
      pathname: "/(tabs)/navegacionRuta" as any,
      params: {
        exp_id: exp_id.toString(),
        nombre,
         origen:
        categoria === "Gastronomica"
          ? "/(tabs)/rutaGastronomica"
          : categoria === "Cultura"
          ? "/(tabs)/rutaCultura"
          : categoria === "Entretenimiento"
          ? "/(tabs)/rutaEntretenimiento"
          : categoria === "Night"
          ? "/(tabs)/rutaNight"
          : categoria === "Familiar"
          ? "/(tabs)/rutaFamiliar"
          : "/(tabs)/rutas",
      },
    });
  };

 const renderItem = ({ item }: { item: Experiencia }) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: cardColor }]}
    activeOpacity={0.88}
    onPress={() => irARuta(item.exp_id, item.exp_nombre)}
  >
    <View
      style={{
        width: 55,
        height: 6,
        backgroundColor: "rgba(255,255,255,0.4)",
        borderRadius: 20,
        marginBottom: 15,
      }}
    />

    <Text style={styles.nombre}>
      {item.exp_nombre}
    </Text>

    <Text style={styles.descripcion}>
      {item.exp_descripcion}
    </Text>

    <View
      style={{
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontWeight: "700",
          fontSize: 14,
          marginRight: 4,
        }}
      >
        Ver recorrido
      </Text>

      <Ionicons
        name="arrow-forward"
        size={18}
        color="#fff"
      />
    </View>
  </TouchableOpacity>
);

return (
  <View style={styles.container}>

    {/* LOGO + FLECHA */}
    <View style={styles.logoContainer}>
      <TouchableOpacity
        style={styles.backButtonTop}
        onPress={() => router.replace("/(tabs)/rutas")}
      >
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>

    {/* HEADER */}
    <View style={[styles.header, { backgroundColor: headerColor }]}>
      <Text style={styles.titulo}>
        {titulo}
      </Text>
    </View>

    {/* CONTENIDO */}
    {loading ? (
      <ActivityIndicator
        size="large"
        color={loaderColor}
        style={styles.loader}
      />
    ) : (
      <FlatList
        data={experiencias}
        keyExtractor={(item) => item.exp_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    )}
  </View>
);



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",//"#F7F7F7",
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    backgroundColor: "transparent",
  },

  logo: {
    width: "20%",
    height: 120,
    backgroundColor: "transparent",
  },

  backButtonTop: {
    position: "absolute",
    left: 18,
    top: 40,
    zIndex: 10,
    backgroundColor: "#ffffffb4",
    padding: 8,
    borderRadius: 50,
    elevation: 4,
  },

  header: {
    paddingVertical: 22,
    paddingHorizontal: 22,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -25,
    elevation: 5,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.5,
  },

  loader: {
    marginTop: 40,
  },

  lista: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 45,
  },

  card: {
    borderRadius: 26,
    padding: 22,
    marginBottom: 18,
    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  nombre: {
    fontSize: 21,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 5,
    lineHeight: 28,
  },

  descripcion: {
    fontSize: 13,
    color: "#fff",
    lineHeight: 20,
    opacity: 0.95,
  },

  


});
//ver recorrido