import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import SavingsPlanCard from '../../components/SavingsPlanCard';
import GroupCard from '../../components/GroupCard';

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [savingsPlans, setSavingsPlans] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [savingsResponse, groupsResponse] = await Promise.all([
        api.get('/savings'),
        api.get('/groups')
      ]);
      setSavingsPlans(savingsResponse.data);
      setGroups(groupsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Image 
          source={require('../../assets/images/loading-chat.gif')}
          style={tw`w-32 h-32`}
        />
        <Text style={tw`mt-4 text-gray-600`}>Loading your dashboard...</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={tw`flex-row justify-between items-center mb-6`}>
      <View>
        <Text style={tw`text-1xl font-bold text-gray-800`}>Welcome, {user?.firstName}!</Text>
      </View>
      <TouchableOpacity 
        onPress={logout}
        style={tw`bg-gray-100 p-3 rounded-full`}
      >
        <Icon name="logout" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

  const renderSavingsPlans = () => (
    <View style={tw`mb-8`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-xl font-bold text-gray-800`}>Savings Plans</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('CreateSavingsPlan')}
          style={tw`flex-row items-center`}
        >
          <Text style={tw`text-blue-600 mr-1`}>New</Text>
          <Icon name="add-circle" size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>
      
      {savingsPlans.length === 0 ? (
        <View style={tw`bg-white p-6 rounded-lg shadow-sm items-center`}>
          <Icon name="savings" size={40} color="#D1D5DB" />
          <Text style={tw`text-gray-500 mt-2`}>No savings plans yet</Text>
          <TouchableOpacity
            style={tw`mt-4 bg-blue-600 py-2 px-4 rounded-lg`}
            onPress={() => navigation.navigate('CreateSavingsPlan')}
          >
            <Text style={tw`text-white font-medium`}>Create Plan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savingsPlans}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <SavingsPlanCard
              plan={item}
              onPress={() => navigation.navigate('SavingsPlanDetail', { 
                planId: item._id,
                planName: item.name 
              })}
            />
          )}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`py-2`}
        />
      )}
    </View>
  );

  const renderGroups = () => (
    <View style={tw`mb-6`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-xl font-bold text-gray-800`}>Groups</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('CreateGroup')}
          style={tw`flex-row items-center`}
        >
          <Text style={tw`text-blue-600 mr-1`}>New</Text>
          <Icon name="add-circle" size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>
      
      {groups.length === 0 ? (
        <View style={tw`bg-white p-6 rounded-lg shadow-sm items-center`}>
          <Icon name="groups" size={40} color="#D1D5DB" />
          <Text style={tw`text-gray-500 mt-2`}>No groups yet</Text>
          <TouchableOpacity
            style={tw`mt-4 bg-blue-600 py-2 px-4 rounded-lg`}
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <Text style={tw`text-white font-medium`}>Create Group</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <GroupCard
              group={item}
              onPress={() => navigation.navigate('GroupDetail', { 
                groupId: item._id,
                groupName: item.name 
              })}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`py-2`}
        />
      )}
    </View>
  );

  return (
    <FlatList
      style={tw`flex-1 bg-gray-50 p-6`}
      data={[]}
      ListHeaderComponent={
        <>
          {renderHeader()}
          {renderSavingsPlans()}
          {renderGroups()}
        </>
      }
      renderItem={() => null}
      showsVerticalScrollIndicator={false}
      keyExtractor={() => 'dashboard'}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#3B82F6']}
        />
      }
    />
  );
};

export default DashboardScreen;