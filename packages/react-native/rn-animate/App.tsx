import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';
import Hello from '@/hello';
import BasicFirst from '@/basic/first';
import BasicSecond from '@/basic/animatedStyle';
import BasicThird from '@/basic/animatedProps';
import CustomAnimation from '@/basic/customAnimation';
import ApplyModifiers from '@/basic/applyMOdifiers';
import TapGesture from '@/gesture/tap';
import PanGesture from '@/gesture/pan';
import DecayPan from '@/gesture/decayPan';
import AnimationsWithTiming from '@/animations/withTiming';
import AnimationsWithTimingTab from '@/animations/withTimingTab';
import AnimationsWithSpring from '@/animations/withSpring';
import AnimationsWithSpringTab from '@/animations/withSpringTab';
import AnimationsWithDecay from '@/animations/withDecay';
import AnimationsWithSequence from '@/animations/withSequence';
import AnimationsWithSequenceWobble from '@/animations/withSequenceWobble';
// import Test from '@/keyboardAvoidView/test';
import AnimationsWithRepeat from '@/animations/withRepeat';
import AnimationsWithRepeatWobble from '@/animations/withRepeatWobble';
import AnimationsWithDelay from '@/animations/withDelay';
import CoreUseSharedValue from '@/core/useSharedValue';
import CoreUseAnimatedStyle from '@/core/useAnimatedStyle';
import CoreUseDerivedValue from '@/core/useDerivedValue';
import CoreCancelAnimation from '@/core/cancelAnimation';
import ScrollTo from '@/scroll/scrollTo';
// import EventEmitter from 'eventemitter3';

// Ensure we import the CSS for Tailwind so it's included in hot module reloads.
const ctx = (require as any).context(
  // If this require.context is not inside the root directory (next to the package.json) then adjust this file path
  // to resolve correctly.
  './node_modules/.cache/expo/tailwind',
);
if (ctx.keys().length) ctx(ctx.keys()[0]);

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1 items-center justify-center bg-white">
      <ScrollTo />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
