import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RutasScreen() {
  const rutas = [
    {
      nombre: "Ruta Gastronómica",
      imagen: require("../../assets/images/rutas/gastronomica.png"),
      color: "#FF5A1F",
      path: "/(tabs)/rutaGastronomica",
    },
    {
      nombre: "Ruta Cultura",
      imagen: require("../../assets/images/rutas/cultura.png"),
      color: "#7B2CBF",
      path: "/(tabs)/rutaCultura",
    },
    {
      nombre: "Ruta Entretenimiento",
      imagen: require("../../assets/images/rutas/entretenimiento.png"),
      color: "#FFC300",
      path: "/(tabs)/rutaEntretenimiento",
    },
    {
      nombre: "Ruta Night",
      imagen: require("../../assets/images/rutas/night.png"),
      color: "#00B4D8",
      path: "/(tabs)/rutaNight",
    },
    {
      nombre: "Ruta Familiar",
      imagen: require("../../assets/images/rutas/familiar.png"),
      color: "#38B000",
      path: "/(tabs)/rutaFamiliar",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.titulo}>Rutas TRC</Text>
        <Text style={styles.subtitulo}>Elige una experiencia para explorar Torreón</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {rutas.map((ruta, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: ruta.color }]}
              activeOpacity={0.85}
              onPress={() => router.push(ruta.path as any)}
            >
              <View style={styles.iconContainer}>
                <Image source={ruta.imagen} style={styles.imagen} />
              </View>

              <Text style={styles.texto}>{ruta.nombre}</Text>

              <View style={styles.footer}>
                <Text style={styles.verTexto}>Ver ruta</Text>
                <Ionicons name="arrow-forward" size={17} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  topBar: {
    backgroundColor: "#07769b",
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 22,
    //borderBottomLeftRadius: 30,
    //borderBottomRightRadius: 30,
    
  },
  titulo: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
    paddingVertical: 18
  },
  subtitulo: {
    fontSize: 15,
    color: "#ddd",
    marginTop: -10,
  },
  content: {
    padding: 12,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    minHeight: 180,
    borderRadius: 26,
    padding: 12,
    marginBottom: 16,
    justifyContent: "space-between",
    elevation: 5,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
     //alignSelf: "center",
  },
  imagen: {
    width: 52,
    height: 52,
    resizeMode: "contain",
  },
  texto: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 25,
  },
  footer: {
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  verTexto: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
  },
});