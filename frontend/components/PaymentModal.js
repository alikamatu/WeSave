import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import api from '../services/api';

const PaymentModal = ({ visible, onClose, planId, onPaymentSuccess }) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePayment = async () => {
    if (!amount || !phoneNumber) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api.post('/api/transactions/initiate', {
        planId,
        amount: parseFloat(amount),
        phoneNumber,
        paymentMethod: 'momo'
      });

      setPaymentStatus('pending');
      
      // Poll for payment status
      const checkStatus = async (referenceId) => {
        try {
          const statusResponse = await api.get(`/api/transactions/status/${referenceId}`);
          
          if (statusResponse.data.status === 'SUCCESSFUL') {
            setPaymentStatus('success');
            onPaymentSuccess();
            setTimeout(onClose, 2000);
          } else if (statusResponse.data.status === 'FAILED') {
            setPaymentStatus('failed');
          } else {
            // Continue polling
            setTimeout(() => checkStatus(referenceId), 3000);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
          setPaymentStatus('error');
        }
      };

      checkStatus(response.data.referenceId);
    } catch (error) {
      console.error('Payment error:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
        <View style={tw`bg-white rounded-lg p-6 w-4/5`}>
          <Text style={tw`text-xl font-bold mb-4`}>Make a Contribution</Text>
          
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 mb-4`}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3 mb-6`}
            placeholder="MTN Mobile Money Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          
          {paymentStatus === 'pending' && (
            <Text style={tw`text-yellow-600 text-center mb-4`}>Processing payment...</Text>
          )}
          
          {paymentStatus === 'success' && (
            <Text style={tw`text-green-600 text-center mb-4`}>Payment successful!</Text>
          )}
          
          {paymentStatus === 'failed' && (
            <Text style={tw`text-red-600 text-center mb-4`}>Payment failed. Please try again.</Text>
          )}
          
          <View style={tw`flex-row justify-between`}>
            <TouchableOpacity
              style={tw`bg-gray-300 py-3 px-6 rounded-lg`}
              onPress={onClose}
              disabled={isProcessing}
            >
              <Text style={tw`font-bold`}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={tw`bg-blue-600 py-3 px-6 rounded-lg`}
              onPress={handlePayment}
              disabled={isProcessing || paymentStatus === 'pending'}
            >
              <Text style={tw`text-white font-bold`}>
                {isProcessing || paymentStatus === 'pending' ? 'Processing...' : 'Pay'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

export default PaymentModal;