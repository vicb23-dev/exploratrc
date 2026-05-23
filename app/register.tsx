/**
 * Pantalla de Registro
 *
 * Permite crear una cuenta nueva.
 *
 * Funcionalidades:
 * - Captura nombre, email y contraseña
 * - Confirma contraseña
 * - Valida contraseña segura
 * - Valida formato de correo
 * - Muestra validaciones visuales
 * - Envía datos al backend
 * - El backend genera username único automáticamente
 */


import { router } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import API from "../services/api";

export default function Register() {

  /**
   * Estados del formulario
   */
  const [nombre, setNombre] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

    const [mostrarPassword, setMostrarPassword] =
  useState(false);

const [
  mostrarConfirmPassword,
  setMostrarConfirmPassword,
] = useState(false);

  /**
   * Estados de interfaz
   */
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /**
   * Validar correo
   *
   * Formato:
   * nombre@algo.algo
   */
  const validarEmail = (correo: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(correo);
  };

  /**
   * Validar contraseña segura
   *
   * Requisitos:
   * - mínimo 8 caracteres
   * - una mayúscula
   * - una minúscula
   * - un número
   * - un símbolo
   */
  const validarPassword = (
    password: string,
  ) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

    return regex.test(password);
  };

  /**
   * Validaciones visuales
   */
  const passwordValida =
    password.length > 0 &&
    validarPassword(password);

  const emailValido =
    email.length > 0 &&
    validarEmail(email);

  const passwordsCoinciden =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  /**
   * Obtener estilo dinámico
   *
   * Verde = válido
   * Rojo = inválido
   */
  const getInputStyle = (
    isValid: boolean,
    value: string,
  ) => [
    styles.input,

    value.length > 0 && {
      borderColor: isValid
        ? "#2E7D32"
        : "#C62828",
    },
  ];

  const getPasswordContainerStyle = (
    isValid: boolean,
    value: string,
  ) => [
    styles.passwordContainer,

    value.length > 0 && {
      borderColor: isValid
        ? "#2E7D32"
        : "#C62828",
    },
  ];

  /**
   * Manejar registro
   */
  const handleRegister = async () => {

    /**
     * Validar campos vacíos
     */
    if (
      !nombre ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Por favor llena todos los campos",
      );

      return;
    }

    /**
     * Validar correo
     */
    if (!validarEmail(email)) {
      setError(
        "El correo debe tener formato nombre@algo.algo",
      );

      return;
    }

    /**
     * Validar contraseña segura
     */
    if (!validarPassword(password)) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo",
      );

      return;
    }

    /**
     * Validar coincidencia
     */
    if (password !== confirmPassword) {
      setError(
        "Las contraseñas no coinciden",
      );

      return;
    }

    setLoading(true);

    setError("");

    try {

      /**
       * Enviar datos al backend
       */
      await API.post("/register", {
        nombre,
        email,
        password,
      });

      /**
       * Registro exitoso
       */
      Alert.alert(
        "Registro exitoso",
        "Tu cuenta fue creada correctamente",
        [
          {
            text: "OK",

            onPress: () =>
              router.replace("/login"),
          },
        ],
      );

    } catch (err: any) {

      /**
       * Mostrar error backend
       */
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Error al registrar",
      );

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

      {/* Título */}
      <Text style={styles.title}>
        Crea tu cuenta
      </Text>

      {/* Mensaje error */}
      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

      {/* Nombre */}
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#ccc"
        value={nombre}
        onChangeText={setNombre}
      />

      {/* Email */}
      <TextInput
        style={getInputStyle(
          emailValido,
          email,
        )}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Validación email */}
      {email.length > 0 && (
        <Text
          style={
            emailValido
              ? styles.validText
              : styles.invalidText
          }
        >
          {emailValido
            ? "Correo válido"
            : "Debe tener formato nombre@algo.algo"}
        </Text>
      )}

      {/* Contraseña */}
      <View
        style={getPasswordContainerStyle(
          passwordValida,
          password,
        )}
      >
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry={!mostrarPassword}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() =>
            setMostrarPassword(!mostrarPassword)
          }
        >
          <Ionicons
            name={
              mostrarPassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Validación contraseña */}
      {password.length > 0 && (
        <Text
          style={
            passwordValida
              ? styles.validText
              : styles.invalidText
          }
        >
          {passwordValida
            ? "Contraseña segura"
            : "Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"}
        </Text>
      )}

      {/* Confirmar contraseña */}
      <View
        style={getPasswordContainerStyle(
          passwordsCoinciden,
          confirmPassword,
        )}
      >
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#999"
          secureTextEntry={!mostrarConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          onPress={() =>
            setMostrarConfirmPassword(
              !mostrarConfirmPassword,
            )
          }
        >
          <Ionicons
            name={
              mostrarConfirmPassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Validación coincidencia */}
      {confirmPassword.length > 0 && (
        <Text
          style={
            passwordsCoinciden
              ? styles.validText
              : styles.invalidText
          }
        >
          {passwordsCoinciden
            ? "Las contraseñas coinciden"
            : "Las contraseñas no coinciden"}
        </Text>
      )}

      {/* Botón registro */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            REGISTRARSE
          </Text>
        )}
      </TouchableOpacity>

      {/* Ir login */}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() =>
          router.push("/login")
        }
      >
        <Text style={styles.linkText}>
          ¿Ya tienes cuenta? Inicia Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Estilos
 */
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
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#000000",
  },

  validText: {
    color: "#2E7D32",
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 13,
  },

  invalidText: {
    color: "#C62828",
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 13,
  },

  button: {
    backgroundColor: "#02A0C6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
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

  passwordContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 8,
  borderWidth: 2,
  borderColor: "#000",
  paddingHorizontal: 12,
  marginBottom: 8,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 4,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  elevation: 3,
},

passwordInput: {
  flex: 1,
  height: 52,
  fontSize: 16,
  color: "#000",
},
});