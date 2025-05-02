import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Image, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import tw from "twrnc";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();


  const validateForm = () => {
    let newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://172.20.10.6:1000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
  
      if (data.token) {
        // Store the token in AsyncStorage
        await AsyncStorage.setItem("authToken", data.token);
  
        // Fetch user details using the token
        const userResponse = await fetch("http://172.20.10.6:1000/api/users/fetch", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        });
  
        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log("User Data:", userData); // Debug log
  
          // Store user details in AsyncStorage
          await AsyncStorage.setItem("userDetails", JSON.stringify(userData));
  
          // Log in the user and navigate to the next screen
          login(data.token);
          navigation.navigate("HelloScreen");
        } else {
          Alert.alert("Error", "Failed to fetch user details.");
        }
      } else {
        Alert.alert("Error", "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      Alert.alert("Error", "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw`flex-1 bg-gray-900`}>
      <View style={tw`flex-1 justify-center items-center px-6 py-8`}>
        <Image source={{ uri: "https://via.placeholder.com/150" }} style={tw`w-24 h-24 mb-10 rounded-full bg-gray-800 p-2`} />
        
        <Text style={tw`text-3xl font-bold text-gray-100 mb-2`}>Welcome</Text>
        <Text style={tw`text-gray-400 text-base mb-8`}>Sign in to continue</Text>

        {/* Email Input */}
        <View style={tw`w-full max-w-md mb-5`}>
          <TextInput
            style={tw`w-full p-4 rounded-lg bg-gray-800 text-gray-200 border ${isFocusedEmail ? "border-blue-500" : errors.email ? "border-red-500" : "border-gray-700"}`}
            placeholder="Email"
            placeholderTextColor="#6B7280"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsFocusedEmail(true)}
            onBlur={() => setIsFocusedEmail(false)}
          />
          {errors.email && <Text style={tw`text-red-400 text-sm mt-1`}>{errors.email}</Text>}
        </View>

        {/* Password Input */}
        <View style={tw`w-full max-w-md mb-5`}>
          <View style={tw`relative`}>
            <TextInput
              style={tw`w-full p-4 rounded-lg bg-gray-800 text-gray-200 border ${isFocusedPassword ? "border-blue-500" : errors.password ? "border-red-500" : "border-gray-700"} pr-12`}
              placeholder="Password"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setIsFocusedPassword(true)}
              onBlur={() => setIsFocusedPassword(false)}
            />
            <TouchableOpacity style={tw`absolute right-3 top-1/2 -translate-y-1/2`} onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeSlashIcon size={20} color="#9CA3AF" /> : <EyeIcon size={20} color="#9CA3AF" />}
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={tw`text-red-400 text-sm mt-1`}>{errors.password}</Text>}
        </View>

        {/* Login Button */}
        <TouchableOpacity style={tw`w-full max-w-md p-4 rounded-lg bg-blue-600 ${isLoading ? "opacity-70" : "opacity-100"}`} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-center text-white text-lg font-medium`}>Sign In</Text>}
        </TouchableOpacity>

        {/* Signup Link */}
        <TouchableOpacity style={tw`mt-6`} onPress={() => navigation.navigate("Signup")}>
          <Text style={tw`text-gray-400 text-base`}>
            New here? <Text style={tw`text-blue-400 font-medium`}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}