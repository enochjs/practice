import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Hello from '@/hello';

// Ensure we import the CSS for Tailwind so it's included in hot module reloads.
const ctx = (require as any).context(
  // If this require.context is not inside the root directory (next to the package.json) then adjust this file path
  // to resolve correctly.
  './node_modules/.cache/expo/tailwind'
);
if (ctx.keys().length) ctx(ctx.keys()[0]);


export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Hello />
      <Text className=' text-red-300'>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
