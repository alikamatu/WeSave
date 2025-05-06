import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ScrollView, Image, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ProgressBar } from 'react-native-paper';
import api from '../services/api';
import { RefreshControl } from 'react-native-gesture-handler';

const GroupDetail = ({ route, navigation }) => {
  const { groupId } = route.params;
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroupDetails = async () => {
    try {
      const response = await api.get(`/groups/${groupId}`);
      setGroup(response.data);
    } catch (error) {
      console.error('Error fetching group details:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch group details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroupDetails();
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text style={tw`mt-4 text-gray-600`}>Loading group details...</Text>
      </View>
    );
  }

  if (!group) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Icon name="error-outline" size={48} color="#6B7280" />
        <Text style={tw`mt-4 text-gray-600 text-lg`}>Group not found</Text>
        <TouchableOpacity
          style={tw`mt-6 bg-blue-600 py-3 px-6 rounded-lg`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-white font-bold`}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate progress percentage
  const progress = group.currentAmount / group.targetAmount;
  const progressPercentage = Math.min(progress * 100, 100).toFixed(2);

  return (
    <ScrollView 
      style={tw`flex-1 bg-gray-50`}
      contentContainerStyle={tw`pb-6`}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#3B82F6']}
        />
      }
    >
      {/* Header Section */}
      <View style={tw`bg-white shadow-sm pb-4`}>
        <View style={tw`p-6`}>
          <Text style={tw`text-2xl font-bold text-gray-800`}>{group.name}</Text>
          <Text style={tw`text-gray-500 mt-1`}>
            {group.description || 'No description provided'}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={tw`px-6 mb-4`}>
          <View style={tw`flex-row justify-between mb-1`}>
            <Text style={tw`text-gray-700 font-medium`}>Group Progress</Text>
            <Text style={tw`text-blue-600 font-medium`}>{progressPercentage}%</Text>
          </View>
          <ProgressBar 
            progress={progress} 
            color="#3B82F6" 
            style={tw`h-3 rounded-full`}
          />
          <View style={tw`flex-row justify-between mt-2`}>
            <Text style={tw`text-gray-500 text-sm`}>${group.currentAmount} saved</Text>
            <Text style={tw`text-gray-500 text-sm`}>${group.targetAmount} target</Text>
          </View>
        </View>
      </View>

      {/* Details Section */}
      <View style={tw`bg-white mt-4 p-6 shadow-sm`}>
        <View style={tw`flex-row justify-between mb-4`}>
          <View>
            <Text style={tw`text-gray-500 text-sm`}>Frequency</Text>
            <Text style={tw`text-gray-800 font-medium`}>{group.frequency}</Text>
          </View>
          <View>
            <Text style={tw`text-gray-500 text-sm`}>Contribution</Text>
            <Text style={tw`text-gray-800 font-medium`}>${group.contributionAmount}</Text>
          </View>
        </View>

        <View style={tw`flex-row justify-between mb-4`}>
          <View>
            <Text style={tw`text-gray-500 text-sm`}>Start Date</Text>
            <Text style={tw`text-gray-800 font-medium`}>
              {new Date(group.startDate).toLocaleDateString()}
            </Text>
          </View>
          <View>
            <Text style={tw`text-gray-500 text-sm`}>End Date</Text>
            <Text style={tw`text-gray-800 font-medium`}>
              {new Date(group.endDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View>
          <Text style={tw`text-gray-500 text-sm`}>Admin</Text>
          <Text style={tw`text-gray-800 font-medium`}>
            {group.admin?.firstName} {group.admin?.lastName}
          </Text>
        </View>
      </View>

      {/* Members Section */}
      <View style={tw`bg-white mt-4 p-6 shadow-sm`}>
        <Text style={tw`text-lg font-semibold text-gray-800 mb-3`}>Members ({group.members.length})</Text>
        <FlatList
          data={group.members}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={tw`flex-row items-center py-3 border-b border-gray-100`}>
              <View style={tw`bg-blue-100 w-10 h-10 rounded-full justify-center items-center mr-3`}>
                <Text style={tw`text-blue-600 font-medium`}>
                  {item.firstName?.charAt(0)}{item.lastName?.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={tw`text-gray-800 font-medium`}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={tw`text-gray-500 text-xs`}>
                  {item._id === group.admin?._id ? 'Admin' : 'Member'}
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Action Buttons */}
      <View style={tw`px-6 mt-6`}>
        <TouchableOpacity
          style={tw`bg-blue-600 py-4 rounded-lg flex-row justify-center items-center mb-3`}
          onPress={() => navigation.navigate('GroupChat', { 
            groupId,
            groupName: group.name 
          })}
        >
          <Icon name="chat" size={20} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white font-bold`}>Group Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`border border-blue-600 py-4 rounded-lg flex-row justify-center items-center`}
          onPress={() => navigation.navigate('MakeContribution', { groupId })}
        >
          <Icon name="attach-money" size={20} color="#3B82F6" style={tw`mr-2`} />
          <Text style={tw`text-blue-600 font-bold`}>Make Contribution</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default GroupDetail;