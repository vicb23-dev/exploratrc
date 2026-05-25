/**
 * Archivo de configuración de la API.
 * Se utiliza Axios para realizar las peticiones al backend.
 * Aquí se define la URL base del servidor.
 */
import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.13:5000/api",
  //baseURL: "https://exploratrc.onrender.com/api",
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

// ====================
// TRANSPORTES
// ====================

export async function getTransportesPorLugar(id) {
  const res = await API.get(`/transportes/lugar/${id}`);
  return res.data;
}
export default API;

//Perfil
export async function verificarUsername(username, id) {
  const res = await API.get(
    `/usuarios/verificar-username?username=${username}&id=${id}`,
  );

  return res.data;
}

export async function actualizarPerfil(id, data) {
  const res = await API.put(`/usuarios/${id}/perfil`, data);
  return res.data;
}

export async function subirImagen(imagen) {
  const formData = new FormData();

  formData.append("imagen", {
    uri: imagen,
    name: "profile.jpg",
    type: "image/jpeg",
  });

  const res = await API.post(
    "/usuarios/upload-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data;
}


