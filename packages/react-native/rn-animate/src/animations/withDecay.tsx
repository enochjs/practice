import { Dimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// @refresh reset
export default function WithDecay() {
  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const width = Dimensions.get('window').width;

  const pan = Gesture.Pan()
    .onChange((e) => {
      offset.value += e.changeX;
    })
    .onEnd((e) => {
      offset.value = withDecay({
        velocity: e.velocityX,
        rubberBandEffect: true,
        rubberBandFactor: 0.8,
        clamp: [-(width / 2) + 40, width / 2 - 40],
      });
    });

  return (
    <View className=" justify-center items-center">
      <GestureDetector gesture={pan}>
        <Animated.View
          className="bg-purple-400 rounded-2xl w-20 h-20"
          style={style}
        ></Animated.View>
      </GestureDetector>
    </View>
  );
}
