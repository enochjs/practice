import { Button, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export default function WithSequenceWobble() {
  const rotation = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // useEffect(() => {

  const handleWobble = () => {
    rotation.value = withSequence(
      withTiming(-15, { duration: 100 }),
      withTiming(15, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(-5, { duration: 100 }),
      withTiming(5, { duration: 100 }),
      withTiming(0, { duration: 100 }),
    );
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View
        className="bg-purple-400 w-20 h-20 rounded-2xl"
        style={style}
      ></Animated.View>
      <Button title="WOBBLE" onPress={handleWobble}></Button>
    </View>
  );
}
