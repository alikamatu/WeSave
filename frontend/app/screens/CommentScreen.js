import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  RefreshControl,
  Image
} from "react-native";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://172.20.10.6:1000/api/posts";

export default function CommentScreen({ route }) {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  const fetchPost = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch(`${API_URL}/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error Response:", errorText);
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setPost(data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error("Error fetching post:", err.message);
      Alert.alert("Error", "Failed to load post. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPost();
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("Error", "Please enter a comment.");
      return;
    }

    try {
      setSending(true);
      const token = await AsyncStorage.getItem("authToken");
      const userDetails = await AsyncStorage.getItem("userDetails");
      const userId = userDetails ? JSON.parse(userDetails)?._id : null;

      if (!token || !userId) {
        Alert.alert("Error", "Please log in to add a comment.");
        return;
      }

      const response = await fetch(`${API_URL}/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText, userId }),
      });

      if (response.ok) {
        setCommentText("");
        await fetchPost();
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to add comment.");
      }
    } catch (err) {
      console.error("Error adding comment:", err.message);
      Alert.alert("Error", "An error occurred while adding the comment.");
    } finally {
      setSending(false);
    }
  };

  const renderComment = ({ item }) => (
    <Animated.View 
      style={[
        tw`bg-gray-800 p-4 rounded-lg mb-3 mx-2 shadow-md`,
        { 
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }
          ]
        }
      ]}
    >
      <View style={tw`flex-row items-center mb-2`}>
        {/* {item.user?.avatar ? (
          <Image 
            source={{ uri: item.user.avatar }} 
            style={tw`w-8 h-8 rounded-full mr-2`}
          />
        ) : (
          <View style={tw`bg-blue-500 w-8 h-8 rounded-full mr-2 justify-center items-center`}>
            <Icon name="person" size={16} color="white" />
          </View>
        )} */}
        <Text style={tw`text-blue-400 font-medium`}>
          {item.user?.name || "Anonymous"}
        </Text>
        <Text style={tw`text-gray-500 text-xs ml-auto`}>
          {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
        </Text>
      </View>
      <Text style={tw`text-gray-100`}>{item.text || "No text"}</Text>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-900`}>
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-900`}>
        <Icon name="sad-outline" size={48} color="#6B7280" style={tw`mb-4`} />
        <Text style={tw`text-gray-400 text-lg`}>Post not found</Text>
        <TouchableOpacity 
          style={tw`mt-4 bg-blue-600 px-4 py-2 rounded-lg`}
          onPress={() => navigation.goBack()}
        >
          <Text style={tw`text-white`}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 bg-gray-900`}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={tw`flex-1`}>
        <View style={tw`p-4 bg-gray-800 border-b border-gray-700 pt-12 mb-3`}>
          <Text style={tw`text-white text-xl font-bold mb-1`}>
            {post.title || "Untitled Post"}
          </Text>
          <Text style={tw`text-gray-400`}>
            {post.comments?.length || 0} comments
          </Text>
        </View>

        <FlatList
          data={post.comments || []}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={renderComment}
          ListEmptyComponent={
            <View style={tw`flex-1 justify-center items-center mt-10`}>
              <Icon name="chatbubble-ellipses-outline" size={48} color="#4B5563" />
              <Text style={tw`text-gray-500 mt-4`}>No comments yet</Text>
              <Text style={tw`text-gray-600 text-sm mt-1`}>Be the first to comment!</Text>
            </View>
          }
          contentContainerStyle={tw`pb-4`}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#60A5FA"]}
              tintColor="#60A5FA"
            />
          }
        />

        <View style={tw`p-4 border-t border-gray-800 bg-gray-900`}>
          <View style={tw`flex-row items-center`}>
            <TextInput
              style={tw`flex-1 bg-gray-800 text-white rounded-full px-4 py-3 mr-2`}
              placeholder="Write a comment..."
              placeholderTextColor="#6B7280"
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              onPress={handleAddComment}
              disabled={sending || !commentText.trim()}
              style={[
                tw`bg-blue-600 w-12 h-12 rounded-full justify-center items-center`,
                (sending || !commentText.trim()) && tw`bg-blue-800 opacity-80`
              ]}
            >
              {sending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Icon name="send" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}