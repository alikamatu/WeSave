import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import api from '../services/api'; // Import your Axios instance
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to get the logged-in user

const CreateGroup = ({ navigation }) => {
  const { user } = useContext(AuthContext); // Get the logged-in user
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [members, setMembers] = useState(''); // Comma-separated member IDs

  const handleCreateGroup = async () => {
    if (!name || !targetAmount || !contributionAmount || !frequency || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const response = await api.post('/groups', {
        name,
        description,
        admin: user._id, // Set the logged-in user as the admin
        members: members.split(',').map((id) => id.trim()), // Convert comma-separated IDs to an array
        targetAmount,
        contributionAmount,
        frequency,
        startDate,
        endDate,
      });

      Alert.alert('Success', 'Group created successfully');
      navigation.goBack(); // Navigate back to the Dashboard
    } catch (error) {
      console.error('Error creating group:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create group');
    }
  };

  return (
    <ScrollView style={tw`flex-1 p-6 bg-white`}>
      <Text style={tw`text-2xl font-bold text-center mb-6`}>Create a New Group</Text>

      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Group Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
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
        placeholder="Contribution Amount"
        value={contributionAmount}
        onChangeText={setContributionAmount}
        keyboardType="numeric"
      />

      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Frequency (e.g., Weekly, Monthly)"
        value={frequency}
        onChangeText={setFrequency}
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

      <TextInput
        style={tw`border border-gray-300 rounded-lg p-4 mb-4`}
        placeholder="Member IDs (comma-separated)"
        value={members}
        onChangeText={setMembers}
      />

      <TouchableOpacity
        style={tw`bg-blue-600 py-4 rounded-lg`}
        onPress={handleCreateGroup}
      >
        <Text style={tw`text-white text-center font-bold`}>Create Group</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateGroup;