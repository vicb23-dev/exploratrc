import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="register"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="forgotPassword"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="resetPassword"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="chatbot"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}