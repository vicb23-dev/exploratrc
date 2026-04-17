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
import API from "../services/api";

type Lugar = {
  lug_id: number;
  lug_nombre: string;
  lug_descripcion: string;
  imagen_principal_url: string | null;
};

export default function rutaEntretenimiento() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerLugares();
  }, []);

  const obtenerLugares = async () => {
    try {
      const res = await API.get("/lugares?categoria=Entretenimiento");
      setLugares(res.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const irADetalle = (id: number) => {
      router.push({
        pathname: "/detallesLugar",
        params: { id: id.toString() },
      });
    };

  const renderItem = ({ item }: { item: Lugar }) => (
     <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => irADetalle(item.lug_id)}
        >

      <View style={styles.info}>
        <Text style={styles.nombre}>{item.lug_nombre}</Text>
        <Text style={styles.descripcion}>{item.lug_descripcion}</Text>
      </View>

      <View style={styles.right}>
        <Image
          source={{
            uri:
              item.imagen_principal_url ||
              "https://via.placeholder.com/100",
          }}
          style={styles.imagen}
        />

        <TouchableOpacity style={styles.botonCorazon}>
          <Ionicons name="heart-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

 return (
  <View style={styles.container}>
    
    {/*  LOGO CENTRADO */}
    <View style={styles.logoContainer}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>

    {/*  HEADER */}
    <View style={styles.header}>
      <Text style={styles.titulo}>Ruta Entretenimiento</Text>
    </View>

    {loading ? (
      <ActivityIndicator size="large" color="#FFC300" style={styles.loader} />
    ) : (
      <FlatList
        data={lugares}
        keyExtractor={(item) => item.lug_id.toString()}
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
    backgroundColor: "#fff",
  },
  logoContainer: {
  alignItems: "center",   // centra horizontal
  justifyContent: "center",
  marginTop: -20,          // ajusta si quieres más pegado
},


  logo: {
  width: "20%",
  height: 120,

  },

  header: {
    backgroundColor: "#FFC300",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -30,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },

  loader: {
    marginTop: 20,
  },

  lista: {
    padding: 10,
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffc4003c",
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },

  info: {
    flex: 1,
    paddingRight: 10,
  },

  nombre: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#000",
  },

  descripcion: {
    fontSize: 13,
    color: "#555",
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
  },

  imagen: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },

  botonCorazon: {
    marginLeft: 10,
  },
});