import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

type Props = {
  boxColor: string;
  name: string;
  lastName: string;
  stars: number;
  date: string;
  reviewText: string;
  title: string;
};

function FReview({ name, lastName, stars, date, reviewText, title }: Props) {
  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <Text style={styles.name}>{`${name} ${lastName}`}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="star"
            type="font-awesome"
            color={star <= stars ? "#FFD700" : "#CCCCCC"}
            size={20}
            style={{
              marginRight: 5,
            }}
          />
        ))}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.reviewText}>{reviewText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "#E9F1FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    color: "gray",
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
  },
});

export default FReview;
