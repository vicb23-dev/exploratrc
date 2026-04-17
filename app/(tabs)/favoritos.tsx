import { router } from "expo-router";
import { Button, Text, View } from "react-native";

<Button title="Abrir mapa" onPress={() => router.push("/mapa")} />;

export default function Home() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Bienvenido a Favoritos </Text>
    </View>
  );
}