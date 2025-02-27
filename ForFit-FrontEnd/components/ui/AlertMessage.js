import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AlertMessage = ({ type, message }) => {
  if (!message) return null;

  const alertStyles =
    type === "success" ? styles.successAlert : styles.errorAlert;

  return (
    <View style={[styles.alertContainer, alertStyles]}>
      <Text style={styles.alertText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
    textAlign: "center",
  },
  successAlert: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
  },
  errorAlert: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
  },
  alertText: {
    color: "#155724",
    textAlign: "center",
  },
});

export default AlertMessage;
