import * as React from 'react';
import { StatusBar, Animated, View, StyleSheet, Text } from 'react-native';

export default function App() {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newIndex = index + 1;
      setIndex(newIndex % 11);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [index]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <StatusBar hidden />
      <Progress step={index} steps={10} h={10} />
    </View>
  );
}

function Progress({ step, steps, h }) {
  // const percentage = -100 + 100 * step / steps;
  const [width, setWidth] = React.useState(0);
  // const calcPercentage = React.useCallback(() => (-width + width * step / steps), [width])
  const animatedStep = React.useRef(new Animated.Value(-1000)).current;
  const reactiveAnimated = React.useRef(new Animated.Value(-1000)).current;

  React.useEffect(() => {
    Animated.timing(animatedStep, {
      toValue: reactiveAnimated,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  React.useEffect(() => {
    reactiveAnimated.setValue(-width + (width * step) / steps);
  }, [width, step]);

  return (
    <>
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'Menlo',
          fontWeight: '800',
          marginBottom: 10,
        }}
      >
        {step}/{steps}
      </Text>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.1)',
          height: h,
          overflow: 'hidden',
          borderRadius: h,
        }}
        onLayout={(e) => {
          if (width !== 0) {
            return;
          }
          setWidth(e.nativeEvent.layout.width);
        }}
      >
        <Animated.View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            height: h,
            overflow: 'hidden',
            borderRadius: h,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: [
              {
                translateX: animatedStep,
              },
            ],
          }}
        />
      </View>
    </>
  );
}
