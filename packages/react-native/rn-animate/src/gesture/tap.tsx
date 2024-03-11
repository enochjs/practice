import { View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function TapGesture() {
  const pressed = useSharedValue(false);

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.value = true;
    })
    .onFinalize(() => {
      pressed.value = false;
    });

  const style = useAnimatedStyle(() => ({
    backgroundColor: pressed.value ? '#FFE04B' : '#B58DF1',
    transform: [{ scale: withTiming(pressed.value ? 1.2 : 1) }],
  }));

  return (
    <View className="flex-1 items-center justify-center">
      <GestureDetector gesture={tap}>
        <Animated.View
          className="w-24 h-24 rounded-full"
          style={[style]}
        ></Animated.View>
      </GestureDetector>
    </View>
  );
}
