/**
 * Pantalla de Inicio de Sesión
 
 * Permite a los usuarios autenticarse en la aplicación.
 * 
 * Funcionalidades:
 * - Captura email y contraseña
 * - Envía credenciales al backend mediante la API
 * - Guarda el token de autenticación en AsyncStorage
 * - Redirige al usuario a la pantalla Home si el login es exitoso
 * - Muestra mensajes de error si las credenciales son incorrectas
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../services/api";

export default function Login() {
  //estados para almacenar los datos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // manejo de iu
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Maneja el proceso de autenticación
   * - Valida campos
   * - Envía datos al backend
   * - Guarda token en almacenamiento local
   */
  const handleLogin = async () => {
    // Validación de campos
    if (!email || !password) {
      setError("Por favor llena todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // peticion del endpoint
      const res = await API.post("/login", { email, password });
      // token recibido
      const token = res.data.token;
      // token local
      await AsyncStorage.setItem("token", token);
      //redirigir al map
      router.replace("/mapa"); //  /map
    } catch (err: any) {
      console.log("ERROR LOGIN COMPLETO:", err);
      console.log("RESPUESTA LOGIN BACKEND:", err.response?.data);
      setError(err.response?.data?.error || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
    /*catch (err) {
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }*/
  };

  return (
    <View style={styles.container}>
      {}
      <Image
        source={require("../assets/images/logo.png")} // coloca aquí tu imagen
        style={styles.logo}
        resizeMode="contain"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push("../forgotPassword")}
      >
        <Text style={styles.linkText}>Olvidé mi contraseña</Text>
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
    marginBottom: 30,
  },

  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 2, // grosor del contorno
    borderColor: "#000000",
  },
  button: {
    backgroundColor: "#2BC52A",
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
