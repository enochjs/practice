import { useEffect } from 'react';
import { Button, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const OFFSET = 140;

export default function CancelAnimation() {
  const offset = useSharedValue(-OFFSET);

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const handleStart = () => {
    offset.value = withRepeat(
      withTiming(offset.value > 0 ? -OFFSET : OFFSET, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  };

  const handleStop = () => {
    cancelAnimation(offset);
  };

  useEffect(() => {
    handleStart();
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <View>
        <Animated.View
          className="bg-purple-400 w-20 h-20 rounded-2xl"
          style={style}
        ></Animated.View>
      </View>
      <View>
        <Button title="WOBBLE" onPress={handleStart}></Button>
        <Button title="CANCEL" onPress={handleStop}></Button>
      </View>
    </View>
  );
}
