import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import SavingsPlanCard from '../../components/SavingsPlanCard';
import GroupCard from '../../components/GroupCard';

const DashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [savingsPlans, setSavingsPlans] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavingsPlans = async () => {
      try {
        const response = await api.get('/savings'); // Fetch savings plans from the backend
        setSavingsPlans(response.data); // Set the fetched data to the state
      } catch (error) {
        console.error('Error fetching savings plans:', error.response?.data || error.message);
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchSavingsPlans();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch savings plans
        const savingsResponse = await api.get('/savings');
        setSavingsPlans(savingsResponse.data);

        // Fetch groups
        const groupsResponse = await api.get('/groups');
        setGroups(groupsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 p-4 bg-gray-100`}>
      <Text style={tw`text-xl font-bold mb-4`}>Welcome, {user?.firstName}!</Text>
      
      <View style={tw`mb-6`}>
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={tw`text-lg font-semibold`}>Your Savings Plans</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreateSavingsPlan')}>
            <Text style={tw`text-blue-600`}>+ New</Text>
          </TouchableOpacity>
        </View>
        
        {savingsPlans.length === 0 ? (
          <Text style={tw`text-gray-500`}>No savings plans yet</Text>
        ) : (
          <FlatList
            vertical
            data={savingsPlans}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <SavingsPlanCard 
                plan={item} 
                onPress={() => navigation.navigate('SavingsPlanDetail', { planId: item._id })}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`py-2`}
          />
        )}
      </View>
        
 {/* Groups Section */}
 <View style={tw`mb-6`}>
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={tw`text-lg font-semibold`}>Your Groups</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')}>
            <Text style={tw`text-blue-600`}>+ New</Text>
          </TouchableOpacity>
        </View>
        
        {groups.length === 0 ? (
          <Text style={tw`text-gray-500`}>No groups yet</Text>
        ) : (
          <FlatList
            horizontal
            data={groups}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <GroupCard 
                group={item} 
                onPress={() => navigation.navigate('GroupDetail', { groupId: item._id })}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`py-2`}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;