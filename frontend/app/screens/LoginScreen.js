import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <View style={tw`flex-1 justify-center p-6 bg-white`}>
      <Text style={tw`text-3xl font-bold text-center mb-8 text-blue-600`}>Savings App</Text>
      
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-6`}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={tw`bg-blue-600 py-4 rounded-lg mb-4`}
        onPress={handleLogin}
      >
        <Text style={tw`text-white text-center font-bold`}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={tw`text-center text-blue-600`}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;