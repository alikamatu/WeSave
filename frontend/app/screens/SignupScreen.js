import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import tw from 'twrnc';

export default function SignupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://172.20.10.6:1000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account created successfully!");
        navigation.replace("Login");
      } else {
        Alert.alert("Signup Failed", data.message || "Something went wrong!");
      }
    } catch (error) {
      Alert.alert("Error", "Network error! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 bg-gray-900`}
    >
      <View style={tw`flex-1 justify-center items-center px-6 py-8`}>
        {/* Title */}
        <Text style={tw`text-3xl font-bold text-gray-100 mb-2`}>
          Create Account
        </Text>
        <Text style={tw`text-gray-400 text-base mb-8`}>
          Sign up to get started
        </Text>

        {/* Name Input */}
        <View style={tw`w-full max-w-md mb-5`}>
          <TextInput
            style={tw`w-full p-4 rounded-lg bg-gray-800 text-gray-200 border ${
              isFocusedName ? 'border-blue-500' : errors.name ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Full Name"
            placeholderTextColor="#6B7280"
            value={name}
            onChangeText={setName}
            onFocus={() => setIsFocusedName(true)}
            onBlur={() => setIsFocusedName(false)}
          />
          {errors.name && (
            <Text style={tw`text-red-400 text-sm mt-1`}>{errors.name}</Text>
          )}
        </View>

        {/* Email Input */}
        <View style={tw`w-full max-w-md mb-5`}>
          <TextInput
            style={tw`w-full p-4 rounded-lg bg-gray-800 text-gray-200 border ${
              isFocusedEmail ? 'border-blue-500' : errors.email ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Email"
            placeholderTextColor="#6B7280"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsFocusedEmail(true)}
            onBlur={() => setIsFocusedEmail(false)}
          />
          {errors.email && (
            <Text style={tw`text-red-400 text-sm mt-1`}>{errors.email}</Text>
          )}
        </View>

        {/* Password Input */}
        <View style={tw`w-full max-w-md mb-5`}>
          <View style={tw`relative`}>
            <TextInput
              style={tw`w-full p-4 rounded-lg bg-gray-800 text-gray-200 border ${
                isFocusedPassword ? 'border-blue-500' : errors.password ? 'border-red-500' : 'border-gray-700'
              } pr-12`}
              placeholder="Password"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setIsFocusedPassword(true)}
              onBlur={() => setIsFocusedPassword(false)}
            />
            <TouchableOpacity
              style={tw`absolute right-3 top-1/2 -translate-y-1/2`}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon size={20} color="#9CA3AF" />
              ) : (
                <EyeIcon size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={tw`text-red-400 text-sm mt-1`}>{errors.password}</Text>
          )}
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={tw`w-full max-w-md p-4 rounded-lg bg-blue-600 ${
            isLoading ? 'opacity-70' : 'opacity-100'
          }`}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={tw`text-center text-white text-lg font-medium`}>
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          style={tw`mt-6`}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={tw`text-gray-400 text-base`}>
            Already have an account?{" "}
            <Text style={tw`text-blue-400 font-medium`}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
