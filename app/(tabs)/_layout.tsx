import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#02A0C6",
        tabBarInactiveTintColor: "#000",
      }}
    >
      
      {/*  MAPA */}
      <Tabs.Screen
        name="mapa"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />

    
      {/*  UBICACIÓN */}
      <Tabs.Screen
        name="rutas"
        options={{
          title: "Rutas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={size} color={color} />
          ),
        }}
      />

     {/* FAVORITOS */}
      <Tabs.Screen
        name="favoritos"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />

      {/* PANTALLAS OCULTAS */}
      <Tabs.Screen name="detallesLugar" options={{ href: null }} />
      <Tabs.Screen name="navegacionRuta" options={{ href: null }} />
      <Tabs.Screen name="rutaCultura" options={{ href: null }} />
      <Tabs.Screen name="rutaEntretenimiento" options={{ href: null }} />
      <Tabs.Screen name="rutaFamiliar" options={{ href: null }} />
      <Tabs.Screen name="rutaGastronomica" options={{ href: null }} />
      <Tabs.Screen name="rutaNight" options={{ href: null }} />
      
    </Tabs>
  );


 
}