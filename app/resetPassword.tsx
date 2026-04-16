/**
 * Pantalla de Restablecimiento de Contraseña
 * -------------------------------------------
 * Permite al usuario establecer una nueva contraseña
 * después de haber verificado su correo en la pantalla
 * de recuperación de contraseña.
 *
 * Funcionalidades:
 * - Captura email del usuario
 * - Captura nueva contraseña
 * - Envía los datos al backend para actualizar la contraseña
 * - Muestra indicador de carga durante la petición
 * - Redirige al usuario a la pantalla de login al finalizar
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
  View,
} from "react-native";
import API from "../services/api";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Función que maneja la actualización de la contraseña
   * - Valida que los campos no estén vacíos
   * - Envía la petición al backend
   * - Redirige al login si el cambio fue exitoso
   */
  const handleReset = async () => {
    //validar campos
    if (!email || !password) {
      setError("Por favor llena todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Petición al endpoint del backend
      await API.post("/reset-password", { email, password });
      alert("Contraseña actualizada");
      router.push("/login");
    } catch (err) {
      setError("No se pudo actualizar la contraseña");
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

      <Text style={styles.title}>Restablecer contraseña</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
      />

      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        underlineColorAndroid="transparent"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>ACTUALIZAR CONTRASEÑA</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push("/login")}
      >
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
