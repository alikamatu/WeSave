import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await register(formData);
      if (!result.success) {
        Alert.alert('Error', result.message);
      } else {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white`}
    >
      <ScrollView 
        contentContainerStyle={tw`flex-grow justify-center p-6`}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`mb-8`}>
          <Text style={tw`text-3xl font-bold text-center text-blue-600 mb-2`}>Create Account</Text>
          <Text style={tw`text-center text-gray-500`}>Join us to start your savings journey</Text>
        </View>

        {/* First Name */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>First Name</Text>
          <TextInput
            style={[
              tw`border rounded-lg p-4`,
              errors.firstName ? tw`border-red-500 bg-red-50` : tw`border-gray-300 bg-white`
            ]}
            placeholder="John"
            value={formData.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
          />
          {errors.firstName && <Text style={tw`text-red-500 text-xs mt-1`}>{errors.firstName}</Text>}
        </View>

        {/* Last Name */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>Last Name</Text>
          <TextInput
            style={[
              tw`border rounded-lg p-4`,
              errors.lastName ? tw`border-red-500 bg-red-50` : tw`border-gray-300 bg-white`
            ]}
            placeholder="Doe"
            value={formData.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
          />
          {errors.lastName && <Text style={tw`text-red-500 text-xs mt-1`}>{errors.lastName}</Text>}
        </View>

        {/* Email */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>Email</Text>
          <TextInput
            style={[
              tw`border rounded-lg p-4`,
              errors.email ? tw`border-red-500 bg-red-50` : tw`border-gray-300 bg-white`
            ]}
            placeholder="john@example.com"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={tw`text-red-500 text-xs mt-1`}>{errors.email}</Text>}
        </View>

        {/* Phone */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>Phone Number</Text>
          <TextInput
            style={[
              tw`border rounded-lg p-4`,
              errors.phone ? tw`border-red-500 bg-red-50` : tw`border-gray-300 bg-white`
            ]}
            placeholder="0712345678"
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={tw`text-red-500 text-xs mt-1`}>{errors.phone}</Text>}
        </View>

        {/* Password */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-gray-700 mb-1`}>Password</Text>
          <View style={[
            tw`border rounded-lg flex-row items-center`,
            errors.password ? tw`border-red-500 bg-red-50` : tw`border-gray-300 bg-white`
          ]}>
            <TextInput
              style={tw`flex-1 p-4`}
              placeholder="At least 6 characters"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={tw`px-4`}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon name={showPassword ? 'visibility-off' : 'visibility'} size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={tw`text-red-500 text-xs mt-1`}>{errors.password}</Text>}
        </View>

        {/* Confirm Password */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-gray-700 mb-1`}>Confirm Password</Text>
          <TextInput
            style={[
              tw`border rounded-lg p-4`,
              errors.confirmPassword ? tw`border-red-500 bg-red-50` : tw`border-gray-300 bg-white`
            ]}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            secureTextEntry={!showPassword}
          />
          {errors.confirmPassword && <Text style={tw`text-red-500 text-xs mt-1`}>{errors.confirmPassword}</Text>}
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[
            tw`py-4 rounded-lg mb-4 flex-row justify-center items-center`,
            isSubmitting ? tw`bg-blue-400` : tw`bg-blue-600`
          ]}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          <Icon name="person-add" size={20} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white font-bold`}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={tw`flex-row justify-center`}>
          <Text style={tw`text-gray-900`}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={tw`text-blue-600 font-medium`}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;