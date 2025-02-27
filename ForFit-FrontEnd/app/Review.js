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
  Picker
} from 'react-native';

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {API_BASE_URL} from "../config";
import { CheckBox } from "react-native-web";
import { goBack } from 'expo-router/build/global-state/routing';

const Review = () => {
    const [text,setText] = useState(null);
    const [rating,setRating] = useState(0);
      const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;
    const [value, setValue] = useState(0);
  

    const CreateReview=async () =>{
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }
        console.log(token)
        try{
       const response =  await axios.post(`${API_BASE_URL}/item/review`,
          {
            item_id: id,
            Description: text,
            rating: rating
            
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }catch(error){
        Alert.alert('Error', error.message);
      }

      navigation.navigate("ProductDetails", { id: id })
    }
    return (
        <KeyboardAvoidingView>
            <View>
            <TextInput
        placeholder="Rating"
        onChangeText={setRating}
        value={rating} />
   
      </View>
      <View>
      <TextInput
        style={styles.textInput}
        multiline={true} 
        numberOfLines={4} 
        placeholder="Description..."
        onChangeText={setText}
        value={text}
      />

      </View>
        <TouchableOpacity
        onPress={CreateReview}
        style={{
          postion:"absolute",
          width:100,height:50,backgroundColor:"blue",color:"white",paddingTop:15,borderRadius:8,paddingLeft:5
        }}>
          <Text style={{color:"#fff"}}>Leave Review</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({})

export default Review;