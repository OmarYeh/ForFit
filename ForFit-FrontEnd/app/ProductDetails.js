import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import {API_BASE_URL} from "../config";

const showToast = (message) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("", message);
  }
};

function ProductDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const colorScheme = useColorScheme();

  const [item, setItem] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sale, setSale] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token not found");

        const response = await axios.get(`${API_BASE_URL}/item/getitem`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { item_id: id },
        });

        const responseI = await axios.get(`${API_BASE_URL}/item/getitems`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedItem = response.data.Item;
        setItem(fetchedItem);
        setAllItems(responseI.data.items || []);
        setSale(fetchedItem.sales[0]);
        // Set default variations if available
        if (fetchedItem.sizes && fetchedItem.sizes.length > 0) {
          setSelectedSize(fetchedItem.sizes[0].id);
        }
        if (fetchedItem.colors && fetchedItem.colors.length > 0) {
          setSelectedColor(fetchedItem.colors[0].id);
        }
      } catch (err) {
        console.log("Error fetching item details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  useEffect(() => {
    if (item && sale) {
      const newPrice = (item.price * (1 - sale.Discount / 100)).toFixed(2);
      setPrice(newPrice);
    }
  }, [item, sale]);

  const incrementQuantity = () => {
    console.log("Increment quantity");
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    console.log("Decrement quantity");
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const addToWishlist = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found");

      const response = await axios.post(
        `${API_BASE_URL}/wishlist/create-wishlistitem`,
        { item_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Item added to your wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to add item to wishlist.");
    }
  };

  const handleAddToCart = async (itemId) => {
    console.log("Add to Cart clicked");
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found");

      await axios.post(
        `${API_BASE_URL}/cart/create-cartitem`,
        {
          item_id: itemId,
          quantity: quantity,
          color_id: selectedColor,
          size_id: selectedSize,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Item added to cart!");
    } catch (err) {
      console.log("Error adding to cart:", err);
      showToast(`Error: ${err.message}`);
    }
  };

  const handleBuyNow = async (itemId) => {
    console.log("Buy Now clicked");
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found");

      await axios.post(
        `${API_BASE_URL}/cart/create-cartitem`,
        {
          item_id: itemId,
          quantity: quantity,
          color_id: selectedColor,
          size_id: selectedSize,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigation.navigate("(tabs)", { screen: "CartScreen" });
    } catch (err) {
      console.log("Error in Buy Now:", err);
      showToast(`Error: ${err.message}`);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View style={{ flexDirection: "row" }}>
        {[...Array(fullStars)].map((_, index) => (
          <Icon key={`full-${index}`} name="star" size={20} color="#FFD700" />
        ))}
        {halfStar && <Icon name="star-half" size={20} color="#FFD700" />}
        {[...Array(emptyStars)].map((_, index) => (
          <Icon key={`empty-${index}`} name="star-o" size={20} color="#FFD700" />
        ))}
      </View>
    );
  };
  const OpenUnity = async () => {
    try {
      console.log(item.sizes[0].garment_type);
      var name = item.sizes[0].garment_type;
      if (item && item.sizes && item.sizes.length > 0) {
        await axios.post(
          `${API_BASE_URL}/update-variable`,
          {value: name}
        );
       
      } else {
        console.error('Item or sizes data is missing');
      }
    } catch (error) {
      console.error('Error updating variable:', error);
    } finally {
      navigation.navigate('UnityScreen');
    }
  };

  const styles = colorScheme === "dark" ? darkStyles : lightStyles;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Error: {error}</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Item not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1,paddingTop:25 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.container}>
      

          <View style={styles.Vimage}>
            <Image source={{ uri: item.images[0] }} style={styles.image} pointerEvents="none"  />
          </View>
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              backgroundColor: "lightgray",
              borderRadius: 6,
              justifyContent: "center",
              paddingLeft: 2,
              top:-55,
              right:-145,
              position:'relative',
              zIndex:1000
              
            }}
            onPress={OpenUnity}
          >
            <Icon5 size={24} name="tshirt" color="white" />
          </TouchableOpacity>
         
          <View style={[styles.Cv,{ paddingTop:-15}]}>
            <View style={styles.row}>
              <Text style={[styles.text, { fontWeight: "bold", fontSize: 20 }]}>
                {item.item_name}
              </Text>
              {sale ? (
                <>
                  <Text
                  style={[styles.text, { paddingLeft:15, fontWeight: "bold", fontSize: 20, textDecorationLine: "line-through" }]}
                >
                  ${item.price}
                </Text>
                <Text
                  style={[styles.text, {paddingLeft:15, fontWeight: "bold", fontSize: 20 }]}
                >
                  ${price}
                </Text>
                </>
              ) : (
                <Text
                  style={[styles.text, { fontWeight: "bold", fontSize: 20 ,paddingLeft:5}]}
                >
                  ${item.price}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.text,
                { fontWeight: "300", fontSize: 18, marginVertical: 15 },
              ]}
            >
              {item.description}
            </Text>

            {/* Color Selector */}
            <View style={[styles.row, { marginBottom: 15 }]}>
              <Text
                style={[
                  styles.text,
                  { fontWeight: "bold", fontSize: 20, marginRight: 10 },
                ]}
              >
                Colors:
              </Text>
              {item.colors.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => {
                    console.log("Color selected:", c.id);
                    setSelectedColor(c.id);
                  }}
                  style={[
                    styles.colorTag,
                    {
                      backgroundColor: c.Hexcode || "#ccc",
                      borderColor: selectedColor === c.id ? "blue" : "#ddd",
                      borderWidth: selectedColor === c.id ? 2 : 1,
                      marginRight: 8,
                    },
                  ]}
                />
              ))}
            </View>

            {/* Size Selector */}
            <View style={[styles.row, { marginBottom: 15 }]}>
              <Text
                style={[
                  styles.text,
                  { fontWeight: "bold", fontSize: 20, marginRight: 10 },
                ]}
              >
                Sizes:
              </Text>
              {item.sizes?.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => {
                    console.log("Size selected:", s.id);
                    setSelectedSize(s.id);
                  }}
                  style={[
                    styles.sizeTag,
                    {
                      backgroundColor:
                        selectedSize === s.id ? "blue" : "#F9F9F9",
                    },
                  ]}
                >
                  <Text style={{ color: selectedSize === s.id ? "#fff" : "#000" }}>
                    {s.size_label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quantity Selector */}
            <View style={[styles.row, { marginBottom: 15, alignItems: "center" }]}>
              <Text
                style={[
                  styles.text,
                  { fontWeight: "bold", fontSize: 20, marginRight: 10 },
                ]}
              >
                Quantity:
              </Text>
              <TouchableOpacity onPress={decrementQuantity} style={styles.qtyBtn}>
                <Icon name="minus" size={16} color="#000" />
              </TouchableOpacity>
              <Text style={[styles.text, { marginHorizontal: 10 }]}>{quantity}</Text>
              <TouchableOpacity onPress={incrementQuantity} style={styles.qtyBtn}>
                <Icon name="plus" size={16} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Additional Images */}
            <View style={{ marginBottom: 15, flexDirection: "row", flexWrap: "wrap" }}>
              {item.images.map((img, index) => (
                <Image key={index} source={{ uri: img }} style={styles.img} />
              ))}
            </View>

            {/* Rating & Reviews */}
            <View style={styles.rating}>
              <Text
                style={[
                  styles.text,
                  { fontWeight: "bold", fontSize: 20, marginBottom: 10 },
                ]}
              >
                Rating & Reviews
              </Text>
              <View style={styles.row}>
                {renderStars(item.rating)}
                <Text style={[styles.text, { fontWeight: "bold", marginLeft: 10 }]}>
                  {item.rating}/5
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Review", { id })}
                >
                  <Icon
                    name="edit"
                    size={35}
                    color="#007BFF"
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{gap:20}}>
                {item.reviews.length > 0 ? (
                  item.reviews.map((review) => (
                    <View key={review.id} style={styles.reviewRow}>
                      <Image
                        source={{ uri: review.get_user.profile_picture }}
                        style={styles.avatar}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.text,
                            { fontWeight: "bold", fontSize: 17 },
                          ]}
                        >
                          {review.get_user.UserName}
                        </Text>
                        {renderStars(review.rating)}
                        <Text
                          style={[
                            styles.text,
                            { fontWeight: "300", fontSize: 14 },
                          ]}
                        >
                          {review.Description}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.text}>
                    No Reviews, be the first to leave one!
                  </Text>
                )}
              </View>

              {/* Most Popular */}
              <View style={{ marginVertical: 10 }}>
                <Text style={styles.text}>Most Popular</Text>
                <ScrollView horizontal style={{ paddingVertical: 10 }} showsHorizontalScrollIndicator={false}>
                  {allItems.slice(0, 4).map((i) => (
                    <TouchableOpacity
                      key={i.id}
                      onPress={() => navigation.navigate("ProductDetails", { id: i.id })}
                      style={{ marginRight: 10 }}
                    >
                      <View style={styles.mvimg}>
                        <Image source={{ uri: i.images[0] }} style={styles.mimg} />
                        <Text style={styles.text}>{i.item_name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.btns}>
       <TouchableOpacity onPress={addToWishlist} style={styles.favBtn}>
        <Icon name="heart" size={35} color="red" />
      </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAddToCart(item.id)} style={styles.btnC}>
          <Text>Add to cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleBuyNow(item.id)} style={styles.btnB}>
          <Text style={{ color: "#fff" }}>Buy now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const lightStyles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  container: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#000000",
    fontSize: 16,
  },
  Vimage: {
    width: "100%",
    height: 450,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  Cv: {
    width: "100%",
    paddingVertical: 15,
  },
  colorTag: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  sizeTag: {
    height: 30,
    width: 50,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    borderRadius: 5,
  },
  img: {
    height: 75,
    width: 75,
    borderRadius: 10,
    marginVertical: 5,
    marginRight: 5,
  },
  rating: {
    marginVertical: 15,
    width: "100%",
  },
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: "#DDD",
    borderRadius: 30,
    marginRight: 10,
  },
  mvimg: {
    height: 130,
    width: 110,
    borderRadius: 10,
    alignItems: "center",
  },
  mimg: {
    width: 90,
    height: 110,
    borderRadius: 10,
  },
  btns: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 15,
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  favBtn: {
    backgroundColor: "#F9F9F9",
    width: 45,
    height: 38,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  btnC: {
    width: 100,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
  },
  btnB: {
    width: 100,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    borderRadius: 8,
  },
});

const darkStyles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  container: {
    alignItems: "center",
    backgroundColor: "#000000",
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",

  },
  text: {
    color: "#ffffff",
    fontSize: 16,
  },
  Vimage: {
    width: "100%",
    height: 450,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  Cv: {
    width: "100%",
    paddingVertical: 15,
  },
  colorTag: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  sizeTag: {
    height: 30,
    width: 50,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    borderRadius: 5,
  },
  img: {
    height: 75,
    width: 75,
    borderRadius: 10,
    marginVertical: 5,
    marginRight: 5,
  },
  rating: {
    marginVertical: 15,
    width: "100%",
  },
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: "#DDD",
    borderRadius: 30,
    marginRight: 10,
  },
  mvimg: {
    height: 130,
    width: 110,
    borderRadius: 10,
    alignItems: "center",
  },
  mimg: {
    width: 90,
    height: 110,
    borderRadius: 10,
  },
  btns: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 15,
    backgroundColor: "#000",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  favBtn: {
    backgroundColor: "#F9F9F9",
    width: 45,
    height: 38,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  btnC: {
    width: 100,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  btnB: {
    width: 100,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    borderRadius: 8,
  },
});

export default ProductDetailsScreen;
