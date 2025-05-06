import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import tw from 'tailwind-react-native-classnames';
import api from '../services/api';

const SavingsPlanDetail = ({ route }) => {
  const { planId } = route.params;
  const [planDetails, setPlanDetails] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await api.get(`/savings/${planId}`);
        setPlanDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plan details:', error);
        Alert.alert('Error', 'Failed to fetch savings plan details');
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [planId]);

  const handlePayment = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    try {
      // Send the contribution amount to the backend
      await api.post(`/savings/${planId}/contribute`, { amount: parseFloat(amount) });

      Alert.alert('Success', 'Contribution added successfully');

      // Fetch the updated plan details
      const updatedPlan = await api.get(`/savings/${planId}`);
      setPlanDetails(updatedPlan.data);

      // Clear the input field
      setAmount('');
    } catch (error) {
      console.error('Error adding contribution:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add contribution');
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!planDetails) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>No details available</Text>
      </View>
    );
  }

  const progress = Math.min(planDetails.currentAmount / planDetails.targetAmount, 1);

  return (
    <ScrollView style={tw`flex-1 p-6 bg-white`}>
      <Text style={tw`text-lg font-bold mb-4`}>Savings Plan Detail</Text>
      <Text style={tw`text-gray-700 mb-2`}>Plan Name: {planDetails.name}</Text>
      <Text style={tw`text-gray-700 mb-2`}>Target Amount: {planDetails.targetAmount}</Text>
      <Text style={tw`text-gray-700 mb-2`}>Current Amount: {planDetails.currentAmount}</Text>
      
      <Text style={tw`text-gray-700 mb-2`}>Progress:</Text>
      <ProgressBar progress={progress} color="#4CAF50" style={tw`h-2 mb-4`} />
      <Text style={tw`text-gray-700 mb-4`}>{(progress * 100).toFixed(2)}% completed</Text>

      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Enter Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={tw`bg-blue-600 py-4 rounded-lg`}
        onPress={handlePayment}
      >
        <Text style={tw`text-white text-center font-bold`}>Add Contribution</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SavingsPlanDetail;