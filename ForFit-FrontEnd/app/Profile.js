import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {API_BASE_URL} from '../config';
import AlertMessage from "../components/ui/AlertMessage";

const ProfilePage = () => {
  const [photo, setPhoto] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    profile_picture: "",
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);  // Loading state for network requests

  const scheme = useColorScheme(); // Detect dark/light mode

  // Fetch user data
  const fetchUserDetails = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token is missing.");

      const response = await axios.get(`${API_BASE_URL}/profile/getUserDetails`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data.user;
      setUser({
        username: userData.UserName,
        email: userData.email,
        profile_picture: userData.profile_picture,
      });

      const profilePictureUrl = userData.profile_picture
      ? `${API_BASE_URL.replace("/api", "")}/storage/${userData.profile_picture}`
      : null;
      setPhoto(profilePictureUrl);
    } catch (error) {
      console.error("Failed to fetch user details:", error.message);
      setAlert({ type: "error", message: "Failed to fetch user details." });
    } finally {
      setLoading(false); // Stop loading spinner after fetching user data
    }
  }, []);

  // Image picker
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setAlert({ type: "error", message: "Permission to access gallery is denied." });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5, // Reduce quality for faster uploads
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        setPhoto(uri);
        handleUpdateProfilePicture(uri);
      }
    } catch (error) {
      setAlert({ type: "error", message: "Something went wrong while picking the image." });
    }
  };

  // Update profile picture
  const handleUpdateProfilePicture = async (imageUri) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("profile_picture", {
        uri: imageUri,
        name: "profile_picture.jpg",
        type: "image/jpeg",
      });

      setLoading(true);  // Show loading indicator during image upload
      await axios.post(`${API_BASE_URL}/profile/update-profile-picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAlert({ type: "success", message: "Profile picture updated successfully!" });
    } catch (error) {
      setAlert({ type: "error", message: "Failed to update profile picture." });
    } finally {
      setLoading(false);  // Stop loading after the image upload
    }
  };

  // Update username
  const handleEditUsername = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.put(
        `${API_BASE_URL}/profile/update-username`,
        { UserName: user.username },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlert({ type: "success", message: "Username updated successfully!" });
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Failed to update username." });
    }
  };

  // Update email
  const handleEditEmail = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.put(
        `${API_BASE_URL}/profile/update-email`,
        { email: user.email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlert({ type: "success", message: "Email updated successfully!" });
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Failed to update email." });
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setAlert({ type: "error", message: "New password and confirm password do not match." });
      return;
    }
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.put(
        `${API_BASE_URL}/profile/changePassword`,
        {
          current_password: currentPassword,
          updated_password: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAlert({ type: "success", message: "Password updated successfully!" });
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Failed to change password." });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUserDetails();
  }, [fetchUserDetails]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: scheme === "dark" ? "#000" : "#fff" }]}>
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { color: scheme === "dark" ? "#fff" : "#000" }]}>Settings</Text>
        <AlertMessage type={alert.type} message={alert.message} />
        {loading ? <ActivityIndicator size="large" color="#004BFE" /> : (
          <>
            <Text style={[styles.subtitle, { color: scheme === "dark" ? "#fff" : "#000" }]}>Your Profile</Text>
            <View style={styles.profilepicture}>
              <TouchableOpacity style={styles.editPictureButton} onPress={pickImage}>
                <Text style={styles.editPictureButtonText}>✏️</Text>
              </TouchableOpacity>
              <View style={styles.profile}>
                {photo ? <Image source={{ uri: photo }} style={styles.avatar} /> : <View style={styles.avatarPlaceholder} />}
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: scheme === "dark" ? "#fff" : "#000" }]}>Username</Text>
              <TextInput
                style={[styles.input, { backgroundColor: scheme === "dark" ? "#333" : "#fff", color: scheme === "dark" ? "#fff" : "#000" }]}
                value={user.username}
                onChangeText={(text) => setUser({ ...user, username: text })}
              />
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: "#004BFE" }]}
                onPress={handleEditUsername}
              >
                <Text style={styles.editButtonText}>Save Username</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: scheme === "dark" ? "#fff" : "#000" }]}>Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: scheme === "dark" ? "#333" : "#fff", color: scheme === "dark" ? "#fff" : "#000" }]}
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
              />
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: "#004BFE" }]}
                onPress={handleEditEmail}
              >
                <Text style={styles.editButtonText}>Save Email</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.passwordSection}>
              <Text style={[styles.subtitle, { color: scheme === "dark" ? "#fff" : "#000" }]}>Change Password</Text>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: scheme === "dark" ? "#fff" : "#000" }]}>Current Password</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: scheme === "dark" ? "#333" : "#fff", color: scheme === "dark" ? "#fff" : "#000" }]}
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={(text) => setCurrentPassword(text)}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: scheme === "dark" ? "#fff" : "#000" }]}>New Password</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: scheme === "dark" ? "#333" : "#fff", color: scheme === "dark" ? "#fff" : "#000" }]}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: scheme === "dark" ? "#fff" : "#000" }]}>Confirm New Password</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: scheme === "dark" ? "#333" : "#fff", color: scheme === "dark" ? "#fff" : "#000" }]}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                />
              </View>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: "#004BFE" }]}
                onPress={handleChangePassword}
              >
                <Text style={styles.saveButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20, // Adjust top margin for safe area
    marginBottom: 20, // Adjust bottom margin for safe area
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  profile: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilepicture: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  editPictureButton: {
    padding: 5,
    width: 35,
    marginLeft: 50,
    backgroundColor: "#004BFE",
    borderRadius: 20,
  },
  editPictureButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  editButton: {
    marginTop: 10,

    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  passwordSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  saveButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default ProfilePage;
