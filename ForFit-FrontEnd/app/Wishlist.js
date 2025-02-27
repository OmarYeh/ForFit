import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import { Swipeable, GestureHandlerRootView } from "react-native-gesture-handler";
import { useRoute, useNavigation } from '@react-navigation/native'; 

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.get(`${API_BASE_URL}/wishlist/wishlistitems`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlistItems(response.data.wishlist || []);
    } catch (err) {
      setError("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.delete(`${API_BASE_URL}/wishlist/delete-wishlistitem`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { item_id: itemId },
      });

      if (response.status === 200) {
        setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        console.log("Item removed successfully:", response.data);
      } else {
        console.error("Failed to remove item:", response.data);
      }
    } catch (err) {
      console.error("Error removing item:", err.response ? err.response.data : err.message);
    }
  };

  const handleItemPress = (id) => {
    navigation.navigate('ProductDetails', { id });
  };

  const renderRightActions = (itemId) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => removeFromWishlist(itemId)}
    >
      <Icon name="trash" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Your Wishlist</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : wishlistItems.length > 0 ? (
          wishlistItems.map((item, index) => (
            <Swipeable
              key={index}
              renderRightActions={() => renderRightActions(item.id)}
            >
              <TouchableOpacity onPress={() => handleItemPress(item.id)}>
                <View style={styles.wishlistItem}>
                  {/* Image */}
                  <View style={styles.imageContainer}>
                    {item.get_itempics && item.get_itempics.length > 0 && (
                      <Image
                        source={{
                          uri: `${API_BASE_URL.replace('/api', '')}/storage/items/${item.get_itempics[0].itemimage}`,
                        }}
                        style={styles.itemImage}
                        resizeMode="contain"
                      />
                    )}
                  </View>

                  {/* Item Details */}
                  <View style={styles.detailsContainer}>
                    <Text style={styles.itemName}>{item.item_name}</Text>
                    <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          ))
        ) : (
          <Text style={styles.emptyText}>Your wishlist is empty.</Text>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  wishlistItem: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
  },
  itemName: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteAction: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "80%", 
    borderRadius: 12,
    marginVertical: 5, 
    marginLeft: 5, 
  },
  
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Wishlist;
