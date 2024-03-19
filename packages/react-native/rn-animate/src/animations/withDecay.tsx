import { View } from 'react-native';
import { Animated } from 'react-native-reanimated';

function WithDecay() {
  return (
    <View className=" justify-center items-center">
      <Animated.View className="bg-purple-400 rounded-2xl w-14 h-14"></Animated.View>
    </View>
  );
}
