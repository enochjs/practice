import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

// Svg.Circle = Circle;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function UseDerivedValue() {
  const r = useSharedValue(80);
  const rotate = useDerivedValue(() => {
    return `${r.value * 2}deg`;
  });

  const style = useAnimatedProps(() => {
    return {
      r: r.value,
    };
  });

  const rotateStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: rotate.value }],
  }));

  useEffect(() => {
    // todo
    r.value = withRepeat(withTiming(160, { duration: 1000 }), -1, true);
  }, []);

  // @refresh reset
  return (
    <View className="flex-1 justify-center items-center">
      <Svg
        style={{
          width: 400,
          height: 400,
        }}
      >
        <AnimatedCircle
          cx="50%"
          cy="50%"
          fill="#b58df1"
          animatedProps={style}
        />
      </Svg>
      <Animated.View
        className="w-20 h-20 bg-purple-400 rounded-2xl"
        style={rotateStyles}
      ></Animated.View>
    </View>
  );
}
