import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import api from '../services/api';

const MakeContribution = ({ route, navigation }) => {
  const { groupId } = route.params; // Get the groupId from navigation params
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContribution = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/groups/${groupId}/contribute`, { amount: parseFloat(amount) });
      Alert.alert('Success', 'Contribution made successfully');
      navigation.goBack(); // Navigate back to the GroupDetail screen
    } catch (error) {
      console.error('Error making contribution:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to make contribution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 p-6 bg-white`}>
      <Text style={tw`text-2xl font-bold text-center mb-6`}>Make a Contribution</Text>

      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Enter Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={tw`bg-blue-600 py-4 rounded-lg`}
        onPress={handleContribution}
        disabled={loading}
      >
        <Text style={tw`text-white text-center font-bold`}>
          {loading ? 'Processing...' : 'Contribute'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MakeContribution;