import { View, Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

// @refresh reset 123
export default function WithSpringTab() {
  const offset = useSharedValue(800);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const handlePressLeft = () => {
    // const newOffset = offset.value - (160 + 2 * 30);
    offset.value = withSpring(offset.value - 160 - 60);
  };

  const handlePressRight = () => {
    offset.value = withSpring(offset.value + 160 + 60);
  };

  return (
    <View className="flex-1 items-center relative my-16 overflow-hidden justify-center w-full">
      <View className="absolute z-10 w-full flex-row items-center justify-between">
        <Pressable
          className="w-[50px] h-[50px] rounded-full bg-gray-400 flex items-center justify-center ml-8"
          onPress={handlePressLeft}
        >
          <Text className="text-green-600">{'<'}</Text>
        </Pressable>
        <Pressable
          className="w-[50px] h-[50px] rounded-full bg-gray-400 flex items-center justify-center mr-8"
          onPress={handlePressRight}
        >
          <Text className="text-green-600">{'>'}</Text>
        </Pressable>
      </View>
      <Animated.View className="flex-row" style={style}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => {
          return (
            <View
              key={index}
              className="w-[160px] h-[160px] rounded-2xl my-8 bg-purple-400 m-2"
            ></View>
          );
        })}
      </Animated.View>
    </View>
  );
}
