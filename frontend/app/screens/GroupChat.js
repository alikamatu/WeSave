import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const GroupChat = ({ route }) => {
  const { groupId } = route.params; // Get the groupId from navigation params
  const { user } = useContext(AuthContext); // Get the logged-in user
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch chat messages for the group
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/${groupId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat messages:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [groupId]);

  // Send a new chat message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await api.post(`/chat/${groupId}`, {
        sender: user._id, // Logged-in user's ID
        message: newMessage.trim(),
      });

      setMessages((prevMessages) => [...prevMessages, response.data]); // Append the new message
      setNewMessage(''); // Clear the input field
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading chat...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={tw`flex-1 bg-white`}>
        {/* Chat Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={[
                tw`p-4 m-2 rounded-lg`,
                item.sender._id === user._id ? tw`bg-blue-100 self-end` : tw`bg-gray-100 self-start`,
              ]}
            >
              <Text style={tw`font-bold`}>{item.sender.firstName}:</Text>
              <Text>{item.message}</Text>
              <Text style={tw`text-xs text-gray-500 mt-1`}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
            </View>
          )}
          contentContainerStyle={tw`p-4`}
        />

        {/* Input Field */}
        <View style={tw`flex-row items-center border-t border-gray-300 p-4`}>
          <TextInput
            style={tw`flex-1 border border-gray-300 rounded-lg p-4`}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity
            style={tw`ml-2 bg-blue-600 p-4 rounded-lg`}
            onPress={handleSendMessage}
          >
            <Text style={tw`text-white font-bold`}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GroupChat;