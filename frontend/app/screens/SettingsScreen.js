import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function SettingsScreen() {
  const [fontSize, setFontSize] = useState("medium"); // Options: small, medium, large

  const fontSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const recommendations = [
    {
      id: "1",
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water daily to support overall health.",
    },
    {
      id: "2",
      title: "Daily Metrics",
      description: "Check your blood pressure and heart rate every morning.",
    },
    {
      id: "3",
      title: "Medication Tips",
      description: "Take medications with a full glass of water unless advised otherwise.",
    },
    {
      id: "4",
      title: "Stay Active",
      description: "Aim for a 15-minute walk daily to maintain mobility.",
    },
    {
      id: "5",
      title: "Regular Checkups",
      description: "Schedule appointments with your doctor every 6 months.",
    },
  ];

  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  const renderRecommendation = ({ item }) => (
    <View style={tw`bg-gray-800 rounded-lg p-4 mb-4`}>
      <Text style={tw`text-white font-semibold mb-2`} 
            style={[tw`text-white font-semibold mb-2`, { fontSize: fontSizes[fontSize] }]}>
        {item.title}
      </Text>
      <Text style={[tw`text-gray-300`, { fontSize: fontSizes[fontSize] - 2 }]}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <ScrollView style={tw`flex-1 bg-gray-900 p-5`}>
      <Text style={tw`text-white text-3xl font-bold mb-5 mt-12`} 
            style={[tw`text-white text-3xl font-bold mb-5 mt-12`, { fontSize: fontSizes[fontSize] + 4 }]}>
        Settings
      </Text>

      {/* Font Size Adjustment */}
      <View style={tw`mb-6`}>
        <Text style={[tw`text-white text-xl font-semibold mb-3`, { fontSize: fontSizes[fontSize] }]}>
          Font Size
        </Text>
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity
            style={tw`flex-1 bg-${fontSize === "small" ? "blue-500" : "gray-700"} rounded-lg p-3 mr-2`}
            onPress={() => handleFontSizeChange("small")}
          >
            <Text style={[tw`text-white text-center`, { fontSize: fontSizes[fontSize] }]}>
              Small
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 bg-${fontSize === "medium" ? "blue-500" : "gray-700"} rounded-lg p-3 mx-2`}
            onPress={() => handleFontSizeChange("medium")}
          >
            <Text style={[tw`text-white text-center`, { fontSize: fontSizes[fontSize] }]}>
              Medium
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 bg-${fontSize === "large" ? "blue-500" : "gray-700"} rounded-lg p-3 ml-2`}
            onPress={() => handleFontSizeChange("large")}
          >
            <Text style={[tw`text-white text-center`, { fontSize: fontSizes[fontSize] }]}>
              Large
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recommendations */}
      <View>
        <Text style={[tw`text-white text-xl font-semibold mb-3`, { fontSize: fontSizes[fontSize] }]}>
          Health Recommendations
        </Text>
        <FlatList
          data={recommendations}
          renderItem={renderRecommendation}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={[tw`text-gray-400 text-center`, { fontSize: fontSizes[fontSize] - 2 }]}>
              No recommendations available
            </Text>
          }
        />
      </View>
    </ScrollView>
  );
}