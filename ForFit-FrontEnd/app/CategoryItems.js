import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Modal,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from "react-native-vector-icons/FontAwesome";
import Slider from '@react-native-community/slider';
import { useRoute, useNavigation } from '@react-navigation/native';
import {API_BASE_URL} from "../config";

function CategoryItemsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route?.params || {}; 
  const colorScheme = useColorScheme();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [sortOption, setSortOption] = useState('lowToHigh');

  useEffect(() => {
    if (!id) {
      setError('No category ID found');
      setLoading(false);
      return;
    }

   const fetchCategoryItems = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      throw new Error("No token found. Please login.");
    }

    const response = await axios.get(`${API_BASE_URL}/categoryitems/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { category } = response.data;
    console.log(category.cimage);
    if (Array.isArray(category.items)) {
      const updatedItems = category.items.map(item => {
        const itemPics = Array.isArray(item.get_itempics) ? item.get_itempics : [];


        return {
          ...item,
          itemPics: itemPics.map(pic => pic.itemimage),
        };
      });

      setItems(updatedItems); 
    } else {
      setItems([]);
    }

    setCategory(category); 
  } catch (err) {
    setError(err.message || "Error fetching category items.");
    console.error('Error fetching items:', err.response || err); 
  } finally {
    setLoading(false);
  }
};


    fetchCategoryItems();
  }, [id]);

  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={styles.activityIndicator.color} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Error: {error}</Text>
      </View>
    );
  }

  const filteredItems = items
    .filter(item =>
      item.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.price >= minPrice && item.price <= maxPrice
    )
    .sort((a, b) => {
      if (sortOption === 'lowToHigh') {
        return a.price - b.price;
      } else if (sortOption === 'highToLow') {
        return b.price - a.price;
      }
      return 0;
    });

  const clearFilters = () => {
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(200);
    setSortOption('lowToHigh');
    setFilterVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchbar}>
          <Icon name="search" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
          <Icon name="filter" size={20} style={styles.filterIcon} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Category Header */}
      <View style={styles.categoryHeader}>
      {category.cimage ? (
  <Image
    source={{
      uri: category.cimage, 
    }}
    style={styles.categoryImage}
  />
) : (
  <View style={styles.categoryImagePlaceholder}>
    <Text style={styles.categoryText}>{category.category_name?.charAt(0)}</Text>
  </View>
)}

        <Text style={styles.categoryName}>{category.category_name}</Text>
      </View>

      {/* Items Section */}
      <FlatList
  data={filteredItems}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => {
    // Get the first image from the itemPics array
    const imageUrl = item.itemPics && item.itemPics[0] ? item.itemPics[0] : null;
    return (
      <TouchableOpacity
        style={styles.itemCard}
        
        onPress={() => {
          navigation.navigate("ProductDetails", { id: item.id });
        }}  >
        {imageUrl ? (
          <Image
            style={styles.itemImage}
            source={{
              uri: `${API_BASE_URL.replace('/api', '/storage/items')}/${imageUrl}`, // Construct the full URL for the image
            }}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <Text>No Image</Text>
          </View>
        )}

        <Text style={styles.itemName}>{item.item_name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </TouchableOpacity>
    );
  }}
  numColumns={2}
  columnWrapperStyle={styles.columnWrapper}
/>


      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Price</Text>
            <Text>Price Range: ${minPrice} - ${maxPrice}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={200}
              step={1}
              value={minPrice}
              onValueChange={setMinPrice}
            />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={200}
              step={1}
              value={maxPrice}
              onValueChange={setMaxPrice}
            />
            <Text style={styles.modalTitle}>Sort by Price</Text>
            <TouchableOpacity
              style={[styles.sortButton, sortOption === 'lowToHigh' && styles.selectedSortButton]}
              onPress={() => setSortOption('lowToHigh')}
            >
              <Text style={styles.sortButtonText}>Low to High</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortOption === 'highToLow' && styles.selectedSortButton]}
              onPress={() => setSortOption('highToLow')}
            >
              <Text style={styles.sortButtonText}>High to Low</Text>
            </TouchableOpacity>
            <Button title="Apply Filter" onPress={() => setFilterVisible(false)} />
            <Button title="Clear Filters" onPress={clearFilters} />
            <Button title="Close" onPress={() => setFilterVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const baseStyles = {
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  searchbar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  filterIcon: {
    color: '#black',
  },
  filterText: {
    fontSize: 14,
    color: '#black',
    marginLeft: 5,
  },
  categoryHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 16,
  },
  categoryImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  categoryImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 50,
    color: '#fff',
  },
  categoryName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  itemCard: {
    flex: 1,
    margin: 8,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  sortButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedSortButton: {
    backgroundColor: '#2196F3', // Blue background for selected sort button
  },
  sortButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activityIndicator: {
    color: '#0000ff',
  },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#ffffff',
  },
  text: {
    ...baseStyles.text,
    color: '#000000',
  },
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#000000',
  },
  text: {
    ...baseStyles.text,
    color: '#ffffff',
  },
  filterIcon: {
    color: '#ffffff',
  },
  filterText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 5,
  },
  searchbar: {
    ...baseStyles.searchbar,
    borderColor: '#ffffff',
  },
  searchIcon: {
    ...baseStyles.searchIcon,
    color: '#ffffff',
  },
  searchInput: {
    ...baseStyles.searchInput,
    backgroundColor: '#black',
    color: '#ffffff',
  },
  categoryName: {
    ...baseStyles.categoryName,
    color: '#ffffff',
  },
  itemName: {
    ...baseStyles.itemName,
    color: '#ffffff',
  },
  itemPrice: {
    ...baseStyles.itemPrice,
    color: '#ffffff',
  },
});

export default CategoryItemsScreen;