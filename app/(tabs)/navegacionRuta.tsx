import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ORS_API_KEY } from "../../config/keys";
import API from "../../services/api";
import MapWebView, { MapWebViewRef } from "../componentes/MapWebView";

type Lugar = {
  lug_id: number;
  lug_nombre: string;
  lug_descripcion: string;
  imagen_principal_url: string | null;
  lug_latitud: number;
  lug_longitud: number;
  orden_en_ruta?: number;
  orden_en_experiencia?: number;
  momento?: string;
};

type Ubicacion = {
  lat: number;
  lng: number;
};

export default function NavegacionRuta() {
  const params = useLocalSearchParams();

  // const categoria = Array.isArray(params.categoria)
  //   ? params.categoria[0]
  //   : params.categoria;

  const categoriaParam = Array.isArray(params.categoria)
  ? params.categoria[0]
  : params.categoria;

const categoria =
  categoriaParam && categoriaParam.trim() !== "" ? categoriaParam : null;

  // const exp_id = Array.isArray(params.exp_id)
  //   ? params.exp_id[0]
  //   : params.exp_id;

  const exp_idParam = Array.isArray(params.exp_id)
  ? params.exp_id[0]
  : params.exp_id;

const exp_id = exp_idParam && exp_idParam.trim() !== "" ? exp_idParam : null;

  const nombre = Array.isArray(params.nombre)
    ? params.nombre[0]
    : params.nombre;

    const origen = Array.isArray(params.origen)
  ? params.origen[0]
  : params.origen;

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(true);
  const [indiceActual, setIndiceActual] = useState(0);
  const [miUbicacion, setMiUbicacion] = useState<Ubicacion | null>(null);

  const mapRef = useRef<MapWebViewRef>(null);

  

  function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
  

  

  useEffect(() => {
    obtenerMiUbicacion();
  }, []);

  useEffect(() => {
    if (exp_id || categoria) {
      obtenerLugaresRuta();
    } else {
      setLoading(false);
    }
  }, [exp_id, categoria]);

  useEffect(() => {
    if (lugares.length > 0) {
      const markers = lugares.map((lugar) => ({
        id: lugar.lug_id,
        lat: Number(lugar.lug_latitud),
        lng: Number(lugar.lug_longitud),
        title: lugar.lug_nombre,
      }));

      setTimeout(() => {
        if (!markers.length) return;

        mapRef.current?.setRouteMarkers({
          markers,
          activeIndex: indiceActual,
          userLocation: miUbicacion ?? null,
        });
      }, 500);
    }
  }, [lugares, indiceActual, miUbicacion]);


 

//por calles 
//   useEffect(() => {
//   if (miUbicacion && lugares.length > 0) {
//     setTimeout(() => {
//       obtenerRutaEntreLugaresORS();
//     }, 1000);
//   }
// }, [miUbicacion, indiceActual, lugares]);

useEffect(() => {
  if (lugares.length > 0) {
    const markers = lugares.map((lugar) => ({
      id: lugar.lug_id,
      lat: Number(lugar.lug_latitud),
      lng: Number(lugar.lug_longitud),
      title: lugar.lug_nombre,
    }));

    setTimeout(() => {
      if (!markers.length) return;

      mapRef.current?.setRouteMarkers({
        markers,
        activeIndex: indiceActual,
        userLocation: miUbicacion ?? null,
      });

      setTimeout(() => {
        obtenerRutaEntreLugaresORS();

        if (miUbicacion) {
          obtenerRutaUsuarioAlLugarORS();
        }
      }, 400);
    }, 500);
  }
}, [lugares, indiceActual, miUbicacion]);

// RUTA ENTRE TODOS LOS LUGARES
// useEffect(() => {
//   if (lugares.length > 1) {
//     setTimeout(() => {
//       obtenerRutaEntreLugaresORS();
//     }, 1000);
//   }
// }, [lugares.length]);


// // MI UBICACIÓN → LUGAR ACTUAL
// useEffect(() => {
//   if (miUbicacion && lugares.length > 0) {
//     setTimeout(() => {
//       obtenerRutaUsuarioAlLugarORS();
//     }, 1000);
//   }
// }, [miUbicacion, indiceActual]);

  const obtenerMiUbicacion = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permiso de ubicación denegado");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setMiUbicacion({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      console.log("Error obteniendo ubicación:", error);
    }
  };

  const obtenerLugaresRuta = async () => {
    try {
      let res;

      if (exp_id) {
        res = await API.get(`/experiencias/${exp_id}/lugares`);
      } else {
        res = await API.get(
          `/lugares?categoria=${encodeURIComponent(categoria || "")}`
        );
      }

      const data: Lugar[] = res.data;

      const lugaresOrdenados = [...data].sort((a, b) => {
        const ordenA = a.orden_en_experiencia ?? a.orden_en_ruta ?? 0;
        const ordenB = b.orden_en_experiencia ?? b.orden_en_ruta ?? 0;
        return ordenA - ordenB;
      });

      setLugares(lugaresOrdenados);

      if (id) {
        const indiceInicial = lugaresOrdenados.findIndex(
          (item) => item.lug_id.toString() === id
        );

        if (indiceInicial >= 0) {
          setIndiceActual(indiceInicial);
        }
      } else {
        setIndiceActual(0);
      }
    } catch (error) {
      console.log("Error cargando navegación de ruta:", error);
    } finally {
      setLoading(false);
    }
  };


