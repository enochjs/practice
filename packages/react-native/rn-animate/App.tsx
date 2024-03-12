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
      {/* <BasicFirst /> */}
      {/* <BasicSecond /> */}
      {/* <BasicThird /> */}
      {/* <CustomAnimation /> */}
      {/* <ApplyModifiers /> */}
      {/* <TapGesture /> */}
      {/* <PanGesture /> */}
      {/* <DecayPan /> */}
      {/* <AnimationsWithTiming /> */}
      <AnimationsWithTimingTab />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
