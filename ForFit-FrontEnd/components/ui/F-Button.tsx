import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

type Props = {
  title: string;
  color?: string;
  backgroundColor?: string;
  width?: number | string;
  height?: number;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "default" | "outline" | "rounded";
  disabled?: boolean;
};

function FButton({
  title,
  color = "#FFFFFF", // Default text color is white
  backgroundColor = "#007BFF", // Default background color is blue
  width = "100%",
  height = 45,
  onPress,
  buttonStyle,
  textStyle,
  variant = "default",
  disabled = false,
}: Props) {
  const baseStyle = [
    styles.button,
    { width, height, backgroundColor }, // Apply default background color here
    buttonStyle,
    disabled && styles.disabledButton,
  ].filter(Boolean); // Remove false and undefined values

  let textBaseStyle = [{ color: disabled ? "#A9A9A9" : color }, textStyle];

  switch (variant) {
    case "outline":
      baseStyle.push({
        backgroundColor: "transparent",
        borderColor: "#007BFF",
        borderWidth: 1,
        borderRadius: 20,
      });
      textBaseStyle = [{ color: "#007BFF" }, textStyle]; // Set text color to blue for outline variant
      break;
    case "rounded":
      baseStyle.push({ borderRadius: 20 });
      break;
    default:
      // No changes needed for the default case
      break;
  }

  return (
    <TouchableOpacity
      style={baseStyle as ViewStyle[]}
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}
    >
      <Text style={textBaseStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFSS",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#D3D3D3",
  },
});

export default FButton;