//POR CALLES
const obtenerRutaEntreLugaresORS = async () => {
  try {
    if (lugares.length < 2) return;

    const coordsDirectos: [number, number][] = lugares.map((lugar) => [
      Number(lugar.lug_longitud),
      Number(lugar.lug_latitud),
    ]);

    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: coordsDirectos,
        }),
      }
    );

    const data = await res.json();

    if (!data.features || data.features.length === 0) {
      console.log("ORS falló, usando línea directa");

      mapRef.current?.drawORSRoute({
        coordinates: coordsDirectos,
      });

      return;
    }

    const coordinates: [number, number][] =
      data.features[0].geometry.coordinates || [];

    console.log("RUTA ENTRE LUGARES:", coordinates.length);

    mapRef.current?.drawORSRoute({
      coordinates,
    });
  } catch (error) {
    console.log("Error ruta entre lugares, usando línea directa:", error);

    const coordsDirectos: [number, number][] = lugares.map((lugar) => [
      Number(lugar.lug_longitud),
      Number(lugar.lug_latitud),
    ]);

    mapRef.current?.drawORSRoute({
      coordinates: coordsDirectos,
    });
  }
};

const obtenerRutaUsuarioAlLugarORS = async () => {
  try {
    if (!miUbicacion || lugares.length === 0) return;

    const lugarActual = lugares[indiceActual];

    const coordsDirectos: [number, number][] = [
      [miUbicacion.lng, miUbicacion.lat],
      [
        Number(lugarActual.lug_longitud),
        Number(lugarActual.lug_latitud),
      ],
    ];

    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: coordsDirectos,
        }),
      }
    );

    const data = await res.json();

    if (!data.features || data.features.length === 0) {
      console.log("ORS usuario-lugar falló, usando línea directa");

      mapRef.current?.drawUserORSRoute({
        coordinates: coordsDirectos,
      });

      return;
    }

    const coordinates: [number, number][] =
      data.features[0].geometry.coordinates || [];

    mapRef.current?.drawUserORSRoute({
      coordinates,
    });
  } catch (error) {
    console.log("Error ruta usuario-lugar, usando línea directa:", error);

    if (!miUbicacion || lugares.length === 0) return;

    const lugarActual = lugares[indiceActual];

    const coordsDirectos: [number, number][] = [
      [miUbicacion.lng, miUbicacion.lat],
      [
        Number(lugarActual.lug_longitud),
        Number(lugarActual.lug_latitud),
      ],
    ];

    mapRef.current?.drawUserORSRoute({
      coordinates: coordsDirectos,
    });
  }
};




  const siguienteLugar = () => {
    if (indiceActual < lugares.length - 1) {
      setIndiceActual(indiceActual + 1);
    }
  };

  const anteriorLugar = () => {
    if (indiceActual > 0) {
      setIndiceActual(indiceActual - 1);
    }
  };

  const irADetalle = () => {
    const lugarActual = lugares[indiceActual];

    router.push({
  pathname: "/detallesLugar" as any,
  params: {
    id: lugarActual.lug_id.toString(),
    exp_id: exp_id?.toString() || "",
    nombre: nombre || "",
  },
});
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#7B2CBF" />
        <Text style={styles.mensaje}>Cargando ruta...</Text>
      </SafeAreaView>
    );
  }

  if (!lugares.length) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.mensaje}>
          No se encontraron lugares para esta ruta.
        </Text>
      </SafeAreaView>
    );
  }

  const lugarActual = lugares[indiceActual];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>

          <Text style={styles.titulo}>
            {nombre ? nombre : `Ruta ${categoria}`}
          </Text>
        </View> */}

        <View style={styles.header}>
  <TouchableOpacity
    style={styles.backButton}
    // onPress={() => router.back()}
    onPress={() => router.replace((origen as any) || "/(tabs)/rutas")}
  >
    <Ionicons name="arrow-back" size={24} color="#fff" />
  </TouchableOpacity>

  <Text style={styles.titulo}>
    {nombre ? nombre : `Ruta ${categoria}`}
  </Text>
