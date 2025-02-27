import React from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";

interface FTextAreaProps extends TextInputProps {
  display?: boolean;
}

const FTextArea: React.FC<FTextAreaProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  display=true,
  ...rest
}) => {
  if (!display) return null;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textArea}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={true}
        numberOfLines={4}
        placeholderTextColor="#999"
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  textArea: {
    height: 150,
    borderColor: "grey",
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "white",
    color: "#333",
    fontSize: 16,
    textAlignVertical: "top",
  },
  disabled: {
    backgroundColor: "#f0f0f0",
  },
});

export default FTextArea;
