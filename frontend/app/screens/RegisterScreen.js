import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const result = await register(email, password);
    if (!result.success) {
      Alert.alert('Error', result.message);
    } else {
      Alert.alert('Success', 'Account created successfully');
      navigation.navigate('Login');
    }
  };

  return (
    <View style={tw`flex-1 justify-center p-6 bg-white`}>
      <Text style={tw`text-3xl font-bold text-center mb-8 text-blue-600`}>Register</Text>
      
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-6`}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={tw`bg-blue-600 py-4 rounded-lg mb-4`}
        onPress={handleRegister}
      >
        <Text style={tw`text-white text-center font-bold`}>Register</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={tw`text-center text-blue-600`}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;