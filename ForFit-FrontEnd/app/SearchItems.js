import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, useColorScheme } from "react-native"; // Import useColorScheme
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_BASE_URL} from "../config";
import { useRoute, useNavigation } from '@react-navigation/native'; // Import useNavigation

const SearchPage = () => {
  const route = useRoute(); // Access the route object
  const navigation = useNavigation(); // Access the navigation object
  const { searchQuery } = route.params; // Get searchQuery passed from the DiscoverScreen
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const colorScheme = useColorScheme(); // Get the current theme (light or dark)

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true); // Reset loading state before fetching
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const response = await axios.get(`${API_BASE_URL}/item/search`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { query: searchQuery },
          });
          setItems(response.data.items || []);
        } else {
          setError("No token found. Please login.");
        }
      } catch (err) {
        setError("Error fetching items");
        console.error(err);
      } finally {
        setLoading(false); // Ensure loading state is stopped after fetching
      }
    };

    if (searchQuery) {
      fetchItems();
    }
  }, [searchQuery]);

  const handleItemPress = (id) => {
    navigation.navigate('ProductDetails', { id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item.id)} // Call handleItemPress with the item's id
    >
      {item.image_url ? (
        <Image
        source={{ uri: `${API_BASE_URL.replace('/api', '')}/storage/items/${item.image_url}` }}          style={styles.image}
        />
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, colorScheme === 'dark' && { color: 'white' }]}>
          {item.item_name || "No Title"}
        </Text>
               {item.DiscountPrice > 0 ? (
                 <>
                 <View style={{flexDirection:'row',gap:5}}>
                  <Text style={{ color: colorScheme === "dark" ? "white" : "black",fontWeight: "bold", }}>
                     ${item.DiscountPrice}
                   </Text>
                   <Text style={{ color: colorScheme === "dark" ? "white" : "black" ,
                         
                         
                         textDecorationLine: "line-through",
                      
                     }} >
                     ${item.price}
                   </Text>
                   </View>
                 </>
               ) : (
                 <Text style={{ color: colorScheme === "dark" ? "white" : "black",fontWeight: "bold", }}>
                     ${item.price}
                     
                   </Text>
                
               )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={colorScheme === 'dark' ? styles.darkText : styles.lightText}>
          {error}
        </Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={colorScheme === 'dark' ? styles.darkText : styles.lightText}>
          No items found for "{searchQuery}"
        </Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={[{ fontSize: 24, fontWeight: "bold" }, colorScheme === 'dark' && { color: 'white' }]}>
        Search Results
      </Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Display 2 items per row
        columnWrapperStyle={styles.row} // Styling the row to add spacing between columns
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    width: '48%', // Adjust width for two items per row
    marginRight: '2%', // Add spacing between items
    padding: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,  // Adds rounded corners to the image
    resizeMode: "cover",
  },
  noImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',  // Background color when no image is available
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: '#888',
    fontStyle: "italic",
  },
  itemDetails: {
    marginTop: 10,
    alignItems: "center",
  },
  itemName: {
    fontWeight: "bold",
  },
  row: {
    flex: 1,
    justifyContent: "space-between", 
  },
  lightText: {
    color: '#000', // Light theme text color
  },
  darkText: {
    color: '#fff', // Dark theme text color
  },
});

export default SearchPage;
