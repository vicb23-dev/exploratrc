import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen
        name="forgotPassword"
        options={{ title: "Recuperar contraseña" }}
      />
      <Stack.Screen
        name="resetPassword"
        options={{ title: "Nueva contraseña" }}
      />
      <Stack.Screen name="map" options={{ title: "Mapa" }} />
    </Stack>
  );
}
