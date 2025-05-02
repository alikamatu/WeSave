import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BottomTabNavigator from "./components/BottomTabNavigator";

export default function Home() {
  return (
    <SafeAreaProvider>
      <BottomTabNavigator />
    </SafeAreaProvider>
  );
}
