import React, { useState, useRef,useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Image, TouchableOpacity, Text,SafeAreaView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import ChatMessage from '../../components/ChatMessage';
import OpenAI from 'openai';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Icon } from 'react-native-elements';
import { GPT_API_TOKEN } from "../../config";
const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const flatListRef = useRef();

  useEffect(() => {
    if (messages.length === 0) {
      const greetingMessage = {
        role: 'assistant',
        content: 'Hello! How can I help you with your fashion choices today?',
      };
      setMessages([greetingMessage]);
    }
  }, []);

  const endpoint = "https://models.inference.ai.azure.com";
  const modelName = "gpt-4o";

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
        setSelectedImage(uri);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  const convertToBase64 = async (uri) => {
    try {
      const base64String = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return  `data:image/jpg;base64,${base64String}`;
    } catch (error) {
      console.error("Error converting image to Base64:", error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage = {
      role: 'user',
      content: inputText.trim(),
      image: selectedImage ? selectedImage : null,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);

    try {
      setIsLoading(true);
      console.log(GPT_API_TOKEN);
      const Ibase64 = selectedImage ? await convertToBase64(selectedImage) : null;
      const client = new OpenAI({ baseURL: endpoint, apiKey: GPT_API_TOKEN });
      
      const response = await client.chat.completions.create({
        messages: [
          { role: "system", content: "You are a Fashion Consultant. That advises on clothing choices based on body type, trends, and occasion" },
          { role: "user", content: [
            { type: "text", text: userMessage.content },
            ...(Ibase64 ? [{ type: "image_url", image_url: { url: Ibase64, details: "low" } }] : [])
          ] },
        ],
        temperature: 1.0,
        top_p: 1.0,
        max_tokens: 1000,
        model: modelName
      });

      const botMessage = response.choices[0]?.message;
      if (botMessage) {
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={0}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <ChatMessage message={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
        <Icon name="camera" type="font-awesome" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
        />
        <Button
          title="Send"
          onPress={handleSend}
          disabled={isLoading || (!inputText.trim() && !selectedImage)}
          color="#007AFF"
        />
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop:25,
    flex:1,
    backgroundColor: '#F5F5F5',
    
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 150,
  },
  previewImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
  imageButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#EEE',
    marginRight: 10,
  },
  imageButtonText: {
    fontSize: 20,
  },
});

export default ChatScreen;
