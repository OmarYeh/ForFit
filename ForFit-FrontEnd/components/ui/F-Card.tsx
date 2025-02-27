import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CheckBox } from "react-native-elements";

type Props = {
  title: string;
  image: {
    uri: string;
  };
  price: number;
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function FCard({
  title,
  image,
  price,
  count,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const handleDecrease = () => {
    if (count === 1) {
      Alert.alert(
        "Remove Item",
        "Are you sure you want to remove this item?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: onRemove },
        ],
        { cancelable: false }
      );
    } else {
      onDecrease();
    }
  };

  const total = price * count;

  return (
    <View
      style={{
        borderRadius: 15,
        backgroundColor: "#fff",
        marginHorizontal: 10,
        marginVertical: 5,
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <TouchableOpacity onPress={onToggleSelect}>
          <CheckBox
            checked={selected}
            onPress={onToggleSelect}
            checkedColor="black"
            size={25}
          />
        </TouchableOpacity> */}
      </View>
      <Image
        source={image}
        style={{
          width: 120,
          height: 120,
          resizeMode: "contain",
          marginHorizontal: 10,
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          marginLeft: 10,
        }}
      >
        <Text style={styles.title}>{title}</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="gap-2"
        >
          <View style={styles.counterContainer}>
            <TouchableOpacity onPress={handleDecrease} style={styles.button}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text
              style={{
                color: "white",
              }}
            >
              {count}
            </Text>
            <TouchableOpacity onPress={onIncrease} style={styles.button}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.priceContainer}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
    backgroundColor: "#E55472",
    color: "white",
  },
  button: {
    marginHorizontal: 15,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
  priceContainer: {
    justifyContent: "flex-end",
  },
});
