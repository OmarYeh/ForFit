import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Image, ScrollView } from "react-native";

const { width } = Dimensions.get("window");

const advertisements = [
  { id: 1, image: require("../assets/images/OIP.jpeg") },
  { id: 2, image: require("../assets/images/OIP (1).jpeg") },
  { id: 3, image: require("../assets/images/t.webp") },
];

const AdvertisementSlider = () => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % advertisements.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    }, 2000);

    return () => clearInterval(interval); 
  }, [currentIndex]);

  return (
    <View style={styles.sliderContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {advertisements.map((ad) => (
          <Image key={ad.id} source={ad.image} style={styles.adImage} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: "100%",
    height: 200,
    overflow: "hidden",
  },
  adImage: {
    width: width,
    height: "100%",
    resizeMode: "cover",
  },
});

export default AdvertisementSlider;
