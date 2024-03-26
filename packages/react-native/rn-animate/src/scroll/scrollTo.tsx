import { View, Text, Button } from 'react-native';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

const WIDTH = 80;
const LENGTH = 10;
const SPACING = 8;

export default function ScrollTo() {
  const animationRef = useAnimatedRef();
  const scroll = useSharedValue(0);

  useDerivedValue(() => {
    scrollTo(animationRef, 0, scroll.value * (WIDTH + SPACING), true);
  });

  const handleUp = () => {
    scroll.value = Math.max(0, scroll.value - 1);
  };

  const handleDown = () => {
    scroll.value = Math.min(LENGTH, scroll.value + 1);
  };

  return (
    <View className="flex-1 items-center py-20">
      <View>
        <Button title="SCROLL 1 UP" onPress={handleUp}></Button>
      </View>
      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        ref={animationRef}
      >
        {
          // Add your code here
          Array.from({ length: LENGTH }).map((_, index) => (
            <View
              key={index}
              className="h-20 w-20 bg-purple-400 rounded-xl mb-2 items-center justify-center"
            >
              <Text className="text-white">{index + 1}</Text>
            </View>
          ))
        }
      </Animated.ScrollView>
      <View>
        <Button title="SCROLL 1 DOWN" onPress={handleDown}></Button>
      </View>
    </View>
  );
}
