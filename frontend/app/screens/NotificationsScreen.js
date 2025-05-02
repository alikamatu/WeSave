import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl 
} from "react-native";
import { useNotifications } from "../context/NotificationContext";
import tw from "twrnc";
import { BellIcon, CheckIcon, TrashIcon } from "react-native-heroicons/outline";

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAllAsRead,
    markAsRead,
    clearAllNotifications
  } = useNotifications();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-gray-900 justify-center items-center`}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 bg-gray-900 justify-center items-center p-5`}>
        <Text style={tw`text-red-500 text-lg text-center`}>
          Error loading notifications: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-900`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-5 pt-12 pb-3 border-b border-gray-700`}>
        <View style={tw`flex-row items-center`}>
          <BellIcon size={24} color="#3B82F6" style={tw`mr-2`} />
          <Text style={tw`text-white text-xl font-bold`}>
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Text>
        </View>
        
        <View style={tw`flex-row`}>
          {notifications.length > 0 && (
            <>
              <TouchableOpacity 
                onPress={markAllAsRead}
                disabled={unreadCount === 0}
                style={tw`mr-4`}
              >
                <CheckIcon 
                  size={20} 
                  color={unreadCount === 0 ? "#6B7280" : "#3B82F6"} 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={clearAllNotifications}>
                <TrashIcon size={20} color="#EF4444" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Notification List */}
      <ScrollView
        contentContainerStyle={tw`pb-20`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
          />
        }
      >
        {notifications.length === 0 ? (
          <View style={tw`flex-1 justify-center items-center mt-20`}>
            <BellIcon size={40} color="#6B7280" style={tw`mb-4`} />
            <Text style={tw`text-gray-400 text-lg`}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => markAsRead(notification.id)}
              style={tw`p-4 mx-3 my-2 rounded-lg ${
                notification.read 
                  ? "bg-gray-800" 
                  : "bg-blue-900/20 border-l-4 border-blue-500"
              }`}
            >
              <View style={tw`flex-row justify-between items-start`}>
                <Text 
                  style={tw`text-white text-base flex-1 ${
                    notification.read ? "font-normal" : "font-semibold"
                  }`}
                >
                  {notification.message}
                </Text>
                {!notification.read && (
                  <View style={tw`w-2 h-2 rounded-full bg-blue-500 ml-2 mt-1`} />
                )}
              </View>
              <Text style={tw`text-gray-400 text-xs mt-1`}>
                {formatTimeAgo(notification.timestamp)}
                {notification.type === "emergency" && (
                  <Text style={tw`text-red-400 ml-2`}>• Emergency</Text>
                )}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Helper function to format time ago
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  
  return "Just now";
}