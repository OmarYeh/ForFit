import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  useColorScheme,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
};

const Splash = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Splash">>();
  const colorScheme = useColorScheme(); // Get the system color scheme (light/dark)

  useEffect(() => {
    // Simulate a delay for splash screen visibility
    setTimeout(() => {
      SplashScreen.hideAsync(); // Hide the splash screen
      navigation.replace("Welcome"); // Navigate to the Welcome screen after splash screen
    }, 3000); // Adjust delay as needed
  }, [navigation]);

  return (
    <View
      style={[
        styles.container,
        colorScheme === "dark" ? styles.darkContainer : styles.lightContainer,
      ]}
    >

      <Image
        source={require("../assets/images/shopping-app.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text
        style={[
          styles.appName,
          colorScheme === "dark" ? styles.darkText : styles.lightText,
        ]}
      >
        Forfit
      </Text>
      <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lightContainer: {
    backgroundColor: "#fff", // Light mode background
  },
  darkContainer: {
    backgroundColor: "#121212", // Dark mode background
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
  },
  lightText: {
    color: "#007BFF", // Light mode text color
  },
  darkText: {
    color: "#fff", // Dark mode text color
  },
  loader: {
    marginTop: 20,
  },
});

export default Splash;