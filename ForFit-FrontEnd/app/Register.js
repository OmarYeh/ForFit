import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/ui/F-Button";
import * as FileSystem from "expo-file-system";
import {API_BASE_URL} from '../config';
import * as SecureStore from "expo-secure-store"; 

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [UserName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const [age, setAge] = useState("");

  // Image picker function
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need access to your gallery to proceed."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        setProfilePicture(uri); // Save the URI of the selected image
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  // Function to convert image URI to Base64 string
  const convertToBase64 = async (uri) => {
    try {
      const base64String = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64String;
    } catch (error) {
      console.error("Error converting image to Base64:", error);
      return null;
    }
  };

  // Handle registration
  const handleRegister = async () => {
    if (!UserName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!profilePicture) {
      Alert.alert("Error", "Please select a profile picture.");
      return;
    }

    try {
      // Convert the image URI to Base64 string
      const base64Image = await convertToBase64(profilePicture);

      if (!base64Image) {
        Alert.alert("Error", "Unable to convert image to Base64.");
        return;
      }

      const formData = new FormData();
      formData.append("UserName", UserName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("password_confirmation", confirmPassword);
      formData.append("profile_picture", base64Image); // Sending Base64 image string
      formData.append("age", age);
      const response = await axios.post(`${API_BASE_URL}/register`, formData, {

     

        headers: {
          "Content-Type": "multipart/form-data", // Set the correct header for form-data
        },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      if (error.response) {
        Alert.alert("Registration Failed", error.response.data.message || "Unknown error occurred.");
      } else {
        Alert.alert("Network Error", "Please check your connection and try again.");
      }
    }
  };

  const handleAgeChange = (value) => {
    
    const numericValue = value.replace(/[^0-9]/g, '');
    setAge(numericValue);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <ImageBackground
      source={require("../assets/images/reg-bac.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        {/* Profile Picture */}
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Image
                source={require("../assets/images/camera icon.png")}
                style={styles.logoPlaceholder}
                resizeMode="contain"
              />
            </View>
          )}
        </TouchableOpacity>
      <TextInput
          placeholder="User Name"
          value={UserName}
          onChangeText={setUserName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
        />
  
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={handleAgeChange}
          keyboardType="numeric"
          maxLength={3}
          placeholder="Enter your age"
        />
        {/* Submit Button */}
        <CustomButton title="Done" onPress={handleRegister} />

        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    </TouchableWithoutFeedback> 

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 40,
    alignSelf: "flex-start",
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#007BFF",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    opacity: 0.5,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    color: "black", 
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
    borderRadius: 10,
  },
  cancelText: {
    color: "#888",
    marginTop: 10,
    fontSize: 16,
  },
});

export default RegisterScreen;