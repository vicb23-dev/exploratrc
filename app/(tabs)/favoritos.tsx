import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
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



type Lugar = {
  lug_id: number;
  lug_nombre: string;
  lug_descripcion: string;
  imagen_principal_url: string | null;
  rut_nombre: string;
  rut_color: string;
};

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(true);

  const usu_id = 1;

  useFocusEffect(
    useCallback(() => {
      obtenerFavoritos();
    }, [])
  );

  const obtenerFavoritos = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/favoritos/${usu_id}`);

      setFavoritos(res.data);
    } catch (error) {
      console.log("Error al obtener favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarFavorito = async (lug_id: number) => {
    try {
      await API.delete(`/favoritos/${usu_id}/${lug_id}`);

      setFavoritos((prevFavoritos) =>
        prevFavoritos.filter((lugar) => lugar.lug_id !== lug_id)
      );
    } catch (error) {
      console.log("Error al eliminar favorito:", error);
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
        style={[
          styles.card,
          { backgroundColor: item.rut_color || "#7a2cbf23" },
        ]}
        activeOpacity={0.8}
        onPress={() => irADetalle(item.lug_id)}>
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.lug_nombre}</Text>
        <Text style={styles.ruta}>{item.rut_nombre}</Text>
        <Text style={styles.descripcion}>{item.lug_descripcion}</Text>
      </View>

      <View style={styles.right}>
        <Image
          source={{
            uri: item.imagen_principal_url || "https://via.placeholder.com/100",
          }}
          style={styles.imagen}
        />

        <TouchableOpacity
          style={styles.botonCorazon}
          onPress={(e) => {
            e.stopPropagation();
            eliminarFavorito(item.lug_id);
          }}
        >
          <Ionicons name="heart" size={26} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis favoritos</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#7B2CBF" style={styles.loader} />
      ) : favoritos.length === 0 ? (
        <Text style={styles.vacio}>No tienes lugares favoritos todavía.</Text>
      ) : (
        <FlatList
          data={favoritos}
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
    padding: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  loader: {
    marginTop: 30,
  },
  vacio: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#555",
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginBottom: 3,
    color: "#000",
  },
  ruta: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
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