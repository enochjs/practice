import { Button, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// remark
// 1. 不要在callback中改 useSharedValue 的值， 可能造成死循环
// function App() {
//   const sv = useSharedValue(0);
//   const animatedStyles = useAnimatedStyle(() => {
//     sv.value = withTiming(1); // Don't do this!
//     return { opacity: sv.value };
//   });
// }
// 2. useAnimatedStyle 只能在 Animated component中使用
// 3. 不变的属性不要放在 useAnimatedStyle 中，避免不比较的计算
// 4. The callback passed to the useAnimatedStyle is first run on the JavaScript thread and immediately after on the UI thread.
// This may cause an error if you write your code as if it's running on UI thread only.
// To avoid this, you can use the global._WORKLET variable to check if the code is running on the UI thread:
// 传递给 useAnimatedStyle 的回调首先在 JavaScript 线程上运行，紧接着在 UI 线程上运行。如果将代码编写为仅在 UI 线程上运行，则可能会导致错误。为了避免这种情况，可以使用 global _ WORKlet 变量检查代码是否在 UI 线程上运行:
// function App() {
//   const animatedStyles = useAnimatedStyle(() => {
//     if (global._WORKLET) {
//       // UI thread only code
//     } else {
//       // JS thread fallback code
//     }
//   });
// }
export default function UseAnimatedStyle() {
  const offset = useSharedValue(-100);
  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offset.value,
        },
      ],
    };
  });

  // @refresh reset

  const handlePress = () => {
    offset.value = withTiming(offset.value + 50, {
      duration: 500,
      easing: Easing.elastic(2),
    });
  };

  return (
    <View className="flex-1 justify-center">
      <Animated.View
        className="w-20 h-20 bg-purple-400 rounded-2xl"
        style={style}
      ></Animated.View>
      <Button title="CLICK ME" onPress={handlePress}></Button>
    </View>
  );
}
