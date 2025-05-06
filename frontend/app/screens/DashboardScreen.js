import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
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

  const renderSavingsPlans = () => (
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
          data={savingsPlans}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <SavingsPlanCard
              plan={item}
              onPress={() => navigation.navigate('SavingsPlanDetail', { planId: item._id })}
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
          data={groups}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <GroupCard
              group={item}
              onPress={() => navigation.navigate('GroupDetail', { groupId: item._id })}
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
      style={tw`flex-1 p-4 bg-gray-100`}
      data={[]}
      ListHeaderComponent={
        <>
          <Text style={tw`text-xl font-bold mb-4`}>Welcome, {user?.firstName}!</Text>
          {renderSavingsPlans()}
          {renderGroups()}
        </>
      }
      renderItem={() => null}
      showsVerticalScrollIndicator={false}
      keyExtractor={() => 'dashboard'}
    />
  );
};

export default DashboardScreen;