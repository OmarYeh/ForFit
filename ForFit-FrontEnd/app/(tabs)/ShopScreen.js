import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Dimensions,
  useColorScheme,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {API_BASE_URL} from "../../config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from '@react-native-community/slider';
import { useNavigation } from "@react-navigation/native";
import { navigate } from './../../node_modules/@react-navigation/routers/src/CommonActions';
const { width } = Dimensions.get("window");

const ShopScreen = () => {  
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [error, setError] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const theme = useColorScheme(); // Detect light or dark mode
  const isDarkMode = theme === "dark";
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([10, 150]);
  const [sortOrder, setSortOrder] = useState("lowToHigh"); // "lowToHigh" or "highToLow"

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? "#121212" : "#fff",padding:5,paddingTop:25 },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#000",
    },
    searchBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 8,
      width: "70%", 
      marginLeft: 10,
      marginRight: 10,
    },
    searchBar: {
      flex: 1,
      fontSize: 14,
      color: isDarkMode ? "#fff" : "#000",
      paddingLeft: 8, 
    },
    searchIcon: {
      color: isDarkMode ? "#bbb" : "#888",
      marginLeft: 8,
      marginRight: 8, 
    },
    
    divider: { height: 1, backgroundColor: isDarkMode ? "#333" : "#333", marginVertical: 10 },
    categoryContainer: {
      flexDirection: "column",
      paddingVertical: 10,
      alignItems: "center", // Centers the content horizontally
      justifyContent: "center", // Centers the content vertically
    },
    rowContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center", // Center items in the row
      marginBottom: 15,
    },
    categoryButton: {
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10, 
      marginBottom: 10, 
    },
    categoryCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isDarkMode ? "#444" : "#f0f0f0",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10, 
    },
    categoryImage: {
      width: 75,
      height: 75,
      borderRadius: 35,
    },
    categoryText: {
      fontSize: 12, 
      color: isDarkMode ? "#fff" : "#555",
      textAlign: "center",
      marginTop: 5,
    },
    
    
    tickIcon: {
      position: 'absolute',
      top: -10,
      right: -10,
      backgroundColor: '#007BFF',
      borderRadius: 15,
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tickIconInner: {
      color: '#fff',
      fontSize: 12,
    },
    allItemsText: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#000",
      marginVertical: 10,
    },
    itemsList: { marginBottom: 20 },
    itemContainer: {
      width: width * 0.45,
      margin: "2.5%",
      backgroundColor: isDarkMode ? "#222" : "#f9f9f9",
      borderRadius: 10,
      padding: 10,
      alignItems: "center",
    },
    itemImage: { width: "100%", height: 150, borderRadius: 10 },
    itemTitle: { marginTop: 10, fontSize: 14, color: isDarkMode ? "#fff" : "#333" },
    itemPrice: {
      marginTop: 5,
      fontSize: 16,
      fontWeight: "bold",
      color: isDarkMode ? "#76c7f8" : "#007BFF",
    },
    errorText: { color: "red", textAlign: "center", fontSize: 16 },
    applyButton: {
      backgroundColor: "#007BFF",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 20,
    },
    applyButtonText: { color: "#fff", fontWeight: "bold" },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#333" : "#f0f0f0",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      marginRight:15,
    },
    filterIcon: { marginRight: 5 },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    filterModal: {
      backgroundColor: "#fff",
      width: "100%",
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    filterTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 20,
    },
    filterOption: {
      marginBottom: 10,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    filterCategoryButton: {
      alignItems: "center",
      justifyContent: "center",
      margin: 10,
      width: 80, 
      height: 100, 
    },
    filterCategoryCircle: {
      width: 70,
      height: 70,
      borderRadius: 40,
      backgroundColor: isDarkMode ? "#444" : "#f0f0f0",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    filterCategoryImage: {
      width: 60,
      height: 60,
      borderRadius: 35,
    },
    filterCategoryText: {
      fontSize: 12,
      color: isDarkMode ? "#fff" : "#555",
      textAlign: "center",
      marginTop: 5,
    },
    priceSlider: {
      width: "100%",
      height: 40,
    },
    sortButton: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 20,
      marginBottom: 10,
      marginRight: 10,
      backgroundColor: "#f0f0f0",
    },
    sortButtonSelected: {
      backgroundColor: "#007BFF",
      color: "#fff",
    },
  });
  const handleNavigateToSearch = () => {
    navigation.navigate('SearchPage');
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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const response = await axios.get(`${API_BASE_URL}/item/getitems`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setItems(response.data.items || []);
          setFilteredItems(response.data.items || []);
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
    const fetchCategoryItems = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const response = await axios.get(`${API_BASE_URL}/category-items`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCategoryItems(response.data.data || []);
        } else {
          setError("No token found. Please login.");
        }
      } catch (err) {
        setError("Error fetching category items");
        console.error(err.response || err);
      }
    };
    fetchCategoryItems();
  }, []);

  const openFilterModal = () => setModalVisible(true);
  const closeFilterModal = () => setModalVisible(false);

  const applyFilters = () => {
    let filtered = items;

    if (selectedCategories.length > 0) {
      const categoryItemIds = categoryItems
        .filter(ci => selectedCategories.includes(ci.category_id))
        .map(ci => ci.item_id);
      filtered = filtered.filter(item => categoryItemIds.includes(item.id));
    }
    if (priceRange) {
      filtered = filtered.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);
    }

    if (sortOrder === "lowToHigh") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredItems(filtered);
    closeFilterModal();
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 150]);
    setSortOrder("lowToHigh");
    setFilteredItems(items); 
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories(prevSelectedCategories =>
      prevSelectedCategories.includes(categoryId)
        ? prevSelectedCategories.filter(id => id !== categoryId)
        : [...prevSelectedCategories, categoryId]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
           <View style={styles.header}>
  <Text style={styles.title}>Shop</Text>
  <TouchableOpacity onPress={handleNavigateToSearch} style={styles.searchBarContainer}>
    <TextInput
      style={styles.searchBar}
      placeholder="Search"
      placeholderTextColor={isDarkMode ? "#bbb" : "#888"}
      editable={false}
    />
    <Icon name="search" size={20} style={styles.searchIcon} />
  </TouchableOpacity>
</View>

            <View style={styles.divider} />
            <View style={styles.categoryContainer}>
            <FlatList
              data={categories.slice(0, Math.ceil(categories.length / 2))} // First half
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryButton}
                  onPress={() => navigation.navigate('CategoryItems', { id: item.id })}
                  >
                  <View style={styles.categoryCircle}>
                    {item.cimage ? (
                      <Image source={{ uri: item.cimage }} style={styles.categoryImage} />
                    ) : (
                      <Text style={styles.categoryText}>{item.category_name.charAt(0)}</Text>
                    )}
                  </View>
                  <Text style={styles.categoryText}>{item.category_name}</Text>
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rowContainer}
            />

            <FlatList
              data={categories.slice(Math.ceil(categories.length / 2))}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryButton}
                  onPress={() => navigation.navigate('CategoryItems', { id: item.id })}
                  >
                  <View style={styles.categoryCircle}>
                    {item.cimage ? (
                      <Image source={{ uri:item.cimage }} style={styles.categoryImage} />
                    ) : (
                      <Text style={styles.categoryText}>{item.category_name.charAt(0)}</Text>
                    )}
                  </View>
                  <Text style={styles.categoryText}>{item.category_name}</Text>
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rowContainer}
            />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.allItemsText}>All Items</Text>
              <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
                <Icon name="filter" size={20} style={styles.filterIcon} />
                <Text style={styles.categoryText}>Filter</Text>
              </TouchableOpacity>
            </View>

          </>
        }
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('ProductDetails', { id: item.id })
          }
