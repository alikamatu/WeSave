import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import * as Notifications from "expo-notifications";
import tw from 'twrnc';

export default function AlertNotifications() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        Notifications.addNotificationReceivedListener((notification) => {
          setAlerts((prev) => [...prev, notification.request.content]);
        });
      }
    })();
  }, []);

  return (
    <View>
      {alerts.length === 0 ? (
        <Text style={tw`text-white text-center text-lg`}>No new alerts</Text>
      ) : (
        alerts.map((alert, index) => (
          <View key={index} style={tw`p-4 bg-yellow-600 rounded-lg mb-2`}>
            <Text style={tw`text-white font-bold`}>{alert.title}</Text>
            <Text style={tw`text-white`}>{alert.body}</Text>
          </View>
        ))
      )}
    </View>
  );
}
