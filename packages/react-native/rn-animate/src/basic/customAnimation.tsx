import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const duration = 2000;

export default function CustomAnimation() {
  const defaultAnim = useSharedValue(200);
  const linear = useSharedValue(200);

  const animatedDefault = useAnimatedStyle(() => ({
    transform: [{ translateX: defaultAnim.value }],
  }));

  const animatedChanged = useAnimatedStyle(() => ({
    transform: [{ translateX: linear.value }],
  }));

  useEffect(() => {
    linear.value = withRepeat(
      withTiming(-linear.value, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      true,
    );
    defaultAnim.value = withRepeat(
      withTiming(-defaultAnim.value, {
        duration: 2000,
      }),
      -1,
      true,
    );
  }, []);

  return (
    <View>
      <Animated.View
        className="w-24 h-24 rounded-2xl border border-purple-500 items-center justify-center"
        style={[animatedDefault]}
      >
        <Text className=" text-purple-600">INOUT</Text>
      </Animated.View>
      <Animated.View
        className="w-24 h-24 rounded-2xl border border-purple-500 items-center justify-center"
        style={[animatedChanged]}
      >
        <Text className=" text-purple-600">LINEAR</Text>
      </Animated.View>
    </View>
  );
}
