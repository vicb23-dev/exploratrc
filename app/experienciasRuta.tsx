import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import API from "../services/api";

type Experiencia = {
  exp_id: number;
  exp_nombre: string;
  exp_descripcion: string;
  exp_imagen_url?: string | null;
  rut_nombre?: string;
};

export default function ExperienciasRuta() {
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const { categoria } = useLocalSearchParams();

  const categoriaTexto = Array.isArray(categoria) ? categoria[0] : categoria;

  useEffect(() => {
    obtenerExperiencias();
  }, []);

  const obtenerExperiencias = async () => {
    try {
      const res = await API.get(
        `/experiencias?categoria=${categoriaTexto || "Gastronomica"}`
      );

      setExperiencias(res.data);
    } catch (error) {
      console.log("Error experiencias:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Experiencias gastronómicas
      </Text>

      <FlatList
        data={experiencias}
        keyExtractor={(item) => item.exp_id.toString()}
        renderItem={({ item }: { item: Experiencia }) => (
          <TouchableOpacity
  onPress={() =>
    router.push({
      pathname: "/(tabs)/navegacionRuta" as any,
      params: {
        exp_id: item.exp_id.toString(),
        nombre: item.exp_nombre,
      },
    })
  }
  style={{
    padding: 18,
    marginVertical: 10,
    backgroundColor: "#FF5A00",
    borderRadius: 18,
  }}
>
  <Text
    style={{
      fontSize: 18,
      fontWeight: "900",
      color: "#fff",
    }}
  >
    {item.exp_nombre}
  </Text>

  <Text
    style={{
      color: "#fff",
      marginTop: 6,
      fontSize: 15,
      lineHeight: 22,
    }}
  >
    {item.exp_descripcion}
  </Text>
</TouchableOpacity>
        )}
      />
    </View>
  );
}