import React from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";

type SwiperProps = {
  images: {
    uri: string;
  }[];
  showButtons?: boolean;
  showDots?: boolean;
  width?: number;
  rounded?: boolean;
};

function FSwiper({
  images,
  showButtons = false,
  showDots = true,
  width = Dimensions.get("window").width - 30,
  rounded = true,
}: SwiperProps) {
  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        showsButtons={showButtons}
        autoplay={false}
        autoplayTimeout={3}
        dotStyle={showDots ? styles.dot : { display: "none" }}
        activeDotStyle={showDots ? styles.activeDot : { display: "none" }}
        paginationStyle={styles.pagination}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={image}
              style={[
                styles.image,
                { width },
                rounded ? styles.roundedImage : null,
              ]}
            />
          </View>
        ))}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  wrapper: {
    height: 300,
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 250,
    resizeMode: "cover",
  },
  roundedImage: {
    borderRadius: 30,
  },
  pagination: {
    bottom: 10,
  },
  dot: {
    backgroundColor: "#E55472",
    width: 10,
    height: 10,
    borderRadius: 6,
  },
  activeDot: {
    backgroundColor: "#E55472",
    width: 30,
    height: 16,
    borderRadius: 8,
  },
});

export default FSwiper;
