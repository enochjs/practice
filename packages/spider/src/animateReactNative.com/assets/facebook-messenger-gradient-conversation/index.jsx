import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
  // useAnimatedStyle,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

function generateUUID() {
  // Simple UUID generation function (not RFC compliant)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getRandomBoolean() {
  return Math.random() < 0.5; // Randomly returns true or false
}

function getRandomChatMessage() {
  const chatMessages = [
    'Sure, I can help you with that!',
    'Let me know if you need further assistance.',
    'Have a great day ahead!',
    "What's on your mind today?",
    'How can I assist you?',
    'Feel free to ask any questions you have.',
    "I'm here to help with whatever you need.",
    "Is there anything specific you'd like to know?",
    "Let's get started!",
    'Just let me know how I can assist you.',
    "I'm listening.",
    'Ready when you are!',
    'How can I make your day better?',
    "Tell me what you're thinking.",
    'Looking forward to helping you out!',
    "I'm all ears!",
    'Need some advice or information?',
    'Feel free to chat with me anytime.',
    "I'm here to make things easier for you.",
    "Let's tackle your tasks together!",
  ];
  return chatMessages[Math.floor(Math.random() * chatMessages.length)];
}

const data = [...Array(100).keys()].map((i) => ({
  key: generateUUID(),
  text: getRandomChatMessage(),
  mine: getRandomBoolean(),
}));

export default () => {
  const [measures, setMeasures] = React.useState({ height });
  const aRef = useAnimatedRef();
  const onScroll = useScrollViewOffset(aRef);
  // If you don't like inline-styles with Reanimated, add this style to the AnimatedLinearGradientInstead.
  // const gradientStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{
  //       translateY: onScroll.value
  //     }]
  //   }
  // })

  return (
    <Animated.ScrollView
      ref={aRef}
      scrollEventThrottle={1000 / 60} // ~16.66
      style={{ backgroundColor: 'transparent' }}>
      <StatusBar hidden={true} />
      <MaskedView
        maskElement={
          <View
            onLayout={(ev) => setMeasures(ev.nativeEvent.layout)}
            style={{ backgroundColor: 'transparent' }}>
            {data.map((item) => (
              <View
                key={item.key}
                style={[
                  styles.messageItem,
                  {
                    backgroundColor: 'red', // Important to apply the gradient effect as a mask
                    alignSelf: item.mine ? 'flex-end' : 'flex-start',
                  },
                ]}>
                <Text style={{ opacity: 0 }}>{item.text}</Text>
              </View>
            ))}
          </View>
        }>
        <View style={{ height: measures.height }}>
          <FlatList
            scrollEnabled={false}
            data={data}
            keyExtractor={(item) => item.key}
            style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}
            removeClippedSubviews={false}
            renderItem={({ item }) => {
              return (
                <View
                  style={[
                    styles.messageItem,
                    {
                      zIndex: item.mine ? -1 : 1, // only display the other messages above the gradient mask, we want to avoid gradient being applied to the other message other than mine.
                      backgroundColor: item.mine ? 'transparent' : '#E4E7EB', // remove the background for my messages because we're using the gradient mask
                      alignSelf: item.mine ? 'flex-end' : 'flex-start',
                    },
                  ]}>
                  <Text style={{ color: item.mine ? 'white' : '#111927' }}>
                    {item.text}
                  </Text>
                </View>
              );
            }}
          />
          <AnimatedLinearGradient
            style={[
              {
                height,
                // Comment this if you are using useAnimatedStyle
                // This is for inline-styling using Reanimated.
                transform: [
                  {
                    translateY: onScroll,
                  },
                ],
              },
              // uncomment this if you're using useAnimatedStyle style.
              // gradientStyle
            ]}
            colors={['#FD84AA', '#A38CF9', '#09E0FF']}
          />
        </View>
      </MaskedView>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  messageItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    margin: 12,
    marginBottom: 8,
    borderRadius: 12,
    maxWidth: width * 0.65,
  },
});
