import { View, Button } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// 备注
// 1 不要使用解构
// function App() {
//   let { value } = sv; // don't do this
//   console.log(value); // you can read the value just fine
//   value += 50; // but this won't update the styles
// }

// 2. 不要分开赋值
// function App() {
//   const sv = useSharedValue({ x: 0, y: 0 });

//   sv.value.x = 50; // Reanimated loses reactivity 🚨

//   sv.value = { x: 50, y: 0 }; // ✅
// }

// 数组和复杂对象的修改请使用 .modify 方法
// function App() {
//   const sv = useSharedValue([1, 2, 3]);

//   sv.value.push(1000); // Reanimated loses reactivity 🚨

//   sv.value = [...sv.value, 1000]; // works, but creates a new copy ⚠️

//   sv.modify((value) => {
//     'worklet';
//     value.push(1000); // ✅
//     return value;
//   });
// }

export default function UseSharedValue() {
  const width = useSharedValue(80);

  const style = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  const handlePress = () => {
    width.value = withTiming(width.value + 30, { duration: 500 });
  };

  // @refresh reset

  return (
    <View className="flex-1 justify-center items-center">
      <Animated.View
        className="w-20 h-20 bg-purple-400 rounded-2xl"
        style={style}
      ></Animated.View>

      <Button title="CLICK ME" onPress={handlePress}></Button>
    </View>
  );
}
