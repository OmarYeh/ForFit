import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { Icon } from 'react-native-elements';

const ChatMessage = ({ message }) => {
  return (
    <View style={[styles.messageContainer, message.role === 'user' ? styles.userMessage : styles.botMessage]}>
     {message.image && <Image source={{ uri: message.image }} style={styles.chatImage} resizeMode="contain" />}
      <Text style={styles.messageText}>{message.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 15,
    borderRadius: 20,
    marginVertical: 8,
    maxWidth: '80%',
    gap:10
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#34C759',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  chatImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 5,
  },
});

export default ChatMessage;