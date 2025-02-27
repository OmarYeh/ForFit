import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,  
  useColorScheme
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {API_BASE_URL} from "../config";
import AlertMessage from "../components/ui/AlertMessage"; // Adjust the path as necessary

const AddressForm = () => {
  const router = useRouter();
  const { isEdit, addressId } = useLocalSearchParams();
  const theme = useColorScheme();
  const isDarkMode = theme === "dark"; 
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    if (isEdit && addressId) {
      loadAddressDetails();
    }
  }, [isEdit, addressId]);

  const loadAddressDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${API_BASE_URL}/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setAddress(data.address);
      setZipCode(data.zip_code.toString());
      setCountry(data.country);
      setCity(data.city);
      setPhone(data.phone);
    } catch (error) {
      console.error("Error loading address:", error.response?.data || error.message);
      setAlert({
        type: "error",
        message: "Failed to load address details.",
      });
    }
  };

  const handleSave = async () => {
    if (!address || !zipCode || !country || !city || !phone) {
      setAlert({
        type: "error",
        message: "All fields are required.",
      });
      return;
    }

    const payload = {
      address,
      zip_code: parseInt(zipCode, 10),
      country,
      city,
      phone,
    };

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (isEdit === "true" && addressId) {
        // Update existing address
        await axios.put(`${API_BASE_URL}/addresses/${addressId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlert({
          type: "success",
          message: "Address updated successfully!",
        });
      } else {
        // Create a new address
        await axios.post(`${API_BASE_URL}/addresses`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlert({
          type: "success",
          message: "Address saved successfully!",
        });
      }
    } catch (error) {
      console.error("Error saving address:", error.response?.data || error.message);
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to save the address. Please check your input.",
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={[styles.title,{color: isDarkMode ? 'white' : 'black'}]}>
          {addressId ? "Edit Shipping Address" : "Add New Address"}
        </Text>

        {/* Alert Message Component */}
        <Text style={[styles.alert,{color: isDarkMode ? 'white' : 'black'}]}>{alert.message}</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label,{color: isDarkMode ? 'white' : 'black'}]}>Country</Text>
          <TextInput
            style={[styles.input,{color: isDarkMode ? 'white' : 'black'}]}
            value={country}
            onChangeText={setCountry}
            placeholder="Choose your country"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label,{color: isDarkMode ? 'white' : 'black'}]}>Address</Text>
          <TextInput
            style={[styles.input,{color: isDarkMode ? 'white' : 'black'}]}
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label,{color: isDarkMode ? 'white' : 'black'}]}>Town / City</Text>
          <TextInput
            style={[styles.input,{color: isDarkMode ? 'white' : 'black'}]}
            value={city}
            onChangeText={setCity}
            placeholder="Town / City"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text  style={[styles.label,{color: isDarkMode ? 'white' : 'black'}]}>Postcode</Text>
          <TextInput
            style={[styles.input,{color: isDarkMode ? 'white' : 'black'}]}
            value={zipCode}
            onChangeText={setZipCode}
            placeholder="Postcode"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text  style={[styles.label,{color: isDarkMode ? 'white' : 'black'}]}>Phone Number</Text>
          <TextInput
            style={[styles.input,{color: isDarkMode ? 'white' : 'black'}]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  alert: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddressForm;
