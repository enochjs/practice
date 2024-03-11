import { Button, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const OFFSET = 40;
const TIME = 250;

export default function ApplyModifiers() {
  const offset = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const handleShake = () => {
    // todo
    offset.value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 5, true),
      withTiming(0, { duration: TIME / 2 }),
    );
  };

  return (
    <View>
      <Animated.View
        className="w-24 h-24 rounded-2xl border bg-purple-400 border-purple-500 items-center justify-center"
        style={[style]}
      ></Animated.View>
      <Button title="SHAKE" onPress={handleShake} />
    </View>
  );
}
