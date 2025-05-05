import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import api from '../services/api'; // Import your Axios instance

const SavingsPlanDetail = ({ route }) => {
  const { planId } = route.params;
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePayment = async () => {
    if (!amount || !phoneNumber) {
      Alert.alert('Error', 'Please enter both amount and phone number');
      return;
    }

    try {
      const response = await api.post('/payments/mtn-momo', {
        planId,
        amount,
        phoneNumber,
      });

      Alert.alert('Success', 'Payment processed successfully');
    } catch (error) {
      console.error('Error processing payment:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to process payment');
    }
  };

  return (
    <View style={tw`flex-1 p-6 bg-white`}>
      <Text style={tw`text-lg font-bold mb-4`}>Savings Plan Detail</Text>
      <Text style={tw`text-gray-700 mb-2`}>Plan ID: {planId}</Text>

      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Enter Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={tw`bg-blue-600 py-4 rounded-lg`}
        onPress={handlePayment}
      >
        <Text style={tw`text-white text-center font-bold`}>Make Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SavingsPlanDetail;