import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function AlertsScreen() {
  const [reminders, setReminders] = useState([
    {
      id: "1",
      type: "medication",
      heading: "Aspirin",
      description: "Take with food",
      time: "10:00 AM",
      status: "pending",
    },
    {
      id: "2",
      type: "medication",
      heading: "Metformin",
      description: "After dinner",
      time: "6:00 PM",
      status: "pending",
    },
    {
      id: "3",
      type: "appointment",
      heading: "Dr. Smith - Checkup",
      description: "Bring insurance card",
      time: "2:00 PM",
      status: "pending",
    },
    {
      id: "4",
      type: "appointment",
      heading: "Dentist",
      description: "Routine cleaning",
      time: "4:00 PM",
      status: "pending",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: "medication",
    heading: "",
    description: "",
    time: "",
  });

  const markMedicationTaken = (id) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id && reminder.type === "medication"
          ? { ...reminder, status: "taken" }
          : reminder
      )
    );
    Alert.alert("Success", "Medication marked as taken");
  };

  const confirmAppointment = (id) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id && reminder.type === "appointment"
          ? { ...reminder, status: "confirmed" }
          : reminder
      )
    );
    Alert.alert("Success", "Appointment confirmed");
  };

  const handleAddReminder = () => {
    if (!newReminder.heading || !newReminder.time) {
      Alert.alert("Error", "Please fill in heading and time");
      return;
    }

    setReminders([
      ...reminders,
      {
        id: (reminders.length + 1).toString(),
        type: newReminder.type,
        heading: newReminder.heading,
        description: newReminder.description,
        time: newReminder.time,
        status: "pending",
      },
    ]);

    setNewReminder({ type: "medication", heading: "", description: "", time: "" });
    setModalVisible(false);
  };

  const renderReminder = ({ item }) => (
    <View style={tw`bg-gray-800 rounded-lg p-4 mb-4`}>
      <View style={tw`flex-row justify-between items-center`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-white text-xl font-semibold`}>{item.heading}</Text>
          <Text style={tw`text-gray-400 text-lg`}>{item.description || "No description"}</Text>
          <Text style={tw`text-gray-400 text-lg`}>{item.time}</Text>
          <Text style={tw`text-gray-400 text-lg`}>
            {item.type === "medication" ? "Medication" : "Appointment"} - {item.status}
          </Text>
        </View>
        {item.status === "pending" && (
          <TouchableOpacity
            style={tw`bg-blue-500 rounded-lg p-3`}
            onPress={() =>
              item.type === "medication"
                ? markMedicationTaken(item.id)
                : confirmAppointment(item.id)
            }
          >
            <Text style={tw`text-white text-lg font-semibold`}>
              {item.type === "medication" ? "Mark Taken" : "Confirm"}
            </Text>
          </TouchableOpacity>
        )}
        {item.status !== "pending" && (
          <Icon
            name={item.type === "medication" ? "check-circle" : "event-available"}
            size={30}
            color="#34C759"
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-gray-900 p-5`}>
      <Text style={tw`text-white text-3xl font-bold mb-5 mt-12`}>Alerts & Reminders</Text>
      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={tw`text-gray-400 text-lg text-center mt-10`}>
            No reminders scheduled
          </Text>
        }
      />
      <TouchableOpacity
        style={tw`bg-blue-500 rounded-lg p-4 mt-5 flex-row justify-center items-center`}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={24} color="#fff" />
        <Text style={tw`text-white text-xl font-semibold ml-2`}>Add Reminder</Text>
      </TouchableOpacity>

      {/* Modal for Adding Reminders */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-gray-800 rounded-lg p-6 w-11/12`}>
            <Text style={tw`text-white text-2xl font-bold mb-4`}>Add New Reminder</Text>

            {/* Type Toggle */}
            <View style={tw`flex-row mb-4`}>
              <TouchableOpacity
                style={tw`flex-1 p-3 rounded-lg ${newReminder.type === "medication" ? "bg-blue-500" : "bg-gray-700"}`}
                onPress={() => setNewReminder({ ...newReminder, type: "medication" })}
              >
                <Text style={tw`text-white text-lg text-center`}>Medication</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 p-3 rounded-lg ml-2 ${newReminder.type === "appointment" ? "bg-blue-500" : "bg-gray-700"}`}
                onPress={() => setNewReminder({ ...newReminder, type: "appointment" })}
              >
                <Text style={tw`text-white text-lg text-center`}>Appointment</Text>
              </TouchableOpacity>
            </View>

            {/* Heading Input */}
            <Text style={tw`text-white text-lg mb-2`}>Heading</Text>
            <TextInput
              style={tw`bg-gray-700 text-white text-lg p-3 rounded-lg mb-4`}
              value={newReminder.heading}
              onChangeText={(text) => setNewReminder({ ...newReminder, heading: text })}
              placeholder="e.g., Aspirin or Dr. Smith Checkup"
              placeholderTextColor="#aaa"
            />

            {/* Description Input */}
            <Text style={tw`text-white text-lg mb-2`}>Description</Text>
            <TextInput
              style={tw`bg-gray-700 text-white text-lg p-3 rounded-lg mb-4`}
              value={newReminder.description}
              onChangeText={(text) => setNewReminder({ ...newReminder, description: text })}
              placeholder="e.g., Take with food or Bring insurance card"
              placeholderTextColor="#aaa"
              multiline
            />

            {/* Time Input */}
            <Text style={tw`text-white text-lg mb-2`}>Time</Text>
            <TextInput
              style={tw`bg-gray-700 text-white text-lg p-3 rounded-lg mb-4`}
              value={newReminder.time}
              onChangeText={(text) => setNewReminder({ ...newReminder, time: text })}
              placeholder="e.g., 10:00 AM"
              placeholderTextColor="#aaa"
            />

            {/* Modal Buttons */}
            <View style={tw`flex-row justify-end`}>
              <TouchableOpacity
                style={tw`bg-gray-600 rounded-lg p-3 mr-2`}
                onPress={() => setModalVisible(false)}
              >
                <Text style={tw`text-white text-lg`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-blue-500 rounded-lg p-3`}
                onPress={handleAddReminder}
              >
                <Text style={tw`text-white text-lg`}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}