import { EvilIcons } from "@expo/vector-icons";
import React from "react";
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";

type Props = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
  secureTextEntry?: boolean;
  onIconPress?: () => void;
  display: boolean;
  keyboardType?: "default" | "numeric" | "email-address";
};

function FTextField({
  placeholder,
  value,
  onChangeText,
  disabled,
  secureTextEntry,
  onIconPress,
  display = false,
  keyboardType = "default",
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#888"
        editable={!disabled}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        keyboardType={keyboardType}
      />
      {display ? (
        <TouchableOpacity style={styles.iconContainer} onPress={onIconPress}>
          <EvilIcons name="search" size={24} color="#888" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 54,
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "white",
    color: "#333",
    fontSize: 16,
    borderColor: "#E5E5E5",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FTextField;
