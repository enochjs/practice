import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// @refresh reset 123
export default function WithTiming() {
  const offset = useSharedValue(100);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  useEffect(() => {
    offset.value = withRepeat(withTiming(-100, { duration: 2000 }), -1, true);
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <Animated.View
        className="w-20 h-20 rounded-2xl bg-purple-400"
        style={style}
      ></Animated.View>
    </View>
  );
}
