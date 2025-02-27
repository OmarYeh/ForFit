import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

const cardsData = [
  {
    id: '1',
    imageUrl: require('../assets/images/hello1.png'),
    title: 'Ready?',
    text: 'Start your journey today with just one click.',
  },
  {
    id: '2',
    imageUrl: require('../assets/images/hello2.png'),
    title: 'Join Us Now!',
    text: 'Get your membership and start using all features today.',
  },
  {
    id: '3',
    imageUrl: require('../assets/images/hello3.png'),
    title: 'Welcome!',
    text: 'Enjoy all the benefits, start using the app now.',
  },
];

const SwipeableCardPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const renderCard = ({ item, index }) => (
    <View style={styles.card}>
      <Image source={item.imageUrl} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
      {index === cardsData.length - 1 && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('(tabs)', { screen: 'ShopScreen' })} 
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(contentOffsetX / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      {/* Always set the status bar style to dark-content */}
      <StatusBar barStyle="dark-content" />

      <ImageBackground
        source={require("../assets/images/reg-bac1.png")} // Background image
        style={styles.background} // Full screen background
      >
        <FlatList
          data={cardsData}
          renderItem={renderCard}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={handleScroll}
        />
        <View style={styles.dotContainer}>
          {cardsData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  card: {
    borderRadius: 10,
    padding: 20,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  dotContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 4,
    backgroundColor: '#bbb',
  },
  activeDot: {
    backgroundColor: '#007bff',
  },
});

export default SwipeableCardPage;
