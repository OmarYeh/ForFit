import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import {API_BASE_URL} from "../config";
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentScreen = () => {
    const route = useRoute();

    const orderId = route.params?.orderId;

    if (!orderId) {
        console.error("Order ID is undefined or missing");
        return <Text>Error: Missing Order ID</Text>;
    }
    const [loading, setLoading] = useState(true);
    const [orderItems, setOrderItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTotalAmount = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/payment-total/${orderId}`);
                if (response.data.total_price) {
                    setTotalAmount(response.data.total_price);
                } else {
                    Alert.alert("Error", "Failed to fetch total amount.");
                }
            } catch (error) {
                console.error('Error fetching total amount:', error);
                Alert.alert("Error", "Failed to fetch total amount.");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchTotalAmount();
        }
    }, [orderId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Payment Screen</Text>
            <Text>Total Price: {totalPrice}</Text>
            <Text>Shipping Address: {shoppingAddress ? shoppingAddress[0]?.address : 'No address available'}</Text>

            <Text>Order Items:</Text>
            <FlatList
                data={orderItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 10 }}>
                        <Text>Item ID: {item.item_id}</Text>
                        <Text>Price: {item.price}</Text>
                        <Text>Quantity: {item.quantity}</Text>
                        <Text>Total Price: {item.total_price}</Text>
                        <Text>Color ID: {item.color_id}</Text>
                        <Text>Size ID: {item.size_id}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default PaymentScreen;
