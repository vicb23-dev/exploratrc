
/**
 * Pantalla de Recuperación de Contraseña
 * ---------------------------------------
 * Permite al usuario verificar si su correo está registrado
 * para iniciar el proceso de recuperación de contraseña.
 * 
 * Funcionalidades:
 * - Captura email del usuario
 * - Verifica si existe en el sistema
 * - Redirige a la pantalla de restablecimiento de contraseña
 */
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import API from "../services/api";

export default function ForgotPassword() {

  //estado para alamacenar email
  const [email, setEmail] = useState("");

  // interfaz
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRecover = async () => {
    if (!email) {
      setError("Por favor ingresa tu email");
      return;
    }

    setLoading(true);
    setError("");

    try {

      // peticion del backend 
      const res = await API.post("/forgot-password", { email });
      alert("Usuario encontrado");
      // redirigir
      router.push("/resetPassword");
    } catch (err) {
      setError("Usuario no encontrado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Recuperar contraseña</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Ingresa tu email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        underlineColorAndroid="transparent" // evita highlight azul en Android
      />

      <TouchableOpacity style={styles.button} onPress={handleRecover} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>RECUPERAR CONTRASEÑA</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/login")}>
        <Text style={styles.linkText}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#000000", // contorno negro fijo
  },
  button: {
    backgroundColor: "#2BC52A", // verde principal
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkButton: {
    alignItems: "center",
    marginTop: 10,
  },
  linkText: {
    color: "#2BC52A",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  error: {
    color: "#731414",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
});
