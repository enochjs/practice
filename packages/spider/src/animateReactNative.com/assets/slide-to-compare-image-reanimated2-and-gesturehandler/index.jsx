// Inspiration: https://pinterest.com/pin/270497521359910567/

import * as React from 'react';
import {
  StatusBar,
  Image,
  ImageBackground,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Constants from 'expo-constants';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  interpolate,
} from 'react-native-reanimated';

import { Feather } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');

// Pexels image
// https://www.pexels.com/photo/wood-animal-cute-grass-4934901/
const image = `https://images.pexels.com/photos/4934901/pexels-photo-4934901.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;
const secondImage = `https://images.pexels.com/photos/4934901/pexels-photo-4934901.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260&sat=-100`;
const bg = `https://images.pexels.com/photos/7763205/pexels-photo-7763205.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500`;

const _imageHeight = 300;
const _handlerSize = 6;

export default function App() {
  const posX = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = posX.value;
    },
    onActive: (event, ctx) => {
      posX.value = ctx.startX + event.translationX;
    },
    onEnd: (event, ctx) => {
      // posX.value = ctx.startX + event.translationX;
    },
  });

  const leftImage = useAnimatedStyle(() => {
    return {
      flex: interpolate(posX.value, [-width / 2, 0, width / 2], [0, 1, 2]),
    };
  });
  const rightImage = useAnimatedStyle(() => {
    console.log(posX.value);
    return {
      flex: interpolate(posX.value, [-width / 2, 0, width / 2], [2, 1, 0]),
    };
  });
  return (
    <ImageBackground
      source={{ uri: bg }}
      style={styles.container}
      blurRadius={80}>
      <StatusBar hidden />
      <View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            marginBottom: 20,
            color: '#fff',
            opacity: 0.7,
          }}>
          Compare
        </Text>
        <View
          style={{
            flexDirection: 'row',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
          <Animated.Image
            source={{ uri: image }}
            style={[
              { height: _imageHeight, resizeMode: 'cover', flex: 1 },
              leftImage,
            ]}
          />
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View
              style={{
                width: _handlerSize,
                backgroundColor: 'transparent',
                zIndex: 9999,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  borderRadius: 30,
                }}>
                <Feather name="chevron-left" size={24} color="black" />
                <Feather name="chevron-right" size={24} color="black" />
              </View>
            </Animated.View>
          </PanGestureHandler>
          <Animated.Image
            source={{ uri: secondImage }}
            style={[
              { height: _imageHeight, resizeMode: 'cover', flex: 1 },
              rightImage,
            ]}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
