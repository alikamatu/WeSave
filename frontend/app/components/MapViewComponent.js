import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import tw from 'twrnc';

export default function MapViewComponent() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  if (!location) return <ActivityIndicator size="large" color="white" />;

  return (
    <MapView
      style={tw`h-60 w-full rounded-lg`}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker coordinate={location} title="You are here" />
    </MapView>
  );
}
