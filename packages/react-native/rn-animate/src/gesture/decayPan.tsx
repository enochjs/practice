import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

const SIZE = 120;

export default function PanGesture() {
  const offset = useSharedValue(0);
  const width = Dimensions.get('window').width;

  const pan = Gesture.Pan()
    .onBegin(() => {
      // console.log('onBegin');
    })
    .onChange((event) => {
      offset.value += event.changeX;
    })
    .onFinalize((event) => {
      offset.value = withDecay({
        velocity: event.velocityX,
        rubberBandEffect: true,
        clamp: [-(width / 2) + SIZE / 2, width / 2 - SIZE / 2],
      });
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <View className="flex-1 items-center justify-center">
      <GestureDetector gesture={pan}>
        <Animated.View
          style={animatedStyles}
          className="w-24 h-24 rounded-2xl bg-purple-400"
        ></Animated.View>
      </GestureDetector>
    </View>
  );
}
