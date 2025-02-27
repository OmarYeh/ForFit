import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {API_BASE_URL} from "../../config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdvertisementSlider from "../../components/AdvertisementSlider";
import { useNavigation } from "@react-navigation/native";

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";
  const navigation = useNavigation();

  const handleNavigateToSearch = () => {
    navigation.navigate("SearchPage");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const response = await axios.get(`${API_BASE_URL}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCategories(response.data.categories || []);
        } else {
          setError("No token found. Please login.");
        }
      } catch (err) {
        setError("Error fetching categories");
        console.error(err.response || err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000" : "#fff",paddingTop:25},
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}
        >
          Categories
        </Text>
        <TouchableOpacity onPress={handleNavigateToSearch} style={styles.searchBarContainer(isDarkMode)}>
          <TextInput
            style={styles.searchBar(isDarkMode)}
            placeholder="Search"
            placeholderTextColor={isDarkMode ? "#bbb" : "#888"}
            editable={false}
          />
          <Icon name="search" size={20} style={styles.searchIcon(isDarkMode)} />
        </TouchableOpacity>
      </View>
      <AdvertisementSlider />
      <FlatList
  data={categories}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.categoryButton}
      onPress={() =>
        navigation.navigate("CategoryItems", { id: item.id })
      }
    >
      <Image
        style={styles.categoryImage}
        source={{ uri: item.cimage }}
        resizeMode="cover"
      />
      <Text
        style={[styles.categoryText, { color: isDarkMode ? "#fff" : "#000" }]}
      >
        {item.category_name}
      </Text>
    </TouchableOpacity>
  )}
  numColumns={2}
  contentContainerStyle={styles.categoryList}
/>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1 ,
  },
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
  searchBarContainer: (isDarkMode) => ({
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 8,
    width:  "60%",
    marginLeft: 10,
    marginRight: 10,
  }),
  searchBar: (isDarkMode) => ({
    flex: 1,
    fontSize: 14,
    color: isDarkMode ? "#fff" : "#000",
    paddingLeft: 8,
  }),
  searchIcon: (isDarkMode) => ({
    color: isDarkMode ? "#bbb" : "#888",
    marginLeft: 8,
    marginRight: 8,
  }),
  categoryList: { 
    padding: 10,
    paddingBottom: 80, 
  },
  categoryButton: {
    flex: 1,
    margin: 10,
    alignItems: "center",
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: "center",
    
  },
});

export default CategoriesScreen;
