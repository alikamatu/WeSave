import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import AsyncStorage from "@react-native-async-storage/async-storage";


const API_URL = "http://172.20.10.6:1000/api/posts"; // Replace with your backend URL
const USER_API_URL = "http://172.20.10.6:1000/api/users/fetch"; // Replace with your user details endpoint

export default function CreatePostScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Retrieved Token:", token); // Debug log
      if (!token) {
        Alert.alert("Error", "User is not logged in.");
        return;
      }
  
      const response = await fetch(USER_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
        console.log("User Data:", userData); // Debug log
        setUser(userData);
      } else {
        const errorText = await response.text(); // Read the response as text
        console.error("Error Response:", errorText); // Debug log
        Alert.alert("Error", "Failed to fetch user details.");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      Alert.alert("Error", "An error occurred while fetching user details.");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Title and content cannot be empty.");
      return;
    }
  
    if (!user) {
      Alert.alert("Error", "User details not available.");
      return;
    }
  
    const requestBody = {
      title,
      content,
      user: {
        id: user._id,
        name: user.name,
      },
    };
  
    console.log("Request Body:", requestBody); // Debug log
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        Alert.alert("Success", "Post created successfully!");
        navigation.goBack();
      } else {
        const errorData = await response.json();
        console.error("Error Response:", errorData); // Debug log
        Alert.alert("Error", errorData.message || "Failed to create post.");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      Alert.alert("Error", "An error occurred while creating the post.");
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-900 p-5 pt-12`}>
      <TextInput
        style={tw`bg-gray-800 text-white p-4 rounded-lg mb-4`}
        placeholder="Title"
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={tw`bg-gray-800 text-white p-4 rounded-lg mb-4 h-32`}
        placeholder="Content"
        placeholderTextColor="#9CA3AF"
        multiline
        value={content}
        onChangeText={setContent}
      />
      <TouchableOpacity
        style={tw`bg-blue-500 p-4 rounded-lg`}
        onPress={handleSubmit}
      >
        <Text style={tw`text-white text-center`}>Submit Post</Text>
      </TouchableOpacity>
    </View>
  );
}