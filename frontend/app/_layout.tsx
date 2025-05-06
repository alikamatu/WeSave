import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import SavingsPlanDetail from './screens/SavingsPlanDetail';
import GroupDetail from './screens/GroupDetail';
import GroupChat from './screens/GroupChat'
import CreateGroup from './screens/CreateGroup';
import CreateSavingsPlan from './screens/CreateSavingsPlan';
import { AuthProvider } from './context/AuthContext';

const Stack = createStackNavigator();

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
      } catch (error) {
        console.error('Error fetching userId from AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={userId ? 'Dashboard' : 'Login'}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="CreateSavingsPlan" component={CreateSavingsPlan} />
          <Stack.Screen name="SavingsPlanDetail" component={SavingsPlanDetail} />
          <Stack.Screen name="CreateGroup" component={CreateGroup} />
          <Stack.Screen name="GroupChat" component={GroupChat} />
          <Stack.Screen name="GroupDetail" component={GroupDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}