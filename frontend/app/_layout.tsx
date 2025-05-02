import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HelloScreen from "./HelloScreen";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NotificationProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="HelloScreen" component={HelloScreen} />
      </Stack.Navigator>
      </NotificationProvider>
      </AuthProvider>
  );
}

