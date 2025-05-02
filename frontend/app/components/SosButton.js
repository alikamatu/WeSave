import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import tw from 'twrnc';

export default function SosButton() {
  const handleSOS = () => {
    Alert.alert("SOS Alert Sent!", "Emergency services have been notified.");
  };

  return (
    <TouchableOpacity
      style={tw`bg-red-600 p-5 rounded-full w-40 items-center`}
      onPress={handleSOS}
    >
      <Text style={tw`text-white text-lg font-bold`}>SOS</Text>
    </TouchableOpacity>
  );
}
