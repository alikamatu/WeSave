import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  StyleSheet,
  Image
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../context/AuthContext';

const GroupChat = ({ route }) => {
  const { groupId, groupName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userId, setUserId] = useState(null);

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
    
    // Set up polling or socket connection here for real-time updates
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [groupId]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserId');
        setUserId(storedUserId);
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };
    fetchUserId();
  }, []);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const Me = "68188d8b8e9c8a9f54c1c536"; // Fallback for testing
  // Send a new chat message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await api.post(`/chat/${groupId}`, {
        sender: userId || Me,
        message: newMessage.trim(),
      });

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const flatListRef = React.useRef();

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Image 
          source={require('../../assets/images/loading-chat.gif')} 
          style={tw`w-32 h-32`}
        />
        <Text style={tw`mt-4 text-gray-600`}>Loading chat messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 bg-gray-50`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      {/* <View style={tw`bg-blue-600 p-4 flex-row items-center shadow-md`}>
        <TouchableOpacity style={tw`mr-4`}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={tw`text-white font-bold text-lg`}>{groupName || 'Group Chat'}</Text>
          <Text style={tw`text-blue-100 text-xs`}>
            {messages.length > 0 ? `${messages.length} messages` : 'No messages yet'}
          </Text>
        </View>
      </View> */}

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={tw`px-4 py-2`}>
            {item.sender._id !== userId && (
              <Text style={tw`text-gray-500 text-xs ml-14 mb-1`}>
                {item.sender.firstName} {item.sender.lastName}
              </Text>
            )}
            <View
              style={[
                tw`p-3 rounded-2xl max-w-3/4`,
                item.sender._id === userId 
                  ? [tw`bg-blue-500 self-end rounded-tr-none`, styles.sentMessage]
                  : [tw`bg-white self-start rounded-tl-none`, styles.receivedMessage],
              ]}
            >
              <Text style={item.sender._id === userId ? tw`text-white` : tw`text-gray-800`}>
                {item.message}
              </Text>
              <Text 
                style={[
                  tw`text-xs mt-1 text-right`,
                  item.sender._id === userId ? tw`text-blue-200` : tw`text-gray-500`
                ]}
              >
                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={tw`pb-2 pt-4`}
        onScroll={({ nativeEvent }) => {
          const { contentOffset } = nativeEvent;
          setIsScrolled(contentOffset.y > 20);
        }}
        ListEmptyComponent={
          <View style={tw`flex-1 justify-center items-center mt-20`}>
            <Icon name="forum" size={48} color="#d1d5db" />
            <Text style={tw`text-gray-400 mt-4 text-center px-10`}>
              No messages yet. Be the first to say hello!
            </Text>
          </View>
        }
      />

      {/* Scroll to bottom button */}
      {isScrolled && (
        <TouchableOpacity
          style={tw`absolute right-4 bottom-20 bg-blue-500 p-3 rounded-full shadow-lg`}
          onPress={scrollToBottom}
        >
          <Icon name="arrow-downward" size={20} color="white" />
        </TouchableOpacity>
      )}

      {/* Input Field */}
      <View style={tw`flex-row items-center border-t border-gray-200 bg-white p-3`}>
        <TouchableOpacity style={tw`p-2`}>
          <Icon name="insert-emoticon" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        <TextInput
          style={tw`flex-1 border border-gray-200 rounded-full py-3 px-4 mx-2 bg-gray-100`}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        {newMessage ? (
          <TouchableOpacity
            style={tw`bg-blue-600 p-3 rounded-full`}
            onPress={handleSendMessage}
          >
            <Icon name="send" size={20} color="white" />
          </TouchableOpacity>
        ) : (
            <TouchableOpacity
            style={tw`bg-gray-200 p-3 rounded-full`}
            disabled
          >
            <Icon name="send" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  sentMessage: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  receivedMessage: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default GroupChat;