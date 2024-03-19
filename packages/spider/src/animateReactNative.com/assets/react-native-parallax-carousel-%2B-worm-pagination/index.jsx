// 7 types of pagination

import * as React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  FlatList,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Constants from 'expo-constants';
import { faker } from '@faker-js/faker';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('screen');
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH * 1.47;

faker.seed(10);

const images = [
  'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=800&q=80',
  'https://images.unsplash.com/photo-1562569633-622303bafef5?w=800&q=80',
  'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=800&q=80',
  'https://images.unsplash.com/photo-1555096462-c1c5eb4e4d64?w=800&q=80',
  'https://images.unsplash.com/photo-1517957754642-2870518e16f8?w=800&q=80',
  'https://images.unsplash.com/photo-1546484959-f9a381d1330d?w=800&q=80',
  'https://images.unsplash.com/photo-1548761208-b7896a6ff225?w=800&q=80',
  'https://images.unsplash.com/photo-1511208687438-2c5a5abb810c?w=800&q=80',
  'https://images.unsplash.com/photo-1548614606-52b4451f994b?w=800&q=80',
  'https://images.unsplash.com/photo-1548600916-dc8492f8e845?w=800&q=80',
];
const data = images.map((image) => {
  return {
    key: faker.datatype.uuid(),
    photo: image,
    avatar_url: `https://randomuser.me/api/portraits/women/${faker.datatype.number(
      40
    )}.jpg`,
  };
});

const size = 12;
const spacing = 6;

const Pagination = ({ scrollX, dotted = false, worm = false, square }) => {
  const inputRange = [0, width, width * 2];
  return (
    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
      {data.map((item, index) => {
        const opacity = scrollX.interpolate({
          inputRange: [(index - 1) * width, index * width, (index + 1) * width],
          outputRange: [0.1, dotted ? 1 : 0.1, 0.1],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={index}
            style={{
              opacity,
              width: size,
              height: size,
              borderRadius: square ? 0 : size,
              marginHorizontal: spacing,
              backgroundColor: '#333',
            }}
          />
        );
      })}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: dotted ? size * 2 : size,
            height: dotted ? size * 2 : size,
            top: dotted ? -size * 0.5 : 0,
            left: dotted ? -size * 0.5 : 0,
            borderRadius: square ? 0 : size,
            marginHorizontal: spacing,
            borderColor: '#333',
            borderWidth: dotted ? 2 : 0,
            backgroundColor: dotted ? 'transparent' : '#333',
          },
          {
            transform: [
              {
                translateX: scrollX.interpolate({
                  inputRange,
                  outputRange: [
                    0,
                    size + spacing * 2,
                    (size + spacing * 2) * 2,
                  ],
                }),
              },
              {
                scaleX: Animated.modulo(
                  Animated.modulo(Animated.divide(scrollX, width), width),
                  1
                ).interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [
                    1,
                    !worm
                      ? 1
                      : dotted
                      ? 1 + spacing / size
                      : 1 + size / spacing,
                    1,
                  ],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const FillPagination = ({ scrollX, square = false }) => {
  const inputRange = [0, width, width * 2];
  return (
    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
      {data.map((item, index) => {
        const opacity = scrollX.interpolate({
          inputRange: [
            (index - 0.5) * width,
            index * width,
            (index + 0.5) * width,
          ],
          outputRange: [0.1, 1, 0.1],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={index}
            style={{
              opacity,
              width: size,
              height: size,
              borderRadius: square ? 0 : size,
              marginHorizontal: spacing,
              backgroundColor: '#333',
            }}
          />
        );
      })}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size / 4,
            height: size / 4,
            top: size / 2 - size / 8,
            left: size / 2 - size / 8,
            marginHorizontal: spacing,
            backgroundColor: '#333',
          },
          {
            transform: [
              {
                translateX: scrollX.interpolate({
                  inputRange,
                  outputRange: [
                    0,
                    size + spacing * 2,
                    (size + spacing * 2) * 2,
                  ],
                }),
              },
              {
                scaleX: Animated.modulo(
                  Animated.modulo(Animated.divide(scrollX, width), width),
                  1
                ).interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 8, 1],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: true,
          }
        )}
        pagingEnabled
        renderItem={({ item, index }) => {
          const translateX = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [-width * 0.7, 0, width * 0.7],
          });
          return (
            <View
              style={{ width, justifyContent: 'center', alignItems: 'center' }}>
              <View
                style={{
                  borderRadius: 18,
                  backgroundColor: 'white',
                  padding: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.4,
                  shadowRadius: 20,
                }}>
                <Animated.View
                  style={{
                    width: ITEM_WIDTH,
                    height: ITEM_HEIGHT,
                    overflow: 'hidden',
                    alignItems: 'center',
                    borderRadius: 14,
                  }}>
                  <Animated.Image
                    source={{ uri: item.photo }}
                    style={[
                      {
                        width: ITEM_WIDTH * 1.4,
                        height: ITEM_HEIGHT,
                        resizeMode: 'cover',
                        transform: [
                          {
                            translateX,
                          },
                        ],
                      },
                    ]}
                  />
                </Animated.View>
                <Image
                  source={{ uri: item.avatar_url }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 60,
                    position: 'absolute',
                    bottom: -27,
                    right: 40,
                    borderWidth: 6,
                    borderColor: 'white',
                    backgroundColor: 'red',
                  }}
                  resizeMode="cover"
                />
              </View>
            </View>
          );
        }}
      />
      <View style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}>
        <FillPagination scrollX={scrollX} />
        <FillPagination scrollX={scrollX} square />
        <Pagination scrollX={scrollX} worm square />
        <Pagination scrollX={scrollX} worm dotted />
        <Pagination scrollX={scrollX} />
        <Pagination scrollX={scrollX} square />
        <Pagination scrollX={scrollX} dotted />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
