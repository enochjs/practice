import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

export default function WithRepeat() {
  const rotate = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value * 360}deg` }],
    };
  });

  // @refresh reset

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.back(2) }),
      -1,
      false,
    );
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View
        className="h-20 w-20 rounded-2xl bg-purple-500"
        style={style}
      ></Animated.View>
    </View>
  );
}
