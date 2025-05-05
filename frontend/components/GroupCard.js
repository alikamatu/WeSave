import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const GroupCard = ({ group, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={tw`bg-white rounded-lg shadow p-4 mr-4`}>
      <Text style={tw`text-lg font-bold mb-2`}>{group.name}</Text>
      <Text style={tw`text-gray-600 mb-1`}>Admin: {group.admin?.firstName || 'N/A'}</Text>
      <Text style={tw`text-gray-600 mb-1`}>Members: {group.members.length}</Text>
      <Text style={tw`text-gray-600`}>Target: {group.targetAmount}</Text>
    </TouchableOpacity>
  );
};

export default GroupCard;