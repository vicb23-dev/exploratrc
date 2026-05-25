import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  View,
} from "react-native";

export default function Index() {

  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async () => {
    try {
      const token =
        await AsyncStorage.getItem("token");

      if (token) {
        router.replace("/(tabs)/mapa");
      } else {
        router.replace("/login");
      }
    } catch (error) {
      console.log(error);
      router.replace("/login");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}