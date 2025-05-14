import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../services/api';

const CreateSavingsPlan = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    frequency: 'weekly',
    contributionAmount: '',
    withdrawalLimit: '',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
  });
  const [userId, setUserId] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFrequencyPicker, setOpenFrequencyPicker] = useState(false);
  const [frequencyItems, setFrequencyItems] = useState([
    { label: 'Weekly', value: 'weekly' },
    { label: 'Bi-Weekly', value: 'biweekly' },
    { label: 'Monthly', value: 'monthly' },
  ]);

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserId');
        setUserId(storedUserId);
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };
    fetchUserId();
  }, []);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (event, selectedDate, field) => {
    const currentDate = selectedDate || formData[field];
    setFormData(prev => ({ ...prev, [field]: currentDate }));
    if (field === 'startDate') setShowStartDatePicker(false);
    if (field === 'endDate') setShowEndDatePicker(false);
  };

  const handleCreatePlan = async () => {
    if (!userId) {
      userId = "131243242143123"; // Fallback for testing
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    const requiredFields = ['name', 'targetAmount', 'frequency', 'contributionAmount'];
    const missingField = requiredFields.find(field => !formData[field]);
    
    if (missingField) {
      Alert.alert('Error', `Please fill in the ${missingField} field`);
      return;
    }

    if (formData.startDate >= formData.endDate) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId,
        ...formData,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0],
      };

      await api.post('/savings', payload);
      Alert.alert('Success', 'Savings plan created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create savings plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`} contentContainerStyle={tw`p-6`}>
      <View style={tw`mb-6`}>
        <Text style={tw`text-2xl font-bold text-center text-gray-800`}>Create Savings Plan</Text>
        <Text style={tw`text-center text-gray-500 mt-2`}>
          Set up your savings goals and track your progress
        </Text>
      </View>

      {/* Plan Name */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 font-medium mb-1`}>Plan Name</Text>
        <TextInput
          style={tw`bg-white border border-gray-200 rounded-lg p-4`}
          placeholder="e.g. Vacation Fund"
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
        />
      </View>

      {/* Target Amount */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 font-medium mb-1`}>Target Amount</Text>
        <View style={tw`flex-row items-center bg-white border border-gray-200 rounded-lg overflow-hidden`}>
          <Text style={tw`px-4 text-gray-500`}>$</Text>
          <TextInput
            style={tw`flex-1 p-4`}
            placeholder="0.00"
            value={formData.targetAmount}
            onChangeText={(text) => handleChange('targetAmount', text)}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Frequency */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 font-medium mb-1`}>Contribution Frequency</Text>
        <DropDownPicker
          open={openFrequencyPicker}
          value={formData.frequency}
          items={frequencyItems}
          setOpen={setOpenFrequencyPicker}
          setValue={(callback) => handleChange('frequency', callback(formData.frequency))}
          setItems={setFrequencyItems}
          style={tw`bg-white border border-gray-200 rounded-lg`}
          dropDownContainerStyle={tw`bg-white border border-gray-200 rounded-lg`}
        />
      </View>

      {/* Contribution Amount */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 font-medium mb-1`}>Contribution Amount</Text>
        <View style={tw`flex-row items-center bg-white border border-gray-200 rounded-lg overflow-hidden`}>
          <Text style={tw`px-4 text-gray-500`}>$</Text>
          <TextInput
            style={tw`flex-1 p-4`}
            placeholder="0.00"
            value={formData.contributionAmount}
            onChangeText={(text) => handleChange('contributionAmount', text)}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Withdrawal Limit */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 font-medium mb-1`}>Withdrawal Limit (Optional)</Text>
        <View style={tw`flex-row items-center bg-white border border-gray-200 rounded-lg overflow-hidden`}>
          <Text style={tw`px-4 text-gray-500`}>$</Text>
          <TextInput
            style={tw`flex-1 p-4`}
            placeholder="0.00"
            value={formData.withdrawalLimit}
            onChangeText={(text) => handleChange('withdrawalLimit', text)}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Date Pickers */}
      <View style={tw`flex-row justify-between mb-4`}>
        <View style={tw`w-1/2 pr-2`}>
          <Text style={tw`text-gray-700 font-medium mb-1`}>Start Date</Text>
          <TouchableOpacity
            style={tw`bg-white border border-gray-200 rounded-lg p-4 flex-row justify-between items-center`}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text>{formatDate(formData.startDate)}</Text>
            <Icon name="calendar-today" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={tw`w-1/2 pl-2`}>
          <Text style={tw`text-gray-700 font-medium mb-1`}>End Date</Text>
          <TouchableOpacity
            style={tw`bg-white border border-gray-200 rounded-lg p-4 flex-row justify-between items-center`}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text>{formatDate(formData.endDate)}</Text>
            <Icon name="calendar-today" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={formData.startDate}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, 'startDate')}
          minimumDate={new Date()}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={formData.endDate}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, 'endDate')}
          minimumDate={formData.startDate}
        />
      )}

      <TouchableOpacity
        style={[
          tw`py-4 rounded-lg mt-6 flex-row justify-center items-center`,
          isSubmitting ? tw`bg-blue-400` : tw`bg-blue-600`,
        ]}
        onPress={handleCreatePlan}
        disabled={isSubmitting}
      >
        <Icon name="savings" size={20} color="white" style={tw`mr-2`} />
        <Text style={tw`text-white font-bold`}>
          {isSubmitting ? 'Creating...' : 'Create Savings Plan'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateSavingsPlan;