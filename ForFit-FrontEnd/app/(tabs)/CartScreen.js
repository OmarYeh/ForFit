import React, { useState, useEffect ,useCallback  } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {API_BASE_URL} from "../../config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStripe, usePaymentSheet } from "@stripe/stripe-react-native";
import { useRouter } from 'expo-router';
import { useFocusEffect } from "@react-navigation/native";
import { SwipeListView } from 'react-native-swipe-list-view';
const CartScreen = () => {
  const [cartitems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shoppingAddress, setShoppingAddress] = useState([]);
  const [wishlist, setWishlist] = useState([]);  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";
  const router = useRouter();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    refreshCart();
  }, []);
  

  const initializePaymentSheet = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
  
      const response = await axios.post(
        `${API_BASE_URL}/create-payment-intent`,
        {
          amount: totalPrice * 100, 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const { clientSecret } = response.data;
  
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Forfit Store",
      });
  
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }
  
      const { error: paymentError } = await presentPaymentSheet();
  
      if (paymentError) {
        Alert.alert("Payment Failed", paymentError.message);
      } else {
        Alert.alert("Success", "Payment successful!");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Error", "Payment failed. Please try again.");
    }
  };

  const CheckOut = async () => {
    if (!shoppingAddress || shoppingAddress.length === 0) {
      Alert.alert("Error", "Please add a shipping address.");
      return;
    }
  
    await initializePaymentSheet();
  
    refreshCart();
  };
  
  const deleteC = async (cartItemId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/cart/delete-cartitem`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_id: cartItemId }),
      });
  
      if (response.ok) {
        alert("Item removed from cart");
        refreshCart(); 
      } else {
        alert(result.message || "Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };
  
  
  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
  
      const response = await fetch(`${API_BASE_URL}/cart/update-quantity`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: cartItemId,
          quantity: newQuantity,
        }),
      });
  
   
  
      if (response.ok) {
        refreshCart(); 
      } else {
        alert(result.error || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  

  
  const editItem = async (cartItemId, type) => {
    let newValue;
    if (type === "color") {
      newValue = prompt("Enter new color ID:");
    } else if (type === "size") {
      newValue = prompt("Enter new size ID:");
    }
  
    if (!newValue) return;
  
    try {
      const token = await AsyncStorage.getItem("authToken");
  
      const response = await fetch(`${API_BASE_URL}/cart/update-cartitem`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: cartItemId,
          [type + "_id"]: newValue,
        }),
      });
  
      const result = await response.json();
      if (response.ok ) {
        alert("Item updated successfully!");
        refreshCart(); 
      } else {
        alert(result.message || "Failed to edit item");
      }
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };
  
  
  const refreshCart = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      const [cartResponse, addressResponse, wishlistResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/cart/cartitems`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/wishlist/wishlistitems`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCartItems(cartResponse.data.cart || []);
      setTotalPrice(parseFloat(cartResponse.data.totalprice).toFixed(2)); 
      setShoppingAddress(addressResponse.data || []);
      setWishlist(wishlistResponse.data.wishlist || []);

    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred");
    } finally {
      setLoading(false);
    }
};

useFocusEffect(
  useCallback(() => {
    refreshCart(); 
  }, [])
);

const onEdit = (addressId) => {
  router.push(`/AddressForm?isEdit=true&addressId=${addressId}`);};

const onAdd = () => {
  router.push("/AddressForm?isEdit=false");
};
const navigateToWishlist = () => {
  router.push("/Wishlist");
};
  return (
    <SafeAreaView style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
      <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>Shopping Bag</Text>
      <View style={styles.itemsC}>
        <Text style={styles.itemT}>{loading ? 0 : cartitems.length > 0 ? `${cartitems.length}` : 0}</Text>
      </View>
      {/* Favorites Button */}
      <TouchableOpacity onPress={navigateToWishlist} style={styles.favBtn}>
        <Icon name="heart" size={30} color={"red"} />
      </TouchableOpacity>
    </View>
    <View style={styles.ShippingA}>
              {shoppingAddress.length > 0 ? (
                shoppingAddress.map((Address, index) => (
                  <View key={index} style={styles.shippingAddress}>
                    <View style={styles.addressContainer}>
                      <Text style={[styles.title,{color: isDarkMode ? '#fff' : '#000'}]}>Shipping Address</Text>
                      <Text style={[styles.atext,{color: isDarkMode ? '#fff' : '#000'}]}>{Address.address}</Text>
                      <Text style={[styles.atext,{color: isDarkMode ? '#fff' : '#000'}]}>{Address.city}</Text>
                    </View>
                    <TouchableOpacity style={styles.Edit} onPress={() => onEdit(Address.id)}>
                      <Icon name="pencil" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <TouchableOpacity style={styles.addAddressButton} onPress={onAdd}>
                  <Text style={styles.addAddressText}>+ Add Address</Text>
                </TouchableOpacity>
              )}
            </View>
    {/* Cart Items Section */}
    <FlatList
  data={cartitems}
  renderItem={({ item, index }) => (
    <SwipeListView
      data={[item]}
      renderItem={({ item }) => (
        <View style={styles.cartitem} key={index}>
          {/* Image & Delete Button */}
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
            <Text style={styles.price}>${item.pivot.price.toFixed(2)}</Text>
          </View>
          {/* Quantity Controls */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.pivot.Quantity - 1)}
              disabled={item.pivot.Quantity <= 1}
            >
              <Icon name="minus" size={16} color="#007BFF" />
            </TouchableOpacity>
            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>{item.pivot.Quantity}</Text>
            </View>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.pivot.Quantity + 1)}
            >
              <Icon name="plus" size={16} color="#007BFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      renderHiddenItem={({ item }) => (
        <View style={styles.hiddenContainer}>
          <TouchableOpacity
            onPress={() => deleteC(item.id)}
            style={styles.deleteButton}
          >
            <Icon name="trash" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      leftOpenValue={0}
      rightOpenValue={-75} 
      keyExtractor={(item) => item.id.toString()}
    />
  )}
  keyExtractor={(item) => item.id.toString()}
/>

    {/* Footer Section */}
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, width: 350, marginBottom: 60 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", color: isDarkMode ? '#fff' : '#000' }}>
        Total Price: ${totalPrice}
      </Text>
      <TouchableOpacity onPress={CheckOut} style={{ backgroundColor: "#007BFF", width: 100, borderRadius: 10, height: 35, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Check Out</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: { paddingTop: 45, flex: 1},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  Body: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  itemsC: {
    width: 30,
    height: 30,
    backgroundColor: "#a4b9f4",
    borderRadius: 250,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  itemT: {
    color: "#fff",
  },
  favBtn: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#f0f0f0", 
    alignItems: "center",
    justifyContent: "center",
  },
  ShippingA: {
    width: 350,
    borderRadius: 10,
    padding: 15,
  },


  shippingAddress: {
    flexDirection: "row",  
    justifyContent: "space-between", 
    alignItems: "center", 
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  addressContainer: {
    flex: 1, 
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  atext: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  Edit: {
    width: 40,
    height: 40,
    backgroundColor: "#007BFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  Cartitems: {
    flex: 2,
    flexDirection: "column",
    alignItems: "center",
  },
  cartitem: {
    height: 140,
    width: 350,
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
  hiddenContainer: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 15,
    borderRadius: 12,
    height: 140,
    width: 90,
    position: "absolute",
    right: 0, 
    marginRight:25,
  },
  
  deleteButton: {
    width: 90,
    height: 90,
    paddingLeft: 30,
    justifyContent: "center",
    alignItems: "center",
  },  
  
  detailsContainer: {
    flex: 1,
  },
  itemName: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  colorTag: {
    height: 14,
    width: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  itemDetails: {
    fontSize: 14,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityDisplay: {
    marginHorizontal: 8,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f0ff",
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  emptyCartText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
});

export default CartScreen;