</View>

        



        <Text style={styles.progreso}>
          Punto {indiceActual + 1} de {lugares.length}
        </Text>

        <View style={styles.mapContainer}>
          <MapWebView
            ref={mapRef}
            initialLat={Number(lugarActual.lug_latitud)}
            initialLng={Number(lugarActual.lug_longitud)}
          />
        </View>

        <View style={styles.card}>
          <Image
            source={{
              uri:
                lugarActual.imagen_principal_url ||
                "https://via.placeholder.com/300",
            }}
            style={styles.imagen}
          />

          {lugarActual.momento && (
            <Text style={styles.momento}>{lugarActual.momento}</Text>
          )}

          <Text style={styles.nombre}>{lugarActual.lug_nombre}</Text>
          <Text style={styles.descripcion}>{lugarActual.lug_descripcion}</Text>

          <TouchableOpacity style={styles.botonDetalle} onPress={irADetalle}>
            <Text style={styles.textoBotonDetalle}>Ver detalle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.botonesRow}>
          <TouchableOpacity
            style={[
              styles.botonNav,
              indiceActual === 0 && styles.botonDeshabilitado,
            ]}
            onPress={anteriorLugar}
            disabled={indiceActual === 0}
          >
            <Text style={styles.textoBoton}>Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonNav,
              indiceActual === lugares.length - 1 && styles.botonDeshabilitado,
            ]}
            onPress={siguienteLugar}
            disabled={indiceActual === lugares.length - 1}
          >
            <Text style={styles.textoBoton}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  mensaje: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
  },
  titulo: {
  flex: 1,
  fontSize: 23,
  fontWeight: "900",
  color: "#fff",
},
  progreso: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 5,
  },
  card: {
    marginTop: 12,
    backgroundColor: "#f3e8ff",
    borderRadius: 16,
    padding: 12,
  },
  imagen: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#ddd",
    marginBottom: 10,
  },
  momento: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#7B2CBF",
    marginBottom: 4,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
  },
  descripcion: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
  },
  botonesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 20,
  },
  botonNav: {
    backgroundColor: "#7B2CBF",
    width: "48%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  botonDeshabilitado: {
    backgroundColor: "#c9a7eb",
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
  botonDetalle: {
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotonDetalle: {
    color: "#fff",
    fontWeight: "bold",
  },
  // headerRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginTop: 15,
  // },

    header: {
  backgroundColor: "#7B2CBF",
  paddingTop: 15,
  paddingBottom: 24,
  paddingHorizontal: 15,
  // borderBottomLeftRadius: 0,
  // borderBottomRightRadius: 0,
  flexDirection: "row",
  alignItems: "center",
  elevation: 6,
  marginHorizontal: -18,
},
  // backButton: {
  //   position: "absolute",
  //   top: -18,
  //   left: 2,
  //   zIndex: 10,
  // },

  backButton: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "rgba(255,255,255,0.18)",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 14,
},



  mapContainer: {
    height: 260,
    marginTop: 18,
    marginBottom: 20,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
});