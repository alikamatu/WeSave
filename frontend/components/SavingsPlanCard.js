import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { formatCurrency, calculateProgress } from '../utils/helpers';

const SavingsPlanCard = ({ plan, onPress }) => {
  const progress = calculateProgress(plan.currentAmount, plan.targetAmount);
  
  return (
    <TouchableOpacity 
      style={tw`bg-white rounded-lg p-4 w-full shadow-sm m-2`}
      onPress={onPress}
    >
      <Text style={tw`font-bold text-lg mb-1`}>{plan.name}</Text>
      <Text style={tw`text-gray-600 mb-2`}>{plan.frequency} contributions</Text>
      
      <View style={tw`mb-3`}>
        <View style={tw`flex-row justify-between mb-1`}>
          <Text style={tw`text-sm text-gray-600`}>Saved</Text>
          <Text style={tw`text-sm font-semibold`}>
            {formatCurrency(plan.currentAmount)} of {formatCurrency(plan.targetAmount)}
          </Text>
        </View>
        
        <View style={tw`h-2 bg-gray-200 rounded-full overflow-hidden`}>
          <View 
            style={[
              tw`h-full bg-green-500`,
              { width: `${progress}%` }
            ]}
          />
        </View>
      </View>
      
      <Text style={tw`text-sm text-gray-600`}>
        {progress.toFixed(0)}% complete
      </Text>
    </TouchableOpacity>
  );
};

export default SavingsPlanCard;