>
            {item.images && item.images.length > 0 ? (
              <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
            ) : (
              <Text>No Image</Text>
            )}
            <Text style={styles.itemTitle}>{item.item_name || "No Title"}</Text>
                   {item.get_sales.length > 0 ? (
                      <>
                      <View style={{flexDirection:'row',gap:5}}>
                       <Text style={styles.itemPrice}>
                          ${(item.price * (1 - item.get_sales[0].Discount / 100)).toFixed(2)}
                          
                        </Text>
                        <Text style={{ color: theme === "dark" ? "white" : "black" ,
                              
                              paddingTop:6,
                              textDecorationLine: "line-through",
                           
                          }} >
                          ${item.price}
                        </Text>
                        </View>
                      </>
                    ) : (
                      <Text style={styles.itemPrice}>
                          ${item.price}
                        </Text>
                     
                    )}
          </TouchableOpacity>
        )}
        numColumns={2}
        contentContainerStyle={styles.itemsList}
      />
      {/* Filter Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={closeFilterModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.filterModal}>
                <ScrollView>
                  <Text style={styles.filterTitle}>Filter Items</Text>
                  <View style={styles.filterOption}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={styles.filterCategoryButton}
                        onPress={() => toggleCategorySelection(category.id)}
                      >
                        <View style={styles.filterCategoryCircle}>
                          {category.cimage ? (
                            <Image source={{ uri: category.cimage }} style={styles.filterCategoryImage} />
                          ) : (
                            <Text style={styles.filterCategoryText}>{category.category_name.charAt(0)}</Text>
                          )}
                          {selectedCategories.includes(category.id) && (
                            <View style={styles.tickIcon}>
                              <Icon name="check" style={styles.tickIconInner} />
                            </View>
                          )}
                        </View>
                        <Text style={{ color: selectedCategories.includes(category.id) ? "#000" : "#000" }}>
                          {category.category_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <Text>Price Range</Text>
                    <Slider
                      style={styles.priceSlider}
                      minimumValue={0}
                      maximumValue={150}
                      step={1}
                      value={priceRange[0]}
                      onValueChange={(value) => {
                        setPriceRange([value, priceRange[1]]);
                      }}
                      onSlidingComplete={(value) => {
                        if (value >= priceRange[1]) {
                          setPriceRange([priceRange[1] - 1, priceRange[1]]);
                        }
                      }}
                    />
                    <Slider
                      style={styles.priceSlider}
                      minimumValue={0}
                      maximumValue={150}
                      step={1}
                      value={priceRange[1]}
                      onValueChange={(value) => {
                        setPriceRange([priceRange[0], value]);
                      }}
                      onSlidingComplete={(value) => {
                        if (value <= priceRange[0]) {
                          setPriceRange([priceRange[0], priceRange[0] + 1]);
                        }
                      }}
                    />
                    <Text>${priceRange[0]} - ${priceRange[1]}</Text>
                  </View>
                  <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "center" }}>
                    <TouchableOpacity
                      style={[
                        styles.sortButton,
                        sortOrder === "lowToHigh" && styles.sortButtonSelected,
                      ]}
                      onPress={() => setSortOrder("lowToHigh")}
                    >
                      <Text style={{ color: sortOrder === "lowToHigh" ? "#fff" : "#000" }}>Low to High</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.sortButton,
                        sortOrder === "highToLow" && styles.sortButtonSelected,
                      ]}
                      onPress={() => setSortOrder("highToLow")}
                    >
                      <Text style={{ color: sortOrder === "highToLow" ? "#fff" : "#000" }}>High to Low</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.applyButton} onPress={clearFilters}>
                    <Text style={styles.applyButtonText}>Clear Filters</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default ShopScreen;