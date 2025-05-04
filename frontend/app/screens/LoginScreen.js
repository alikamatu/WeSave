// filepath: /Users/user/Documents/GitHub/WeSave/frontend/app/screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import tw from 'twrnc';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);

  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
  //     setUser(response.data.user);
  //     navigation.navigate('Groups');
  //   } catch (error) {
  //     Alert.alert('Error', error.response?.data?.error || 'Login failed');
  //   }
  // };

  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Login</Text>
      <TextInput
        style={tw`border border-gray-300 p-2 mb-4 rounded`}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={tw`border border-gray-300 p-2 mb-4 rounded`}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login"/>
      <Text style={tw`mt-4 text-blue-500`} onPress={() => navigation.navigate('Signup')}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
}