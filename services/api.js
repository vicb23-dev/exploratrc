/**
 * Archivo de configuración de la API.
 * Se utiliza Axios para realizar las peticiones al backend.
 * Aquí se define la URL base del servidor.
 */
import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.9:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ====================
// MAPAS
// ====================

export async function searchPlace(query) {
  const res = await API.get(`/maps/search?q=${encodeURIComponent(query)}`);
  return res.data;
}

export async function reversePlace(lat, lon) {
  const res = await API.get(`/maps/reverse?lat=${lat}&lon=${lon}`);
  return res.data;
}

export async function getNearby(lat, lon, type = "restaurant") {
  const res = await API.get(
    `/maps/nearby?lat=${lat}&lon=${lon}&type=${encodeURIComponent(type)}`,
  );
  return res.data;
}

export default API;
