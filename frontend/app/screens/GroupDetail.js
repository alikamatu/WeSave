import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import api from '../services/api';

const GroupDetail = ({ route, navigation }) => {
  const { groupId } = route.params; // Get the groupId from navigation params
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await api.get(`/groups/${groupId}`);
        setGroup(response.data);
      } catch (error) {
        console.error('Error fetching group details:', error.response?.data || error.message);
        Alert.alert('Error', 'Failed to fetch group details');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading group details...</Text>
      </View>
    );
  }

  if (!group) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 p-4 bg-white`}>
      <Text style={tw`text-2xl font-bold mb-4`}>{group.name}</Text>
      <Text style={tw`text-gray-700 mb-2`}>Description: {group.description || 'No description provided'}</Text>
      <Text style={tw`text-gray-700 mb-2`}>Admin: {group.admin?.firstName} {group.admin?.lastName}</Text>
      <Text style={tw`text-gray-700 mb-2`}>Target Amount: {group.targetAmount}</Text>
      <Text style={tw`text-gray-700 mb-2`}>Current Amount: {group.currentAmount}</Text>
      <Text style={tw`text-gray-700 mb-2`}>Frequency: {group.frequency}</Text>
      <Text style={tw`text-gray-700 mb-2`}>Start Date: {new Date(group.startDate).toLocaleDateString()}</Text>
      <Text style={tw`text-gray-700 mb-2`}>End Date: {new Date(group.endDate).toLocaleDateString()}</Text>

      <Text style={tw`text-lg font-semibold mt-4 mb-2`}>Members:</Text>
      <FlatList
        data={group.members}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text style={tw`text-gray-700`}>{item.firstName} {item.lastName}</Text>
        )}
      />

      <TouchableOpacity
        style={tw`bg-blue-600 py-4 rounded-lg mt-4`}
        onPress={() => navigation.navigate('GroupChat', { groupId })}
      >
        <Text style={tw`text-white text-center font-bold`}>Go to Group Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GroupDetail;