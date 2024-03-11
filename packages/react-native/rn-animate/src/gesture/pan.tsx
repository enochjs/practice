import { View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export default function PanGesture() {
  const pressed = useSharedValue(false);
  const offset = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      // console.log('onBegin');
      pressed.value = true;
    })
    .onChange((event) => {
      offset.value = event.translationX;
    })
    .onFinalize(() => {
      offset.value = withSpring(0);
      pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value },
      { scale: withTiming(pressed.value ? 1.2 : 1) },
    ] as const,
    backgroundColor: pressed.value ? '#FFE04B' : '#b58df1',
  }));

  return (
    <View className="flex-1 items-center justify-center">
      <GestureDetector gesture={pan}>
        <Animated.View
          style={animatedStyles}
          className="w-24 h-24 rounded-full bg-purple-400"
        ></Animated.View>
      </GestureDetector>
    </View>
  );
}
