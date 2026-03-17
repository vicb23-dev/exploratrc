/**
 * Pantalla de Registro
 * Permite a nuevos usuarios crear una cuenta en la aplicación.
 * Funcionalidades:
 * - Captura nombre, email y contraseña
 * - Envía los datos al backend para registrar el usuario
 * - Muestra indicador de carga mientras se realiza la petición
 * - Redirige al usuario a Home después del registro
 */
import { router } from "expo-router";
import { useState } from "react";
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

export default function Register() {
  // estados para el formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // estados de la interfaz
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Maneja el proceso de registro
   * - Valida campos
   * - Envía datos al backend
   */
  const handleRegister = async () => {
    if (!nombre || !email || !password) {
      setError("Por favor llena todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // peticion al end point
      const res = await API.post("/register", { nombre, email, password });
      alert("Usuario registrado");
      router.replace("/home");
    } catch (err) {
      setError("Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {}
      <Image 
        source={require("../assets/images/logo.png")} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Crea tu cuenta</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#ccc"
        value={nombre}
        onChangeText={setNombre}
      />

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

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>REGISTRARSE</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/login")}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", //  fondo
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
    color: "#000000",
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
    borderColor: "#000000", // contorno verde
  },
  button: {
    backgroundColor: "#02A0C6", // verde principal
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
    color: "#02A0C6",
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
