import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function HealthMetricScreen() {
  const [metrics, setMetrics] = useState([
    {
      id: "1",
      bloodPressure: { systolic: 120, diastolic: 80 },
      heartRate: 72,
      bloodSugar: 95,
      timestamp: "2025-04-14 10:00 AM",
    },
    {
      id: "2",
      bloodPressure: { systolic: 118, diastolic: 78 },
      heartRate: 70,
      bloodSugar: 90,
      timestamp: "2025-04-13 9:30 AM",
    },
  ]);

  const [newMetric, setNewMetric] = useState({
    systolic: "",
    diastolic: "",
    heartRate: "",
    bloodSugar: "",
  });

  const handleSaveMetric = () => {
    if (
      !newMetric.systolic ||
      !newMetric.diastolic ||
      !newMetric.heartRate ||
      !newMetric.bloodSugar
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const systolic = parseInt(newMetric.systolic);
    const diastolic = parseInt(newMetric.diastolic);
    const heartRate = parseInt(newMetric.heartRate);
    const bloodSugar = parseInt(newMetric.bloodSugar);

    if (
      isNaN(systolic) ||
      isNaN(diastolic) ||
      isNaN(heartRate) ||
      isNaN(bloodSugar) ||
      systolic < 50 ||
      systolic > 250 ||
      diastolic < 30 ||
      diastolic > 150 ||
      heartRate < 30 ||
      heartRate > 200 ||
      bloodSugar < 20 ||
      bloodSugar > 600
    ) {
      Alert.alert("Error", "Please enter valid health metric values");
      return;
    }

    const newEntry = {
      id: (metrics.length + 1).toString(),
      bloodPressure: { systolic, diastolic },
      heartRate,
      bloodSugar,
      timestamp: new Date().toLocaleString(),
    };

    setMetrics([newEntry, ...metrics]);
    setNewMetric({ systolic: "", diastolic: "", heartRate: "", bloodSugar: "" });
    Alert.alert("Success", "Health metrics saved");
  };

  const handleShareData = () => {
    // Simulate sharing data with caregivers
    Alert.alert("Success", "Health data shared with caregivers");
  };

  const renderMetric = ({ item }) => (
    <View style={tw`bg-gray-800 rounded-lg p-4 mb-4`}>
      <Text style={tw`text-gray-400 text-lg mb-2`}>{item.timestamp}</Text>
      <Text style={tw`text-white text-lg`}>
        Blood Pressure: {item.bloodPressure.systolic}/{item.bloodPressure.diastolic} mmHg
      </Text>
      <Text style={tw`text-white text-lg`}>Heart Rate: {item.heartRate} bpm</Text>
      <Text style={tw`text-white text-lg`}>Blood Sugar: {item.bloodSugar} mg/dL</Text>
    </View>
  );

  return (
    <ScrollView style={tw`flex-1 bg-gray-900 p-5`}>
      <Text style={tw`text-white text-3xl font-bold mb-5 mt-12`}>Health Metrics</Text>

      {/* Input Form */}
      <View style={tw`bg-gray-800 rounded-lg p-4 mb-6`}>
        <Text style={tw`text-white text-xl font-semibold mb-3`}>Log New Metrics</Text>

        <Text style={tw`text-white text-lg mb-2`}>Blood Pressure (Systolic)</Text>
        <TextInput
          style={tw`bg-gray-700 text-white text-lg p-3 rounded-lg mb-4`}
          value={newMetric.systolic}
          onChangeText={(text) => setNewMetric({ ...newMetric, systolic: text })}
          placeholder="e.g., 120"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
        />

        <Text style={tw`text-white text-lg mb-2`}>Blood Pressure (Diastolic)</Text>
        <TextInput
          style={tw`bg-gray-700 text-white text-lg p-3 rounded-lg mb-4`}
          value={newMetric.diastolic}
          onChangeText={(text) => setNewMetric({ ...newMetric, diastolic: text })}
          placeholder="e.g., 80"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
        />

        <Text style={tw`text-white text-lg mb-2`}>Heart Rate (bpm)</Text>
        <TextInput
          style={tw`bg-gray-700 text-white text-lg p-3 rounded-lg mb-4`}
          value={newMetric.heartRate}
          onChangeText={(text) => setNewMetric({ ...newMetric, heartRate: text })}
          placeholder="e.g., 72"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
        />

        <Text style={tw`text-white text-lg mb-2`}>Blood Sugar (mg/dL)</Text>
        <TextInput
          style={tw`bg-gray-700 text-white text-lg p-3 rounded-lg mb-4`}
          value={newMetric.bloodSugar}
          onChangeText={(text) => setNewMetric({ ...newMetric, bloodSugar: text })}
          placeholder="e.g., 95"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={tw`bg-blue-500 rounded-lg p-4 flex-row justify-center items-center`}
          onPress={handleSaveMetric}
        >
          <Icon name="save" size={24} color="#fff" />
          <Text style={tw`text-white text-xl font-semibold ml-2`}>Save Metrics</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Metrics */}
      <Text style={tw`text-white text-2xl font-semibold mb-3`}>Recent Metrics</Text>
      <FlatList
        data={metrics}
        renderItem={renderMetric}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={tw`text-gray-400 text-lg text-center mt-10`}>
            No metrics recorded
          </Text>
        }
      />

      {/* Share Button */}
      <TouchableOpacity
        style={tw`bg-green-500 rounded-lg p-4 mt-5 flex-row justify-center items-center`}
        onPress={handleShareData}
      >
        <Icon name="share" size={24} color="#fff" />
        <Text style={tw`text-white text-xl font-semibold ml-2`}>Share with Caregivers</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}