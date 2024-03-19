import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import colormap from 'colormap';

const arrnum = 16;
let colors = colormap({
  colormap: 'warm',
  nshades: arrnum + 10,
  format: 'hex',
  alpha: 1,
});

const Progress = ({ step, steps, height, color = '#777777' }) => {
  const [width, setWidth] = React.useState(0);
  const animatedValue = React.useRef(new Animated.Value(-1000)).current;
  const reactive = React.useRef(new Animated.Value(-1000)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  React.useEffect(() => {
    reactive.setValue(-width + (width * step) / steps);
  }, [step, width]);

  return (
    <>
      <Text
        style={{
          fontFamily: 'Menlo',
          fontSize: 12,
          fontWeight: '900',
          marginVertical: 8,
          color: `${color}`,
        }}
      >
        {step}/{steps}
      </Text>
      <View
        onLayout={(e) => {
          const newWidth = e.nativeEvent.layout.width;

          setWidth(newWidth);
        }}
        style={{
          height,
          backgroundColor: `${color}33`,
          borderRadius: height,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height,
            width: '100%',
            borderRadius: height,
            backgroundColor: color,
            position: 'absolute',
            left: 0,
            top: 0,
            transform: [
              {
                translateX: animatedValue,
              },
            ],
          }}
        />
      </View>
    </>
  );
};

export default function App() {
  const [index, setIndex] = React.useState(0);

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIndex((index + 1) % (10 + 1));
  //   }, 500);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [index]);
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {[...Array(arrnum).keys()].map((i) => {
        const max = Math.floor(Math.random() * 40) + 10;
        const step = Math.max(2, Math.floor(Math.random() * max));
        return (
          <Progress
            step={i + 1}
            steps={arrnum}
            height={18}
            key={i}
            color={colors[i]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    padding: 20,
  },
});
