import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'tailwind-react-native-classnames';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CreateGroup = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    contributionAmount: '',
    frequency: 'weekly',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    members: '',
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [openFrequencyPicker, setOpenFrequencyPicker] = useState(false);
  const [frequencyItems, setFrequencyItems] = useState([
    { label: 'Weekly', value: 'weekly' },
    { label: 'Bi-Weekly', value: 'biweekly' },
    { label: 'Monthly', value: 'monthly' },
  ]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (event, selectedDate, field) => {
    const currentDate = selectedDate || formData[field];
    setFormData(prev => ({ ...prev, [field]: currentDate }));
    if (field === 'startDate') setShowStartDatePicker(false);
    if (field === 'endDate') setShowEndDatePicker(false);
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleCreateGroup = async () => {
    const requiredFields = ['name', 'targetAmount', 'contributionAmount', 'frequency'];
    const missingField = requiredFields.find(field => !formData[field]);
    
    if (missingField) {
      Alert.alert('Error', `Please fill in the ${missingField} field`);
      return;
    }

    if (formData.startDate >= formData.endDate) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    userId = user?.id || "131243242143123"; // Fallback for testing

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        admin: userId, // Replace with user ID from context
        members: formData.members.split(',').map(id => id.trim()).filter(id => id),
        startDate: formatDate(formData.startDate),
        endDate: formatDate(formData.endDate),
      };

      const response = await api.post('/groups', payload);
      Alert.alert('Success', 'Group created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create group');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`} contentContainerStyle={tw`p-6`}>
      <View style={tw`mb-6`}>
        <Text style={tw`text-2xl font-bold text-center text-gray-800`}>Create New Group</Text>
        <Text style={tw`text-center text-gray-500 mt-2`}>
          Set up your savings group and invite members
        </Text>
      </View>

      {/* Group Name */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 font-medium mb-1`}>Group Name *</Text>
        <TextInput
          style={tw`bg-white border border-gray-200 rounded-lg p-4`}
          placeholder="e.g. Family Vacation Fund"
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
        />
      </View>

      {/* Description */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 font-medium mb-1`}>Description</Text>
        <TextInput
          style={tw`bg-white border border-gray-200 rounded-lg p-4 h-20`}
          placeholder="What's this group about?"
          value={formData.description}
          onChangeText={(text) => handleChange('description', text)}
          multiline
        />
      </View>

      {/* Financial Goals */}
      <View style={tw`flex-row justify-between mb-4`}>
        <View style={tw`w-1/2 pr-2`}>
          <Text style={tw`text-gray-700 font-medium mb-1`}>Target Amount *</Text>
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

        <View style={tw`w-1/2 pl-2`}>
          <Text style={tw`text-gray-700 font-medium mb-1`}>Contribution *</Text>
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

      {/* Date Pickers */}
      <View style={tw`flex-row justify-between mb-4`}>
        <View style={tw`w-1/2 pr-2`}>
          <Text style={tw`text-gray-700 font-medium mb-1`}>Start Date *</Text>
          <TouchableOpacity
            style={tw`bg-white border border-gray-200 rounded-lg p-4 flex-row justify-between items-center`}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text>{formatDate(formData.startDate)}</Text>
            <Icon name="calendar-today" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={tw`w-1/2 pl-2`}>
          <Text style={tw`text-gray-700 font-medium mb-1`}>End Date *</Text>
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

      {/* Members */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-gray-700 font-medium mb-1`}>Invite Members</Text>
        <TextInput
          style={tw`bg-white border border-gray-200 rounded-lg p-4`}
          placeholder="Enter member IDs (comma separated)"
          value={formData.members}
          onChangeText={(text) => handleChange('members', text)}
        />
        <Text style={tw`text-gray-500 text-xs mt-1`}>
          You can add members later from the group settings
        </Text>
      </View>

      <TouchableOpacity
        style={[
          tw`py-4 rounded-lg flex-row justify-center items-center`,
          isSubmitting ? tw`bg-blue-400` : tw`bg-blue-600`,
        ]}
        onPress={handleCreateGroup}
        disabled={isSubmitting}
      >
        <Icon name="group-add" size={20} color="white" style={tw`mr-2`} />
        <Text style={tw`text-white font-bold`}>
          {isSubmitting ? 'Creating Group...' : 'Create Group'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateGroup;