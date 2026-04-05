import axios from "axios";
import { useEffect, useState } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Mapa() {
  const [lugares, setLugares] = useState([]);

  useEffect(() => {
    axios
      .get("http://192.168.1.11:5000/lugares?q=restaurantes")
      .then((res) => setLugares(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 19.4326,
          longitude: -99.1332,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {lugares.map((lugar, i) => (
          <Marker
            key={i}
            coordinate={{
              latitude: parseFloat(lugar.lat),
              longitude: parseFloat(lugar.lon),
            }}
            title={lugar.display_name}
          />
        ))}
      </MapView>
    </View>
  );
}
