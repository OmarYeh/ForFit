import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../config';
import AlertMessage from '../components/ui/AlertMessage';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

const ShippingAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const router = useRouter();

  const fetchAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error.response?.data || error.message);
      setAlert({
        type: 'error',
        message: 'Failed to load addresses. Please try again later.',
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const handleAddressPress = (addressId) => {
    router.push(`/AddressForm?isEdit=true&addressId=${addressId}`);
  };

  const handleDelete = async (addressId) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              await axios.delete(`${API_BASE_URL}/addresses/${addressId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
              setAlert({ type: 'success', message: 'Address deleted successfully.' });
            } catch (error) {
              console.error('Error deleting address:', error.response?.data || error.message);
              setAlert({ type: 'error', message: 'Failed to delete address. Please try again later.' });
            }
          }
        }
      ]
    );
  };

  const renderHiddenItem = ({ item }) => (
    <View style={styles.hiddenContainer}>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Icon name="trash" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Shipping Addresses</Text>
      <AlertMessage type={alert.type} message={alert.message} />

      <Button title="Add New Address" onPress={() => router.push('/AddressForm?isEdit=false')} />

      {addresses.length > 0 ? (
        <SwipeListView
          data={addresses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.addressContainer}>
              <Text style={styles.addressText}>{item.address}</Text>
              <Text style={styles.addressText}>{item.city}, {item.country}</Text>
              <TouchableOpacity onPress={() => handleAddressPress(item.id)} style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-80} 
        />
      ) : (
        <Text style={styles.noAddressesText}>You don't have any saved addresses yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addressContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
  },
  noAddressesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  hiddenContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, 
    height: '90%',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  deleteButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShippingAddress;
