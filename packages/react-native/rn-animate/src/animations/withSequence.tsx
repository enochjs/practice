import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const initialOffset = 140;
const duration = 800;

export default function WithSequence() {
  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  useEffect(() => {
    offset.value = withRepeat(
      withSequence(
        withTiming(-initialOffset, { duration, easing: Easing.cubic }),
        withTiming(0, { duration, easing: Easing.cubic }),
        withTiming(initialOffset, { duration, easing: Easing.cubic }),
      ),
      -1,
      true,
    );
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View
        className="bg-purple-400 w-20 h-20 rounded-2xl"
        style={style}
      ></Animated.View>
    </View>
  );
}
