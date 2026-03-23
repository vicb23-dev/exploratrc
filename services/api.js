/**
 * Archivo de configuración de la API.
 * Se utiliza Axios para realizar las peticiones al backend.
 * Aquí se define la URL base del servidor.
 */
import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.11:5000/api",

  //En caso de que no te funcionen la app en el cel y si en la web
  //cambiar la direccion por la de la red de tu lap
});

export default API;
