import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapViewComponent from "../components/MapViewComponent";
import EmergencyContacts from "../components/EmergencyContacts";
import SosButton from "../components/SosButton";
import AlertNotifications from "../components/AlertNotifications";
import NotificationIcon from "../components/NotificationIcon";
import tw from "twrnc";

export default function DashboardScreen() {
  return (
    <View style={tw`flex-1 bg-gray-900 pt-8`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center p-5`}>
        <Text style={tw`text-white text-xl font-bold`}>Dashboard</Text>
        <NotificationIcon />
      </View>

      <ScrollView style={tw`flex-1 px-5`}>
        {/* Live Map */}
        <View style={tw`mb-5`}>
          <Text style={tw`text-white text-lg font-semibold mb-2`}>Live Location</Text>
          <MapViewComponent />
        </View>

        {/* Emergency Contacts */}
        <View style={tw`mb-5`}>
          <Text style={tw`text-white text-lg font-semibold mb-2`}>Emergency Contacts</Text>
          <EmergencyContacts />
        </View>

        {/* Live Alerts */}
        <View style={tw`mb-5`}>
          <Text style={tw`text-white text-lg font-semibold mb-2`}>Live Alerts</Text>
          <AlertNotifications />
        </View>

        {/* SOS Button */}
        <View style={tw`items-center my-5`}>
          <SosButton />
        </View>
      </ScrollView>
    </View>
  );
}
