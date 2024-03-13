// Inspiration: https://dribbble.com/shots/15057600-Wallpapers-App-Interactions
import { MotiView } from 'moti';
import { AnimatePresence } from 'framer-motion';
import * as React from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import chroma from 'chroma-js';

const colors = chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(14);

const data = colors.map((color, index) => ({
  key: color,
  bg: color,
  image: `https://source.unsplash.com/collection/31433654/300x${560 + index}`,
}));

const { width, height } = Dimensions.get('screen');

const IMAGE_WIDTH = width * 0.8;
const IMAGE_HEIGHT = height * 0.75;
const SPACING = 10;

export default function Wallpapers() {
  // const [data, setData] = React.useState([]);
  // const memoData = React.useRef(null);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View
      style={{ flex: 1, backgroundColor: '#000', justifyContent: 'flex-end' }}
    >
      <Animated.FlatList
        data={data}
        extraData={data}
        keyExtractor={(item) => String(item.id)}
        scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: (width - (IMAGE_WIDTH + SPACING * 2)) / 2,
        }}
        style={{ flexGrow: 0, backgroundColor: 'transparent' }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: true,
          },
        )}
        snapToInterval={IMAGE_WIDTH + SPACING * 2}
        decelerationRate="fast"
        renderItem={({ item, index }) => {
          const inputRange = [index - 1, index, index + 1];
          const animated = Animated.divide(scrollX, IMAGE_WIDTH + SPACING * 2);

          const translateY = animated.interpolate({
            inputRange,
            outputRange: [100, 40, 100],
            extrapolate: 'clamp',
          });
          const scale = animated.interpolate({
            inputRange,
            outputRange: [1.5, 1, 1.5],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              style={{
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                transform: [
                  {
                    translateY,
                  },
                ],
                margin: SPACING,
                overflow: 'hidden',
                borderRadius: 30,
              }}
            >
              <Animated.Image
                style={{
                  borderRadius: 20,
                  width: IMAGE_WIDTH,
                  height: IMAGE_HEIGHT,
                  resizeMode: 'cover',
                  transform: [{ scale }],
                }}
                source={{ uri: item.image }}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
}
