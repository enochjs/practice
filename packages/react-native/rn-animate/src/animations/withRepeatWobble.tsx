import { Button, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export default function WithRepeatWobble() {
  const rotate = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value * 360}deg` }],
    };
  });

  const handleWobble = () => {
    // rotate.value = withRepeat(
    //   withTiming(0.1, { duration: 200, easing: Easing.linear }),
    //   6,
    //   true,
    // );
    rotate.value = withSequence(
      withTiming(-0.1, { duration: 100, easing: Easing.linear }),
      withRepeat(
        withTiming(0.1, { duration: 200, easing: Easing.linear }),
        7,
        true,
      ),
      withTiming(0, { duration: 100, easing: Easing.linear }),
    );
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Animated.View
        className="w-20 h-20 rounded-2xl bg-purple-500"
        style={style}
      ></Animated.View>
      <Button title="WOBBLE" onPress={handleWobble}></Button>
    </View>
  );
}
