import { ScrollView, View, Text, TextInput, SafeAreaView } from 'react-native';
import Animate from 'react-native-reanimated';
import KeyboardAvoidingView from './index';

export default function Test() {
  const handleLayout = (e) => {
    console.log('=====e', e.nativeEvent.layout);
  };

  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((ev) => {
    scrollY.value = ev.contentOffset.x;
  });

  return (
    <SafeAreaView>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <Animate.ScrollView className="flex-1 w-full" onScroll={onScroll}>
          <View className="flex-1 w-full" onLayout={handleLayout}>
            <TextInput placeholder="test input 1" />
            <View className="h-96 w-full bg-red-400">
              <Text>1</Text>
            </View>
            <TextInput placeholder="test input 2" />
            <View className="h-96 bg-red-400">
              <Text>2</Text>
            </View>
            <View className="h-96 bg-red-400">
              <Text>3</Text>
            </View>
            <TextInput placeholder="test input" />
          </View>
        </Animate.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
function useAnimatedScrollHandler(arg0: (ev: any) => void) {
  throw new Error('Function not implemented.');
}
function useSharedValue(arg0: number) {
  throw new Error('Function not implemented.');
}
