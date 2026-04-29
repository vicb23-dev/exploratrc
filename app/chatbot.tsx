/**
 * Pantalla del Chatbot
 *
 * Permite al usuario escribir sus preferencias de ruta turística.
 * El mensaje se envía al backend, donde se procesan los intereses,
 * presupuesto y tiempo disponible para recomendar una ruta.
 */

import { router } from "expo-router";
import { useRef, useState } from "react";
import {
    FlatList,
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
import API from "../services/api";

type Mensaje = {
  id: string;
  texto: string;
  tipo: "usuario" | "bot";
};

export default function Chatbot() {
  // Guarda el texto que escribe el usuario
  const [mensaje, setMensaje] = useState("");

  // Guarda la conversación completa
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: "1",
      texto:
        "Hola, soy tu asistente. Dime qué tipo de ruta quieres, tu presupuesto y cuánto tiempo tienes.",
      tipo: "bot",
    },
  ]);

  // Referencia para hacer scroll automático al último mensaje
  const flatListRef = useRef<FlatList<Mensaje>>(null);

  /**
   * Envía el mensaje del usuario al backend.
   * Después recibe la respuesta del chatbot y la muestra en pantalla.
   */
  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    const textoEnviado = mensaje.trim();

    const mensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      texto: textoEnviado,
      tipo: "usuario",
    };

    setMensajes((prev) => [...prev, mensajeUsuario]);
    setMensaje("");

    try {
      const res = await API.post("/chatbot", {
        mensaje: textoEnviado,
      });

      const mensajeBot: Mensaje = {
        id: Date.now().toString() + "-bot",
        texto: res.data.respuesta || "No encontré una respuesta.",
        tipo: "bot",
      };

      setMensajes((prev) => [...prev, mensajeBot]);
    } catch (error) {
      const mensajeError: Mensaje = {
        id: Date.now().toString() + "-error",
        texto: "No pude conectarme con el asistente.",
        tipo: "bot",
      };

      setMensajes((prev) => [...prev, mensajeError]);
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
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.back}>←</Text>
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
              </View>
            )}
          />

          {/* Entrada de texto y botón enviar */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ej. Ruta cultural barata de 2 horas"
              value={mensaje}
              onChangeText={setMensaje}
              multiline
            />

            <TouchableOpacity style={styles.sendButton} onPress={enviarMensaje}>
              <Text style={styles.sendText}>Enviar</Text>
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
    backgroundColor: "#2BC52A",
  },

  // Flecha para regresar
  back: {
    fontSize: 30,
    color: "#fff",
    marginRight: 15,
  },

  // Título de pantalla
  title: {
    fontSize: 20,
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
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "80%",
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
    backgroundColor: "#2BC52A",
    paddingHorizontal: 15,
    paddingVertical: 12,
    justifyContent: "center",
    borderRadius: 20,
    marginLeft: 8,
  },

  // Texto del botón enviar
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
