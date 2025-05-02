import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { PhoneIcon } from "react-native-heroicons/outline";
import tw from 'twrnc';

const contacts = [
  { name: "Police", number: "911" },
  { name: "Fire Department", number: "101" },
  { name: "Ambulance", number: "102" },
];

export default function EmergencyContacts() {
  return (
    <View>
      {contacts.map((contact, index) => (
        <TouchableOpacity key={index} onPress={() => Linking.openURL(`tel:${contact.number}`)}
          style={tw`flex-row items-center justify-between p-4 bg-gray-800 rounded-lg mb-2`}>
          <Text style={tw`text-white text-lg`}>{contact.name}</Text>
          <PhoneIcon size={20} color="white" />
        </TouchableOpacity>
      ))}
    </View>
  );
}
