import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeIcon,
  ChatBubbleOvalLeftEllipsisIcon as ChatIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon as CogIcon,
  PlusIcon,
} from 'react-native-heroicons/outline';
import tw from 'twrnc';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ChatScreen from '../screens/ChatScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreatePost from '../screens/CreatePost';
import CommentScreen from '../screens/CommentScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: tw`bg-gray-800 border-t-0`,
        tabBarItemStyle: tw`py-2`,
        tabBarIcon: ({ focused, size }) => {
          const iconColor = focused ? '#ffffff' : '#9CA3AF';
          
          switch (route.name) {
            case 'Dashboard':
              return <HomeIcon size={size} color={iconColor} />;
            case 'Metrics':
              return <PlusIcon size={size} color={iconColor} />;
            case 'Alerts':
              return <BellIcon size={size} color={iconColor} />;
            case 'Profile':
              return <UserIcon size={size} color={iconColor} />;
            case 'Settings':
              return <CogIcon size={size} color={iconColor} />;
            default:
              return null;
          }
        },
        tabBarLabel: ({ focused }) => (
          <Text style={tw`text-xs ${focused ? 'text-white' : 'text-gray-400'}`}>
            {route.name}
          </Text>
        ),
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Metrics" component={ChatScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="CommentScreen" component={CommentScreen} />
      </Stack.Navigator>
  );
}