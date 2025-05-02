import React, { useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { BellIcon } from "react-native-heroicons/outline";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { useNotifications } from "../context/NotificationContext"; // Import the context directly

export default function NotificationIcon() {
  const navigation = useNavigation();
  const { notifications = [] } = useContext(useNotifications) || {}; // Proper context usage

  // Safely check for unread notifications
  const hasUnread = notifications?.some?.((n) => !n?.read) ?? false;

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate("Notifications")}
      style={tw`relative mr-4`}
    >
      <BellIcon size={28} color="white" />
      {hasUnread && (
        <View 
          style={tw`absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-gray-800`}
        />
      )}
    </TouchableOpacity>
  );
}