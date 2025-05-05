// filepath: /Users/user/Documents/GitHub/WeSave/frontend/app/screens/SavingsPlanDetail.js
import React from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const SavingsPlanDetail = ({ route }) => {
  const { planId } = route.params;

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-lg font-bold`}>Savings Plan Detail</Text>
      <Text>Plan ID: {planId}</Text>
    </View>
  );
};

export default SavingsPlanDetail;