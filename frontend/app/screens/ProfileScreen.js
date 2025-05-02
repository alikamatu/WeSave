import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

const API_URL = "http://172.20.10.6:1000/api"; // Base API URL

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      const userDetails = await AsyncStorage.getItem("userDetails");
      const userId = userDetails ? JSON.parse(userDetails)?._id : null;

      if (!token || !userId) {
        throw new Error("Authentication required.");
      }

      // Fetch user profile
      const profileResponse = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch profile.");
      }
      const profileData = await profileResponse.json();
      
      // Mock health stats if API doesn't provide them
      const enrichedProfileData = {
        ...profileData,
        healthMetrics: profileData.healthMetrics || {
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 72,
          bloodSugar: 95,
          timestamp: "2025-04-14 10:00 AM",
        },
        conditions: profileData.conditions || ["Hypertension", "Type 2 Diabetes"],
      };
      
      setUser(enrichedProfileData);
    } catch (err) {
      console.error("Error fetching profile data:", err.message);
      Alert.alert("Error", "Unable to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userDetails");
      Alert.alert("Success", "Logged out successfully.");
      navigation.replace("Login");
    } catch (err) {
      console.error("Error logging out:", err);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 bg-gray-900 justify-center items-center`}>
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={tw`flex-1 bg-gray-900 justify-center items-center`}>
        <Text style={tw`text-gray-400 text-lg`}>Failed to load profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-900`}>
      {/* Header */}
      <View style={tw`bg-gray-800 p-4 border-b border-gray-700 pt-12`}>
        <Text style={tw`text-white text-3xl font-bold`}>Profile</Text>
      </View>

      {/* Profile Info */}
      <View style={tw`p-5 items-center`}>
        <View style={tw`w-24 h-24 bg-blue-500 rounded-full mb-4 overflow-hidden`}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={tw`w-full h-full`} />
          ) : (
            <Icon name="person" size={48} color="white" style={tw`mt-6 ml-6`} />
          )}
        </View>
        <Text style={tw`text-white text-xl font-semibold`}>{user.name || "Anonymous"}</Text>
        <Text style={tw`text-gray-400 mt-1 text-lg`}>{user.email || "No email provided"}</Text>
        <Text style={tw`text-gray-500 mt-1 text-lg`}>
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Health Stats */}
      <View style={tw`px-5 mb-6`}>
        <View style={tw`flex-row justify-between items-center mb-3`}>
          <Text style={tw`text-white text-xl font-semibold`}>Health Stats</Text>
          <TouchableOpacity
            style={tw`bg-blue-500 rounded-lg p-2 flex-row items-center`}
            onPress={() => navigation.navigate("Metrics")}
          >
            <Icon name="add" size={20} color="#fff" />
            <Text style={tw`text-white text-lg ml-1`}>Track More</Text>
          </TouchableOpacity>
        </View>

        {/* Latest Metrics */}
        {user.healthMetrics ? (
          <View style={tw`bg-gray-800 rounded-lg p-4 mb-4`}>
            <Text style={tw`text-gray-400 text-lg mb-2`}>{user.healthMetrics.timestamp}</Text>
            <Text style={tw`text-white text-lg`}>
              Blood Pressure: {user.healthMetrics.bloodPressure.systolic}/
              {user.healthMetrics.bloodPressure.diastolic} mmHg
            </Text>
            <Text style={tw`text-white text-lg`}>
              Heart Rate: {user.healthMetrics.heartRate} bpm
            </Text>
            <Text style={tw`text-white text-lg`}>
              Blood Sugar: {user.healthMetrics.bloodSugar} mg/dL
            </Text>
          </View>
        ) : (
          <Text style={tw`text-gray-400 text-lg`}>No health metrics available.</Text>
        )}

        {/* Health Conditions */}
        <Text style={tw`text-white text-lg font-semibold mb-3`}>Health Conditions</Text>
        {user.conditions && user.conditions.length > 0 ? (
          user.conditions.map((condition, index) => (
            <View key={index} style={tw`bg-gray-800 rounded-lg p-3 mb-2`}>
              <Text style={tw`text-white text-lg`}>{condition}</Text>
            </View>
          ))
        ) : (
          <Text style={tw`text-gray-400 text-lg`}>No conditions listed.</Text>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={tw`bg-red-500 p-3 rounded-lg mx-5 mb-5`}
        onPress={handleLogout}
      >
        <Text style={tw`text-white text-center text-lg font-semibold`}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}