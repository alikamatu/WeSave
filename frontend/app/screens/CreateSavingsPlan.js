import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import api from '../services/api'; // Import your Axios instance

const CreateSavingsPlan = ({ navigation }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [withdrawalLimit, setWithdrawalLimit] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCreatePlan = async () => {
    if (!name || !targetAmount || !frequency || !contributionAmount || !withdrawalLimit || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const response = await api.post('/savings', {
        name,
        targetAmount,
        frequency,
        contributionAmount,
        withdrawalLimit,
        startDate,
        endDate,
      });

      Alert.alert('Success', 'Savings plan created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating savings plan:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create savings plan');
    }
  };

  return (
    <View style={tw`flex-1 p-6 bg-white`}>
      <Text style={tw`text-2xl font-bold text-center mb-6`}>Create Savings Plan</Text>

      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Plan Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Target Amount"
        value={targetAmount}
        onChangeText={setTargetAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Frequency (e.g., Weekly)"
        value={frequency}
        onChangeText={setFrequency}
      />
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Contribution Amount"
        value={contributionAmount}
        onChangeText={setContributionAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Withdrawal Limit"
        value={withdrawalLimit}
        onChangeText={setWithdrawalLimit}
        keyboardType="numeric"
      />
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Start Date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="End Date (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />

      <TouchableOpacity
        style={tw`bg-blue-600 py-4 rounded-lg`}
        onPress={handleCreatePlan}
      >
        <Text style={tw`text-white text-center font-bold`}>Create Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateSavingsPlan;