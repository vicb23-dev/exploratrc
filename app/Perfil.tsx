/**
 * Pantalla de Perfil
 *
 * Permite:
 * - Editar nombre
 * - Editar username
 * - Validar username único
 * - Editar correo
 * - Cambiar foto con recorte
 * - Cambiar contraseña
 * - Mostrar/ocultar contraseñas
 * - Confirmar contraseña actual en modal antes de guardar
 */

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";

import {
    Alert,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    actualizarPerfil,
    subirImagen,
    verificarUsername,
} from "../services/api";

export default function Perfil() {
  const [usuario, setUsuario] = useState<any | null>(null);

  const [nombre, setNombre] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [imagen, setImagen] = useState<string>("");
  const [imagenError, setImagenError] = useState<boolean>(false);

  const [passwordNueva, setPasswordNueva] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordConfirmacion, setPasswordConfirmacion] = useState<string>("");

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [usernameDisponible, setUsernameDisponible] =
    useState<boolean | null>(null);

  const [verificandoUsername, setVerificandoUsername] =
    useState<boolean>(false);

  const [mostrarPasswordNueva, setMostrarPasswordNueva] =
    useState<boolean>(false);

  const [mostrarConfirmPassword, setMostrarConfirmPassword] =
    useState<boolean>(false);

  const [mostrarPasswordActual, setMostrarPasswordActual] =
    useState<boolean>(false);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async (): Promise<void> => {
    try {
      const data = await AsyncStorage.getItem("usuario");

      if (data) {
        const user = JSON.parse(data);

        setUsuario(user);
        setNombre(user.nombre || "");
        setUsername(user.username || "");
        setCorreo(user.email || "");
        setImagen(user.imagen || "");
        setImagenError(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

    const seleccionarImagen = async (): Promise<void> => {
    try {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permiso.granted) {
        Alert.alert(
            "Permiso requerido",
            "Necesitas permitir acceso a la galería para seleccionar una imagen.",
        );
        return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [1, 1],
        });

        if (!result.canceled) {
        const imagenLocal = result.assets[0].uri;

        const respuesta: any = await subirImagen(imagenLocal);

        setImagen(respuesta.imageUrl);
        setImagenError(false);
        }
    } catch (error: any) {
        console.log(error);

        Alert.alert(
        "Error",
        "No se pudo subir la imagen",
        );
    }
    };

  

  const validarPassword = (password: string): boolean => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/;

    return regex.test(password);
  };

  const validarEmail = (correo: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(correo);
  };

  const validarUsername = (texto: string): boolean => {
    const regex = /^[a-zA-Z0-9_]{4,20}$/;

    return regex.test(texto);
  };

  const revisarUsername = async (): Promise<void> => {
    try {
      if (!usuario?.id) return;

      const usernameLimpio = username.trim().toLowerCase();

      if (!usernameLimpio) {
        setUsernameDisponible(null);
        return;
      }

      if (!validarUsername(usernameLimpio)) {
        setUsernameDisponible(false);
        return;
      }

      if (usernameLimpio === usuario?.username) {
        setUsernameDisponible(null);
        return;
      }

      setVerificandoUsername(true);

      const res: any = await verificarUsername(usernameLimpio, usuario?.id);

      setUsernameDisponible(res.disponible);
    } catch (error: any) {
      console.log(error);
      setUsernameDisponible(false);
    } finally {
      setVerificandoUsername(false);
    }
  };

  const emailValido = correo.length > 0 && validarEmail(correo);

  const usernameActual =
    username.length > 0 && username === usuario?.username;

  const usernameDisponibleValido =
    username.length > 0 &&
    validarUsername(username) &&
    usernameDisponible === true &&
    username !== usuario?.username;

  const usernameInvalido =
    username.length > 0 &&
    !usernameActual &&
    (!validarUsername(username) || usernameDisponible === false);

  const passwordValida =
    passwordNueva.length > 0 && validarPassword(passwordNueva);

  const passwordsCoinciden =
    confirmPassword.length > 0 && passwordNueva === confirmPassword;

  const getInputStyle = (isValid: boolean, value: string) => [
    styles.input,
    value.length > 0 && {
      borderColor: isValid ? "#2E7D32" : "#C62828",
    },
  ];

  const getUsernameInputStyle = () => [
    styles.input,
    username.length > 0 &&
      usernameActual && {
        borderColor: "#999",
      },
    username.length > 0 &&
      usernameDisponibleValido && {
        borderColor: "#2E7D32",
      },
    username.length > 0 &&
      usernameInvalido && {
        borderColor: "#C62828",
      },
  ];

  const getPasswordContainerStyle = (
    isValid: boolean,
    value: string,
  ) => [
    styles.passwordContainer,
    value.length > 0 && {
      borderColor: isValid ? "#2E7D32" : "#C62828",
    },
  ];

  const abrirConfirmacion = async (): Promise<void> => {
    if (!usuario?.id) {
      Alert.alert("Error", "No se encontró el usuario activo");
      return;
    }

    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }

    if (!validarEmail(correo)) {
      Alert.alert("Error", "El correo debe tener formato nombre@algo.algo");
      return;
    }

    const usernameLimpio = username.trim().toLowerCase();

    if (!validarUsername(usernameLimpio)) {
      Alert.alert(
        "Error",
        "El username debe tener de 4 a 20 caracteres. Solo letras, números y guion bajo.",
      );
      return;
    }

    if (usernameLimpio !== usuario?.username) {
      try {
        const res: any = await verificarUsername(usernameLimpio, usuario?.id);

        if (!res.disponible) {
          Alert.alert("Error", "Ese nombre de usuario ya está en uso");
          return;
        }
      } catch (error: any) {
        Alert.alert("Error", "No se pudo verificar el username");
        return;
      }
    }

    if (passwordNueva.trim() !== "" || confirmPassword.trim() !== "") {
      if (!validarPassword(passwordNueva)) {
        Alert.alert(
          "Contraseña insegura",
          "Debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.",
        );
        return;
      }

      if (passwordNueva !== confirmPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden");
        return;
      }
    }

    setUsername(usernameLimpio);
    setModalVisible(true);
  };

  const guardarCambios = async (): Promise<void> => {
    try {
      if (!passwordConfirmacion.trim()) {
        Alert.alert("Error", "Ingresa tu contraseña actual");
        return;
      }

      const respuesta: any = await actualizarPerfil(usuario?.id, {
        nombre,
        username: username.trim().toLowerCase(),
        email: correo,
        imagen,
        passwordActual: passwordConfirmacion,
        passwordNueva,
      });

      await AsyncStorage.setItem(
        "usuario",
        JSON.stringify(respuesta.usuario),
      );

      setUsuario(respuesta.usuario);
      setNombre(respuesta.usuario.nombre || "");
      setUsername(respuesta.usuario.username || "");
      setCorreo(respuesta.usuario.email || "");
      setImagen(respuesta.usuario.imagen || "");
      setImagenError(false);

      setPasswordNueva("");
      setConfirmPassword("");
      setPasswordConfirmacion("");
      setModalVisible(false);

      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "No se pudieron guardar los cambios",
      );
    }
  };

  const mostrarImagenPerfil = imagen.trim() !== "" && !imagenError;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={seleccionarImagen}
            style={styles.imageContainer}
          >
            {mostrarImagenPerfil ? (
              <Image
                source={{ uri: imagen }}
                style={styles.profileImage}
                onError={() => setImagenError(true)}
              />
            ) : (
              <Ionicons name="person-circle" size={120} color="#111" />
            )}

            <View style={styles.cameraButton}>
              <Ionicons name="pencil" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.title}>Mi Perfil</Text>

          <Text style={styles.subtitle}>
            Personaliza tu cuenta de Explora TRC
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Nombre</Text>

          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Nombre de usuario</Text>

          <TextInput
            style={getUsernameInputStyle()}
            value={username}
            onChangeText={(text: string) => {
              const limpio = text.trim().toLowerCase();

              setUsername(limpio);
              setUsernameDisponible(null);
            }}
            onBlur={revisarUsername}
            placeholder="@usuario"
            placeholderTextColor="#888"
            autoCapitalize="none"
          />

          {username.length > 0 && (
            <Text
              style={
                usernameActual
                  ? styles.neutralText
                  : usernameDisponibleValido
                    ? styles.validText
                    : styles.invalidText
              }
            >
              {verificandoUsername
                ? "Verificando usuario..."
                : usernameActual
                  ? "Nombre de usuario actual"
                  : usernameDisponibleValido
                    ? "Nombre de usuario disponible"
                    : usernameInvalido
                      ? "Usuario inválido o ya registrado"
                      : "Escribe un nombre de usuario válido"}
            </Text>
          )}

          <Text style={styles.label}>Correo electrónico</Text>

          <TextInput
            style={getInputStyle(emailValido, correo)}
            value={correo}
            onChangeText={setCorreo}
            placeholder="correo@gmail.com"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {correo.length > 0 && (
            <Text style={emailValido ? styles.validText : styles.invalidText}>
              {emailValido
                ? "Correo válido"
                : "Debe tener formato nombre@algo.algo"}
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Cambiar contraseña</Text>

          <View
            style={getPasswordContainerStyle(
              passwordValida,
              passwordNueva,
            )}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="Nueva contraseña"
              placeholderTextColor="#888"
              secureTextEntry={!mostrarPasswordNueva}
              value={passwordNueva}
              onChangeText={setPasswordNueva}
            />

            <TouchableOpacity
              onPress={() =>
                setMostrarPasswordNueva(!mostrarPasswordNueva)
              }
            >
              <Ionicons
                name={
                  mostrarPasswordNueva
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {passwordNueva.length > 0 && (
            <Text
              style={passwordValida ? styles.validText : styles.invalidText}
            >
              {passwordValida
                ? "Contraseña segura"
                : "Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"}
            </Text>
          )}

          <View
            style={getPasswordContainerStyle(
              passwordsCoinciden,
              confirmPassword,
            )}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#888"
              secureTextEntry={!mostrarConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              onPress={() =>
                setMostrarConfirmPassword(!mostrarConfirmPassword)
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

          {confirmPassword.length > 0 && (
            <Text
              style={
                passwordsCoinciden ? styles.validText : styles.invalidText
              }
            >
              {passwordsCoinciden
                ? "Las contraseñas coinciden"
                : "Las contraseñas no coinciden"}
            </Text>
          )}

          <View style={styles.passwordRules}>
            <Text style={styles.ruleText}>• Mínimo 8 caracteres</Text>
            <Text style={styles.ruleText}>• 1 mayúscula</Text>
            <Text style={styles.ruleText}>• 1 minúscula</Text>
            <Text style={styles.ruleText}>• 1 número</Text>
            <Text style={styles.ruleText}>• 1 carácter especial</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={abrirConfirmacion}>
          <Ionicons name="save-outline" size={22} color="#fff" />

          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirmar cambios</Text>

            <Text style={styles.modalText}>
              Ingresa tu contraseña actual para guardar los cambios.
            </Text>

            <View
              style={getPasswordContainerStyle(
                passwordConfirmacion.length > 0,
                passwordConfirmacion,
              )}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña actual"
                placeholderTextColor="#888"
                secureTextEntry={!mostrarPasswordActual}
                value={passwordConfirmacion}
                onChangeText={setPasswordConfirmacion}
              />

              <TouchableOpacity
                onPress={() =>
                  setMostrarPasswordActual(!mostrarPasswordActual)
                }
              >
                <Ionicons
                  name={
                    mostrarPasswordActual
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setPasswordConfirmacion("");
                }}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={guardarCambios}
              >
                <Text style={styles.confirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  imageContainer: {
    position: "relative",
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 12,
    color: "#111",
  },

  subtitle: {
    color: "#666",
    marginTop: 5,
    fontSize: 15,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 22,
    padding: 20,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#111",
  },

  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#111",
  },

  input: {
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 8,
    fontSize: 15,
    borderWidth: 2,
    borderColor: "#e5e5e5",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    paddingHorizontal: 15,
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
    height: 56,
    fontSize: 15,
    color: "#111",
  },

  validText: {
    color: "#2E7D32",
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 13,
  },

  neutralText: {
    color: "#777",
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 13,
  },

  invalidText: {
    color: "#c68928",
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 13,
  },

  passwordRules: {
    marginTop: 5,
  },

  ruleText: {
    color: "#666",
    marginBottom: 4,
  },

  saveButton: {
    height: 56,
    backgroundColor: "#111",
    marginHorizontal: 20,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalBox: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },

  modalText: {
    color: "#666",
    marginBottom: 15,
  },

  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },

  confirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },

  cancelText: {
    color: "#111",
    fontWeight: "bold",
  },

  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
