/**
 * Pantalla del Chatbot
 *
 * Permite al usuario escribir sus preferencias de ruta turística.
 * El mensaje se envía al backend, donde se procesan los intereses,
 * presupuesto y tiempo disponible para recomendar una ruta.
 *
 * Además muestra las recomendaciones del backend en tarjetas visuales
 * con imagen, descripción, ruta y datos del lugar.
 */

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import API from "../../services/api";

type Lugar = {
  lug_id: number;
  lug_nombre: string;
  lug_descripcion: string;
  lug_latitud?: string;
  lug_longitud?: string;
  imagen_principal_url?: string;
  lug_tags?: string;
  rut_id?: number;
  rut_nombre?: string;
  rut_descripcion?: string;
  rut_color?: string;
  experiencias?: any[];
  transportes?: any[];
  score?: number;
};

type Mensaje = {
  id: string;
  texto: string;
  tipo: "usuario" | "bot";
  lugares?: Lugar[];
  modo?: "gemini" | "local";
};


export default function Chatbot() {
  // Guarda el texto que escribe el usuario
  const [mensaje, setMensaje] = useState("");

  // Indica si se está esperando respuesta del backend
  const [loading, setLoading] = useState(false);

  // Guarda la conversación completa
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: "1",
      texto:
        "Hola, soy tu asistente de Explora TRC. Dime qué tipo de ruta quieres, tu presupuesto y cuánto tiempo tienes.",
      tipo: "bot",
      modo: "local",
    },
  ]);

  // Referencia para hacer scroll automático al último mensaje
  const flatListRef = useRef<FlatList<Mensaje>>(null);

  /**
   * Envía el mensaje del usuario al backend.
   * Después recibe la respuesta del chatbot y la muestra en pantalla.
   */
  const enviarMensaje = async () => {
    if (!mensaje.trim() || loading) return;

    const textoEnviado = mensaje.trim();

    const mensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      texto: textoEnviado,
      tipo: "usuario",
    };

    setMensajes((prev) => [...prev, mensajeUsuario]);
    setMensaje("");
    setLoading(true);

    try {
      const res = await API.post("/chatbot", {
        mensaje: textoEnviado,
      });

      const mensajeBot: Mensaje = {
        id: Date.now().toString() + "-bot",
        texto: res.data.respuesta || "No encontré una respuesta.",
        tipo: "bot",
        lugares: res.data.lugares || [],
        modo: res.data.modo || "local",
      };

      setMensajes((prev) => [...prev, mensajeBot]);
    } catch (error) {
      const mensajeError: Mensaje = {
        id: Date.now().toString() + "-error",
        texto: "No pude conectarme con el asistente.",
        tipo: "bot",
        modo: "local",
      };

      setMensajes((prev) => [...prev, mensajeError]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <View style={styles.content}>
          {/* Encabezado de la pantalla */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.back} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>Asistente de rutas</Text>
          </View>

          {/* Lista de mensajes */}
          <FlatList
            ref={flatListRef}
            data={mensajes}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.messages}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.bubble,
                  item.tipo === "usuario"
                    ? styles.userBubble
                    : styles.botBubble,
                ]}
              >
                <Text style={styles.messageText}>{item.texto}</Text>

                {/* Indica si la respuesta usó Gemini o lógica local */}
                {item.tipo === "bot" && item.modo ? (
                  <Text style={styles.modoTexto}>
                    {item.modo === "gemini"
                      ? "Respuesta asistida por IA"
                      : "Respuesta optimizada"}
                  </Text>
                ) : null}

                {/* Tarjetas de lugares recomendados */}
                {item.tipo === "bot" &&
                  item.lugares?.map((lugar, index) => (
                    <View
                      key={`${lugar.lug_id}-${lugar.rut_id || "ruta"}-${index}`}
                      style={styles.cardLugar}
                    >
                      {lugar.imagen_principal_url ? (
                        <Image
                          source={{ uri: lugar.imagen_principal_url }}
                          style={styles.imagenLugar}
                        />
                      ) : (
                        <View style={styles.imagenPlaceholder}>
                          <Ionicons
                            name="image-outline"
                            size={35}
                            color="#888"
                          />
                        </View>
                      )}

                      <View style={styles.cardContent}>
                        <Text style={styles.nombreLugar}>
                          {lugar.lug_nombre}
                        </Text>

                        {lugar.rut_nombre ? (
                          <Text style={styles.rutaLugar}>
                            Ruta: {lugar.rut_nombre}
                          </Text>
                        ) : null}

                        <Text style={styles.descripcionLugar} numberOfLines={3}>
                          {lugar.lug_descripcion}
                        </Text>

                        {lugar.experiencias &&
                        lugar.experiencias.length > 0 ? (
                          <Text style={styles.infoExtra}>
                            Experiencias disponibles
                          </Text>
                        ) : null}

                        {lugar.transportes && lugar.transportes.length > 0 ? (
                          <Text style={styles.infoExtra}>
                            Transporte disponible
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  ))}
              </View>
            )}
          />

          {/* Indicador mientras el bot responde */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#02A0C6" />
              <Text style={styles.loadingText}>Buscando recomendaciones...</Text>
            </View>
          ) : null}

          {/* Entrada de texto y botón enviar */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ej. Ruta gastronómica barata de 2 horas"
              value={mensaje}
              onChangeText={setMensaje}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                loading ? styles.sendButtonDisabled : null,
              ]}
              onPress={enviarMensaje}
              disabled={loading}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // Contenedor general de la pantalla
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Contenido principal para acomodar header, mensajes e input
  content: {
    flex: 1,
  },

  // Encabezado superior
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 45,
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: "#02A0C6",
  },

  // Flecha para regresar
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  // Título de pantalla
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },

  // Lista de mensajes
  list: {
    flex: 1,
  },

  // Espaciado interno de mensajes
  messages: {
    padding: 15,
    paddingBottom: 20,
  },

  // Burbuja base
  bubble: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    maxWidth: "92%",
  },

  // Mensajes del usuario
  userBubble: {
    backgroundColor: "#D9FDD3",
    alignSelf: "flex-end",
  },

  // Mensajes del bot
  botBubble: {
    backgroundColor: "#F1F1F1",
    alignSelf: "flex-start",
  },

  // Texto dentro de burbujas
  messageText: {
    fontSize: 15,
    color: "#000",
    lineHeight: 21,
  },

  // Texto que indica si se usó IA o modo local
  modoTexto: {
    fontSize: 11,
    color: "#777",
    marginTop: 6,
    fontStyle: "italic",
  },

  // Tarjeta de lugar recomendado
  cardLugar: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 12,
    overflow: "hidden",
    width: 280,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  // Imagen del lugar
  imagenLugar: {
    width: "100%",
    height: 150,
    backgroundColor: "#ddd",
  },

  // Imagen cuando no hay URL
  imagenPlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
  },

  // Contenido de tarjeta
  cardContent: {
    padding: 12,
  },

  // Nombre del lugar
  nombreLugar: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 5,
  },

  // Ruta relacionada
  rutaLugar: {
    fontSize: 13,
    color: "#02A0C6",
    fontWeight: "bold",
    marginBottom: 5,
  },

  // Descripción del lugar
  descripcionLugar: {
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
    lineHeight: 18,
  },

  // Información extra
  infoExtra: {
    fontSize: 12,
    color: "#444",
    marginTop: 3,
  },

  // Contenedor del indicador de carga
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 8,
  },

  // Texto del indicador de carga
  loadingText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#555",
  },

  // Contenedor inferior del input
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

  // Campo de texto
  input: {
    flex: 1,
    maxHeight: 90,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  // Botón enviar
  sendButton: {
    backgroundColor: "#02A0C6",
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 23,
    marginLeft: 8,
  },

  // Botón deshabilitado
  sendButtonDisabled: {
    backgroundColor: "#8BCDDD",
  },
});