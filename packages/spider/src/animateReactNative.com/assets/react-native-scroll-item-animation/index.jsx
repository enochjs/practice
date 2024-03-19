// Inspiration: https://dribbble.com/shots/14154226-Rolodex-Scrolling-Animation/attachments/5780833?mode=media
// Photo by Sharefaith from Pexels
// Background image: https://www.pexels.com/photo/pink-rose-closeup-photography-1231265/

import * as React from 'react';
import {
  StatusBar,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet
} from 'react-native';
import { faker } from '@faker-js/faker';

faker.seed(10);
const DATA = [...Array(30).keys()].map((_, i) => {
  return {
    key: faker.datatype.uuid(),
    image: `https://randomuser.me/api/portraits/${faker.helpers.arrayElement([
      'women',
      'men',
    ])}/${faker.datatype.number({ min: 0, max: 60 })}.jpg`,
    name: faker.name.findName(),
    jobTitle: faker.name.jobTitle(),
    email: faker.internet.email(),
  };
});

const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

export default () => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar hidden />
      <Image
        source={{
          uri: 'https://images.pexels.com/photos/1231265/pexels-photo-1231265.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        }}
        style={[StyleSheet.absoluteFillObject, { opacity: 0.4 }]}
        blurRadius={70}
      />
      <Animated.FlatList
        data={DATA}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{
          padding: SPACING,
          paddingTop: StatusBar.currentHeight || 42,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const scale = scrollY.interpolate({
            inputRange: [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)],
            outputRange: [1, 1, 1, 0],
          });
          const opacity = scrollY.interpolate({
            inputRange: [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 1)],
            outputRange: [1, 1, 1, 0],
          });
          return (
            <Animated.View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.85)',
                marginBottom: SPACING,
                padding: SPACING,
                borderRadius: 12,
                shadowColor: '#000',
                shadowRadius: 30,
                shadowOpacity: 0.2,
                shadowOffset: {
                  width: 0,
                  height: 40,
                },
                opacity,
                transform: [{ scale }],
              }}>
              <Image
                source={{ uri: item.image }}
                style={{
                  marginRight: SPACING,
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_SIZE,
                }}
              />
              <View>
                <Text
                  style={{
                    fontSize: 22,
                    marginBottom: 5,
                    fontWeight: '500',
                    color: '#222',
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: 8,
                    letterSpacing: 1,
                    opacity: 0.7,
                  }}>
                  {item.jobTitle}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: 'Menlo',
                    opacity: 0.7,
                    color: 'blue',
                  }}>
                  {item.email}
                </Text>
              </View>
            </Animated.View>
          );
        }}
      />
    </View>
  );
};
