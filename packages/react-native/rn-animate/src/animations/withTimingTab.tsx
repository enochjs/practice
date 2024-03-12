import { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// @refresh reset 123
export default function WithTimingTab() {
  const offset = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const tabs = [
    { label: 'Home', value: 'home' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' },
  ];

  const handlePress = useCallback((index) => {
    return () => {
      offset.value = withTiming(80 * index);
    };
  }, []);

  return (
    <View className="flex-1 justify-center">
      <View className="flex-row">
        {tabs.map((tab, index) => {
          return (
            <Pressable
              key={tab.value}
              className="w-20"
              onPress={handlePress(index)}
            >
              <Text className="text-center">{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Animated.View
        className="w-20 h-2 rounded-2xl bg-purple-400"
        style={[style]}
      ></Animated.View>
    </View>
  );
}
