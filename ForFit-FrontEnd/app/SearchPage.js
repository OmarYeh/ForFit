import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ScrollView,
  useColorScheme,
} from "react-native"; // Import useColorScheme
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Importing the search icon
import {API_BASE_URL} from "../config";

const DiscoverScreen = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // Get the current theme (light or dark)
  const [filteredItems, setFilteredItems] = useState([]);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const response = await axios.get(`${API_BASE_URL}/item/getitems`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const items = response.data.items || [];
          setItems(items); // Store all items
          setFilteredItems(items); // Initialize filtered items
        } else {
          setError("No token found. Please login.");
        }
      } catch (err) {
        setError("Error fetching items");
        console.error(err.response || err);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    // Fetch recent searches from AsyncStorage
    const fetchRecentSearches = async () => {
      const recent = await AsyncStorage.getItem("recentSearches");
      if (recent) {
        setRecentSearches(JSON.parse(recent));
      }
    };
    fetchRecentSearches();
  }, []);

  const handleSearchPress = async () => {
    if (searchQuery.trim() !== "") {
      const updatedSearches = [
        searchQuery,
        ...recentSearches.filter((search) => search !== searchQuery),
      ].slice(0, 5);
      await AsyncStorage.setItem(
        "recentSearches",
        JSON.stringify(updatedSearches)
      );
      setRecentSearches(updatedSearches);

      // Navigate to the search results page and pass the search query
      navigation.navigate("SearchItems", { searchQuery: searchQuery });
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleItemPress = (id) => {
    navigation.navigate("ProductDetails", { id: id });
  };

  const handleDeleteSearch = async (searchToDelete) => {
    const updatedSearches = recentSearches.filter(
      (search) => search !== searchToDelete
    );
    await AsyncStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedSearches)
    );
    setRecentSearches(updatedSearches);
  };

  const handleDeleteAllSearches = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete all recent searches?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await AsyncStorage.removeItem("recentSearches");
            setRecentSearches([]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        width: 150,
        marginRight: 15,
        padding: 10,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() => handleItemPress(item.id)}
    >
      {item.images && item.images.length > 0 ? (
        <Image
          source={{ uri: item.images[0] }}
          style={{
            width: "100%",
            height: 150,
            resizeMode: "cover",
          }}
        />
      ) : (
        <Text>No Image</Text>
      )}
      <View style={{ marginTop: 10, alignItems: "center" }}>
        <Text
          style={[
            { fontWeight: "bold" },
            colorScheme === "dark" && { color: "white" },
          ]}
        >
          {item.item_name || "No Title"}
        </Text>
        {item.get_sales.length > 0 ? (
          <>
          <View style={{flexDirection:'row',gap:5}}>
           <Text style={{ color: colorScheme === "dark" ? "white" : "black",fontWeight: "bold", }}>
              ${(item.price * (1 - item.get_sales[0].Discount / 100)).toFixed(2)}
              
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

  return (
    <View style={{ padding: 20 }}>
      {error ? (
        <Text
          style={
            colorScheme === "dark" ? { color: "white" } : { color: "black" }
          }
        >
          {error}
        </Text>
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={[
                { fontSize: 24, fontWeight: "bold" },
                colorScheme === "dark" && { color: "white" },
              ]}
            >
              Search
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                flex: 1,
                marginLeft: 10,
                paddingHorizontal: 10,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  color: colorScheme === "dark" ? "white" : "black",
                }}
                placeholder="Search items..."
                placeholderTextColor={
                  colorScheme === "dark" ? "lightgray" : "gray"
                }
                value={searchQuery}
                onChangeText={handleSearchChange}
              />
              <Ionicons
                name="search"
                size={20}
                color={colorScheme === "dark" ? "white" : "#888"}
                onPress={handleSearchPress}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                { fontSize: 18, fontWeight: "bold" },
                colorScheme === "dark" && { color: "white" },
              ]}
            >
              Recent Searches
            </Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={handleDeleteAllSearches}>
                <Text style={{ color: "red" }}>Delete All</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentSearches.length > 0 ? (
            <ScrollView horizontal style={{ marginBottom: 20 }}>
              {recentSearches.map((search, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <TouchableOpacity onPress={() => handleDeleteSearch(search)}>
                    <Ionicons
                      name="trash-bin"
                      size={20}
                      color="red"
                      style={{ marginRight: 5 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleSearchChange(search)}>
                    <Text
                      style={
                        colorScheme === "dark"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      {search}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text
              style={
                colorScheme === "dark" ? { color: "white" } : { color: "black" }
              }
            >
              No recent searches
            </Text>
          )}

          <Text
            style={[
              { fontSize: 18, fontWeight: "bold" },
              colorScheme === "dark" && { color: "white" },
            ]}
          >
            Items
          </Text>
          <FlatList
            data={items.slice(0, 6)} // Show only the first 6 items
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal // Enable horizontal scrolling
            contentContainerStyle={{ paddingBottom: 20 }} // Adds bottom padding to the list
          />
        </>
      )}
    </View>
  );
};

export default DiscoverScreen;
