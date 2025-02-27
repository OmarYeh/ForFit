import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  useColorScheme,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const WelcomePage = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // Get the system color scheme (light/dark)

  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.darkContainer : styles.lightContainer,
      ]}
    >

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.title,
            colorScheme === "dark" ? styles.darkText : styles.lightText,
          ]}
        >
          For
        </Text>
        <Text style={styles.title2}>Fit</Text>
      </View>

      {/* Illustration */}
      <Image
        source={require("../assets/images/shopping-app.png")}
        style={styles.image}
      />

      {/* Description */}
      <Text
        style={[
          styles.description,
          colorScheme === "dark" ? styles.darkText : styles.lightDescription,
        ]}
      >
        Beautiful eCommerce UI Kit for your online store
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => navigation.navigate("Register")} 
        >
        <Text style={styles.getStartedText}>Let's get started</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginOption}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginText}>I already have an account</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    flexDirection: "row",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title2: {
    fontSize: 30,
    marginLeft: 10,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  lightContainer: {
    backgroundColor: "#fff", // Light mode background
  },
  darkContainer: {
    backgroundColor: "#121212", // Dark mode background
  },
  image: {
    width: 290,
    height: 300,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  lightDescription: {
    color: "#6C757D", // Light mode description color
  },
  darkText: {
    color: "#fff", // Dark mode text color
  },
  lightText: {
    color: "#000", // Light mode text color
  },
  getStartedButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  getStartedText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    color: "#007BFF",
    fontSize: 16,
  },
  arrow: {
    color: "#007BFF",
    fontSize: 18,
    marginLeft: 5,
  },
});

export default WelcomePage;