import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import axios from 'axios';
import { ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from "../components/ui/F-Button";
import {API_BASE_URL} from '../config';

const LoginScreen = () => {
  const navigation = useNavigation(); 

  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const [photo, setPhoto] = useState(null); 
  const [error, setError] = useState(false); 
  const handleEmailSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    try {
      // Check if the email exists and get user info
      
      const response = await axios.post(`${API_BASE_URL}/check-email`, { email });
      if (response.data.exists) {
        // Fetch the user's name and profile picture
        const userResponse = await axios.post(`${API_BASE_URL}/get-user`, { email });
        setName(userResponse.data.name);
        setPhoto(userResponse.data.profile_picture);
        setStep(2);
      } else {
        Alert.alert('Error', 'Email not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
      console.error('Email check error:', error.message);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      if (response.data.success) {
        const userName = response.data.user.UserName; 
  

        await AsyncStorage.setItem('userName', userName);
        await AsyncStorage.setItem('authToken', response.data.access_token);  
        await AsyncStorage.setItem('email', email);
  
        navigation.navigate('Hellocard'); 
      } else {
        Alert.alert('Error', 'Login failed, please check your credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Something went wrong while logging in');
    }
  };

  if (step === 1) {
    return (
      <ImageBackground
        source={require("../assets/images/reg-bac1.png")}
        style={styles.background}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Text style={styles.header}>Login</Text>
          <Text style={styles.subHeader}>Good to see you back!</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={handleEmailSubmit}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }

  if (step === 2) {
    return (
      <ImageBackground
        source={require("../assets/images/reg-bac1.png")}
        style={styles.background}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.profile}>
            {photo ? (
              <Image
                source={{ uri: `${photo}` }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar} />
            )}
            <Text style={styles.greeting}>Hello, {name}!</Text>
          </View>
          <TextInput
            placeholder="Type your password"
            value={password}
            onChangeText={setPassword}
            style={[styles.input, error && { borderColor: 'red', borderWidth: 2 }]}
            secureTextEntry
          />
          {error && <Text style={styles.errorText}>Wrong Password</Text>}
          <TouchableOpacity style={styles.button} onPress={handlePasswordSubmit}>
            <Text style={styles.buttonText}>login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep(1)}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }

  return null; 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#FFF',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom:10,
  },
  backButtonText: {
    marginTop: 15,
  },
  cancelText: {
    color: '#6C757D',
    marginTop: 15,
    fontSize: 16,
  },
  profile: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#DDD',
    borderRadius: 40, 
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default LoginScreen;
