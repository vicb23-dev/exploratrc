import { router } from "expo-router";

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RutasScreen() {
  const rutas = [
    {
      nombre: "Ruta Gastronómica",
      imagen: require("../../assets/images/rutas/gastronomica.png"),
      color: "#FF5A1F",
    },
    {
      nombre: "Ruta Cultura",
      imagen: require("../../assets/images/rutas/cultura.png"),
      color: "#7B2CBF",
    },
    {
      nombre: "Ruta Entretenimiento",
      imagen: require("../../assets/images/rutas/entretenimiento.png"),
      color: "#FFC300",
    },
    {
      nombre: "Ruta Night",
      imagen: require("../../assets/images/rutas/night.png"),
      color: "#00B4D8",
    },
    {
      nombre: "Ruta Familiar",
      imagen: require("../../assets/images/rutas/familiar.png"),
      color: "#38B000",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Rutas TRC</Text>

      <View style={styles.grid}>
        {rutas.map((ruta, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: ruta.color }]}
            onPress={() => {
              if (ruta.nombre === "Ruta Gastronómica") {
                router.push("/(tabs)/rutaGastronomica");
              } else if (ruta.nombre === "Ruta Cultura") {
                router.push("/(tabs)/rutaCultura");
              } else if (ruta.nombre === "Ruta Entretenimiento") {
                router.push("/(tabs)/rutaEntretenimiento" as any);
              } else if (ruta.nombre === "Ruta Night") {
                router.push("/(tabs)/rutaNight");
              } else if (ruta.nombre === "Ruta Familiar") {
                router.push("/(tabs)/rutaFamiliar");
              }
            }}
          >
            <Image source={ruta.imagen} style={styles.imagen} />
            <Text style={styles.texto}>{ruta.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    height: 140,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  imagen: {
    width: 60,
    height: 60,
    marginBottom: 10,
    resizeMode: "contain",
  },
  texto: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
});
